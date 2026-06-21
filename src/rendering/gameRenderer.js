import { Theme } from "../config/theme.js";
import { SpritePainter } from "./spritePainter.js";

export class GameRenderer {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.config = config;
    this.painter = new SpritePainter(this.ctx, config.canvas.tileSize);
    this.cameraShake = 0;
    this.camera = { x: 0, y: 0 };
    this.staticLayer = null;
    this.staticPainter = null;
    this.staticLevel = null;
  }

  shake(frames) {
    this.cameraShake = frames;
  }

  clear() {
    const { width, height } = this.config.canvas;
    this.ctx.fillStyle = Theme.background;
    this.ctx.fillRect(0, 0, width, height);
  }

  resetStaticLayer() {
    this.staticLayer = null;
    this.staticPainter = null;
    this.staticLevel = null;
    this.camera.x = 0;
    this.camera.y = 0;
  }

  setInitialCamera(level, player) {
    const { width, height } = this.config.canvas;
    const levelCamera = level.data.camera ?? {};
    this.camera.x = player.x + player.w / 2 - width / 2 + (levelCamera.startOffsetX ?? 0);
    this.camera.y = player.y + player.h / 2 - height / 2 + (levelCamera.startOffsetY ?? 0);
    this.camera.x = Math.max(0, Math.min(this.camera.x, Math.max(0, level.pixelWidth - width)));
    this.camera.y = Math.max(0, Math.min(this.camera.y, Math.max(0, level.pixelHeight - height)));
  }

  draw(gameState) {
    const pulse = performance.now() / 16;
    const { level, player, effects } = gameState;
    const { width, height } = this.config.canvas;
    this.updateCamera(level, player);
    this.ensureStaticLayer(level);
    const cameraX = Math.floor(this.camera.x);
    const cameraY = Math.floor(this.camera.y);

    this.ctx.save();
    if (this.cameraShake > 0) {
      this.cameraShake -= 1;
      this.ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
    }

    this.ctx.drawImage(this.staticLayer, cameraX, cameraY, width, height, 0, 0, width, height);
    this.ctx.translate(-cameraX, -cameraY);

    level.breakBlocks.forEach((block) => this.painter.breakBlock(block, pulse));
    level.triggers.forEach((trigger) => this.painter.triggerZone(trigger, pulse));
    level.springPads.forEach((pad) => this.painter.springPad(pad));
    level.buttons.forEach((button) => this.painter.button(button));
    level.hiddenSpikes.forEach((spike) => this.painter.hiddenSpikes(spike));
    level.saws.forEach((saw) => this.painter.sawTrack(saw));
    level.saws.forEach((saw) => this.painter.saw(saw, pulse));
    level.turrets.forEach((turret) => this.painter.turret(turret, pulse));
    level.robots.forEach((robot) => this.painter.robot(robot, pulse));
    level.fliers.forEach((flier) => this.painter.flier(flier, pulse));
    (level.mazeBots ?? []).forEach((bot) => this.painter.mazeBot(bot, pulse));
    level.mines.forEach((mine) => this.painter.mine(mine, pulse));
    level.wallMines.forEach((mine) => this.painter.wallMine(mine, pulse));
    level.rockets.forEach((rocket) => this.painter.rocket(rocket, pulse));
    level.lasers.forEach((laser) => this.painter.laser(laser, pulse));
    level.bombs.forEach((bomb) => this.painter.bomb(bomb, pulse));
    level.collectibles.coins.forEach((coin) => this.painter.coin(coin, pulse));
    level.collectibles.requiredCoins.forEach((coin) => this.painter.coin(coin, pulse));
    this.painter.key(level.collectibles.key, pulse);
    level.doors.fake.forEach((door) => this.painter.door(door, Theme.spike, true));
    level.coinGates.forEach((gate) => this.painter.coinGate(gate));
    if (level.doors.real) this.painter.door(level.doors.real, player.hasKey ? Theme.player : "#526174", !player.hasKey);
    this.painter.player(player, pulse);
    this.drawParticles(effects.particles);
    if (gameState.hitboxesVisible) this.drawHitboxes(level, player);
    this.ctx.restore();
    this.drawPerformanceOverlay(gameState.performance, level, effects, gameState.physicsMode);
  }

  drawHitboxes(level, player) {
    const ctx = this.ctx;
    const tileSize = this.config.canvas.tileSize;
    ctx.save();
    ctx.strokeStyle = "#ff1f3d";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);

    const strokeRect = (rect) => {
      if (!rect) return;
      ctx.strokeRect(Math.floor(rect.x) + 0.5, Math.floor(rect.y) + 0.5, Math.floor(rect.w), Math.floor(rect.h));
    };

    for (let ty = 0; ty < level.rows.length; ty += 1) {
      for (let tx = 0; tx < level.rows[ty].length; tx += 1) {
        if (level.isSolid(tx, ty) || level.tileAt(tx, ty) === "S") {
          strokeRect({ x: tx * tileSize, y: ty * tileSize, w: tileSize, h: tileSize });
        }
      }
    }

    level.slopes.forEach((slope) => {
      const points = this.painter.slopePoints(slope.x, slope.y, slope.w ?? tileSize, slope.rotation);
      ctx.beginPath();
      ctx.moveTo(Math.floor(points[0].x) + 0.5, Math.floor(points[0].y) + 0.5);
      points.slice(1).forEach((point) => ctx.lineTo(Math.floor(point.x) + 0.5, Math.floor(point.y) + 0.5));
      ctx.closePath();
      ctx.stroke();
    });

    strokeRect(player.bounds);
    strokeRect(player.hurtbox);
    [
      ...level.hiddenSpikes,
      ...level.springPads,
      ...level.buttons,
      ...level.triggers,
      ...level.robots,
      ...level.fliers,
      ...(level.mazeBots ?? []),
      ...level.mines.filter((mine) => mine.active && !mine.exploded),
      ...level.wallMines.filter((mine) => mine.active && !mine.exploded),
      ...level.rockets.filter((rocket) => rocket.active && !rocket.destroyed),
      ...level.bombs.filter((bomb) => bomb.active && !bomb.exploded),
      ...level.coinGates.filter((gate) => !gate.open),
      ...level.doors.fake,
      ...level.collectibles.coins.filter((coin) => !coin.taken),
      ...level.collectibles.requiredCoins.filter((coin) => !coin.taken),
    ].forEach(strokeRect);

    level.doors.fake.forEach((door) => strokeRect(door.hitbox));
    if (level.doors.real) {
      strokeRect(level.doors.real);
      strokeRect(level.doors.real.hitbox);
    }
    if (level.collectibles.key && !level.collectibles.key.taken) strokeRect(level.collectibles.key);

    level.saws.forEach((saw) => {
      if (!saw.active) return;
      ctx.beginPath();
      ctx.arc(Math.floor(saw.x) + 0.5, Math.floor(saw.y) + 0.5, saw.r + 10, 0, Math.PI * 2);
      ctx.stroke();
    });

    level.lasers.forEach((laser) => {
      if (!laser.active) return;
      if (laser.state === "firing") {
        ctx.beginPath();
        ctx.moveTo(laser.x, laser.y);
        ctx.lineTo(laser.beamEndX ?? laser.targetX, laser.beamEndY ?? laser.targetY);
        ctx.stroke();
      }
    });

    level.turrets.forEach((turret) => {
      strokeRect(turret);
    });

    ctx.restore();
  }

  ensureStaticLayer(level) {
    if (this.staticLevel === level && this.staticLayer) return;

    const { tileSize } = this.config.canvas;
    this.staticLayer = document.createElement("canvas");
    this.staticLayer.width = level.pixelWidth;
    this.staticLayer.height = level.pixelHeight;
    const staticCtx = this.staticLayer.getContext("2d");
    staticCtx.imageSmoothingEnabled = false;
    this.staticPainter = new SpritePainter(staticCtx, tileSize);

    this.drawStaticBackground(staticCtx, level.pixelWidth, level.pixelHeight);

    for (let ty = 0; ty < level.rows.length; ty += 1) {
      for (let tx = 0; tx < level.rows[ty].length; tx += 1) {
        const tile = level.tileAt(tx, ty);
        if (tile === "F") continue;
        this.staticPainter.tile(tile, tx * tileSize, ty * tileSize, 0);
      }
    }
    level.slopes.forEach((slope) => this.staticPainter.slope(slope));

    (level.data.labels ?? []).forEach((label) => this.drawPixelLabel(staticCtx, label));
    this.staticLevel = level;
  }

  drawPixelLabel(ctx, label) {
    const size = Math.max(8, Math.min(32, Number(label.size ?? 13)));
    const x = Number(label.x ?? 0);
    const y = Number(label.y ?? 0);
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.font = `900 ${size}px "Courier New", monospace`;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#020406";
    ctx.fillText(label.text ?? "", x + 2, y + 2);
    ctx.fillStyle = label.color ?? Theme.text;
    ctx.fillText(label.text ?? "", x, y);
    ctx.restore();
  }

  updateCamera(level, player) {
    const { width, height } = this.config.canvas;
    const levelCamera = level.data.camera ?? {};
    const defaultCamera = this.config.camera ?? {};
    const deadZoneWidth = levelCamera.deadZoneWidth ?? defaultCamera.deadZoneWidth ?? 240;
    const deadZoneHeight = levelCamera.deadZoneHeight ?? defaultCamera.deadZoneHeight ?? 150;
    const left = (width - deadZoneWidth) / 2;
    const right = left + deadZoneWidth;
    const top = (height - deadZoneHeight) / 2;
    const bottom = top + deadZoneHeight;
    const playerX = player.x + player.w / 2 - this.camera.x;
    const playerY = player.y + player.h / 2 - this.camera.y;

    if (playerX < left) this.camera.x -= left - playerX;
    if (playerX > right) this.camera.x += playerX - right;
    if (playerY < top) this.camera.y -= top - playerY;
    if (playerY > bottom) this.camera.y += playerY - bottom;

    this.camera.x = Math.max(0, Math.min(this.camera.x, Math.max(0, level.pixelWidth - width)));
    this.camera.y = Math.max(0, Math.min(this.camera.y, Math.max(0, level.pixelHeight - height)));
  }

  drawStaticBackground(targetCtx, width, height) {
    targetCtx.fillStyle = Theme.background;
    targetCtx.fillRect(0, 0, width, height);
    targetCtx.fillStyle = "#172232";
    for (let y = 0; y < height; y += 64) {
      for (let x = 0; x < width; x += 64) {
        if ((x + y) % 128 === 0) targetCtx.fillRect(x, y, 32, 2);
      }
    }
  }

  drawParticles(particles) {
    particles.forEach((particle) => {
      this.ctx.globalAlpha = Math.max(0, particle.life / 44);
      this.ctx.fillStyle = particle.color;
      this.ctx.fillRect(Math.floor(particle.x), Math.floor(particle.y), particle.size, particle.size);
    });
    this.ctx.globalAlpha = 1;
  }

  drawPerformanceOverlay(performance, level, effects, physicsMode) {
    if (!performance?.visible) return;
    const physicsLabel = this.config.physicsProfiles?.[physicsMode]?.label ?? physicsMode ?? "unknown";
    const lines = [
      `FPS: ${performance.fps.toFixed(0)} | лимит ${performance.fpsCap}`,
      `физика ${physicsLabel}`,
      `кадр ${performance.frameMs.toFixed(1)}мс`,
      `update ${performance.updateMs.toFixed(2)}мс | render ${performance.renderMs.toFixed(2)}мс`,
      `avg ${performance.avgFrameMs.toFixed(1)}мс | max ${performance.maxFrameMs.toFixed(1)}мс`,
      `частицы ${effects.particles.length}`,
      `пилы ${level.saws.filter((saw) => saw.active).length}/${level.saws.length}`,
      `ракеты ${level.rockets.filter((rocket) => rocket.active).length}/${level.rockets.length}`,
      `турели ${level.turrets.filter((turret) => turret.active).length}/${level.turrets.length}`,
      `роботы ${level.robots.length}+${level.fliers.length}`,
      `лазеры ${level.lasers.filter((laser) => laser.active).length}/${level.lasers.length}`,
      `бомбы ${level.bombs.filter((bomb) => bomb.active).length}/${level.bombs.length}`,
      `наст. мины ${level.wallMines.filter((mine) => mine.active && !mine.exploded).length}/${level.wallMines.length}`,
      `скр. шипы ${level.hiddenSpikes.filter((spike) => spike.active).length}/${level.hiddenSpikes.length}`,
      `камера ${Math.round(this.camera.x)}, ${Math.round(this.camera.y)}`,
      `зона камеры ${level.data.camera?.deadZoneWidth ?? this.config.camera?.deadZoneWidth}x${level.data.camera?.deadZoneHeight ?? this.config.camera?.deadZoneHeight}`,
    ];
    const recent = performance.longFrames.slice(-3).reverse();
    recent.forEach((frame) => {
      lines.push(`длинный: ${frame.frameMs.toFixed(1)}мс u${frame.updateMs.toFixed(1)} r${frame.renderMs.toFixed(1)}`);
    });

    const x = 12;
    const y = 12;
    const width = 300;
    const height = 18 + lines.length * 16;
    this.ctx.save();
    this.ctx.globalAlpha = 0.86;
    this.ctx.fillStyle = "#05070a";
    this.ctx.fillRect(x, y, width, height);
    this.ctx.globalAlpha = 1;
    this.ctx.strokeStyle = "#52eadc";
    this.ctx.strokeRect(x, y, width, height);
    this.ctx.fillStyle = "#f7f2df";
    this.ctx.font = "13px Trebuchet MS";
    lines.forEach((line, index) => {
      this.ctx.fillText(line, x + 10, y + 20 + index * 16);
    });
    this.ctx.restore();
  }
}
