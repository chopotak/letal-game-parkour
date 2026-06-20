import { GameConfig } from "../config/gameConfig.js";
import { Theme } from "../config/theme.js";
import { Player } from "../entities/player.js";
import { EffectSystem } from "../entities/effectSystem.js";
import { Level } from "./level.js";
import { PerformanceMonitor } from "./performanceMonitor.js";
import { PhysicsWorld } from "./physicsWorld.js";
import { rectsOverlap } from "./rect.js";

export class Game {
  constructor({ canvas, levels, input, renderer, ui }) {
    this.config = GameConfig;
    this.canvas = canvas;
    this.levels = levels;
    this.selectedLevelId = levels[0]?.id ?? null;
    this.level = null;
    this.player = null;
    this.input = input;
    this.renderer = renderer;
    this.ui = ui;
    this.physics = new PhysicsWorld(this.config);
    this.physicsMode = this.config.initialPhysicsMode ?? "classic";
    this.physics.setMode(this.physicsMode);
    this.effects = new EffectSystem();
    this.performanceMonitor = new PerformanceMonitor(this.config);
    this.deaths = 0;
    this.freeze = 0;
    this.startedAt = performance.now();
    this.last = performance.now();
    this.hintTimer = 0;
    this.frameRequest = null;
    this.boundLoop = (now) => this.loop(now);
    this.lastLongFrameLog = 0;
    this.lastRenderNow = 0;
    this.fpsCapIndex = this.config.performance.fpsOptions.indexOf(this.config.performance.initialFpsCap);
    if (this.fpsCapIndex < 0) this.fpsCapIndex = 1;
    this.fpsCap = this.config.performance.fpsOptions[this.fpsCapIndex];
    this.performanceMonitor.setFpsCap(this.fpsCap);
    this.state = "menu";
    this.hitboxesVisible = false;
    this.currentLevelEntry = null;
  }

  start() {
    this.state = "menu";
    this.ui.showMainMenu(true);
    this.ui.showPauseMenu(false);
    this.ui.showEditorMenu(false);
    this.ui.setSelectedLevel(this.selectedLevelId);
    this.ui.setSelectedPhysicsMode(this.physicsMode);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.last = performance.now();
        this.scheduleFrame();
      }
    });
    this.scheduleFrame();
  }

  scheduleFrame() {
    if (this.frameRequest !== null || document.hidden) return;
    this.frameRequest = requestAnimationFrame(this.boundLoop);
  }

  resetGame() {
    if (!this.level || !this.player) return;
    this.deaths = 0;
    this.startedAt = performance.now();
    this.lastRenderNow = 0;
    this.freeze = 0;
    this.player.hasKey = false;
    this.player.requiredCoins = 0;
    this.player.win = false;
    this.level.resetFullState();
    this.player.spawn(this.level.start);
    this.effects.reset();
    this.setWinState(false);
    this.ui.setDeaths(this.deaths);
    this.ui.setRestartVisible(false);
    this.ui.showMessage(this.level.data.messages[0]);
  }

  playFromMenu() {
    this.loadSelectedLevel();
    this.resetGame();
    this.state = "playing";
    this.ui.showMainMenu(false);
    this.ui.showPauseMenu(false);
    this.ui.showEditorMenu(false);
  }

  pause() {
    if (this.state !== "playing") return;
    this.state = "paused";
    this.ui.showPauseMenu(true);
  }

  resume() {
    if (this.state !== "paused") return;
    if (this.player?.win) return;
    this.state = "playing";
    this.ui.showPauseMenu(false);
  }

  togglePause() {
    if (this.state === "playing") {
      this.pause();
      return;
    }
    if (this.state === "paused") this.resume();
  }

  backToMenu() {
    this.state = "menu";
    this.level = null;
    this.player = null;
    this.effects.reset();
    this.renderer.resetStaticLayer();
    this.ui.setRestartVisible(false);
    this.setWinState(false);
    this.ui.showMainMenu(true);
    this.ui.showPauseMenu(false);
    this.ui.showEditorMenu(false);
  }

  restartLevel() {
    if (!this.level) this.loadSelectedLevel();
    this.resetGame();
    this.state = "playing";
    this.ui.showMainMenu(false);
    this.ui.showPauseMenu(false);
    this.ui.showEditorMenu(false);
  }

  loop(now) {
    this.frameRequest = null;
    if (document.hidden) return;
    const frameStart = this.performanceMonitor.beginFrame(now);
    if (this.state === "playing") this.ui.setTimer(this.startedAt, now);

    if (this.state === "playing" && this.level && this.player) this.update(now);
    const renderStart = this.performanceMonitor.markUpdate(frameStart, 1);
    const shouldRender = now - this.lastRenderNow >= 1000 / this.fpsCap - 0.5;
    if (!shouldRender) {
      this.performanceMonitor.markRender(renderStart);
      this.scheduleFrame();
      return;
    }

    this.lastRenderNow = now;
    if (this.level && this.player && this.state !== "menu") {
      this.renderer.draw({
        level: this.level,
        player: this.player,
        effects: this.effects,
        performance: this.performanceMonitor.snapshot(),
        physicsMode: this.physicsMode,
        hitboxesVisible: this.hitboxesVisible,
      });
    } else {
      this.renderer.clear();
    }
    this.performanceMonitor.markRender(renderStart);
    if (this.level && this.player) this.reportLongFrame(now);
    this.scheduleFrame();
  }

  update(now) {
    if (this.freeze > 0) {
      this.freeze -= 1;
      this.effects.update();
      return;
    }

    this.updateSaws();
    this.updateRobots();
    this.updateFliers();
    this.updateTurrets();
    this.updateRockets();
    this.updateLasers(now);
    if (this.player.alive && !this.player.win) {
      this.handleSlopeDropInput();
      this.physics.moveActor(
        this.player,
        this.level,
        this.input.state,
        () => this.input.consumeJumpPressed(),
        () => this.effects.burst(this.player.x + this.player.w / 2, this.player.y + this.player.h, "#b8c6d6", 8),
        (side) => this.effects.burst(
          this.player.x + (side > 0 ? this.player.w : 0),
          this.player.y + this.player.h * 0.55,
          "#7b8ea7",
          3,
        ),
      );
      this.updateTriggers();
      this.updateSpringPads();
      this.handlePickupsAndDoors();
      this.checkHazards();
      if (!this.updateTextZones(now)) this.updateHints(now);
    }
    this.effects.update();
  }

  updateSaws() {
    this.level.saws.forEach((saw) => {
      if (!saw.active) return;
      saw.t += 0.026 * saw.speed;
      const offset = Math.sin(saw.t) * saw.span;
      saw.x = saw.baseX + (saw.axis === "y" ? 0 : offset);
      saw.y = saw.baseY + (saw.axis === "y" ? offset : 0);
    });
  }

  updateRobots() {
    this.level.robots.forEach((robot) => {
      if (robot.cooldown > 0) {
        robot.cooldown -= 1;
        return;
      }
      if (robot.state === "watching" && this.robotCanSeePlayer(robot)) {
        robot.state = "charging";
        this.effects.burst(robot.x + robot.w / 2, robot.y + robot.h / 2, Theme.coin, 8);
      }
      if (robot.state !== "charging") return;

      robot.vx += robot.direction * robot.acceleration;
      robot.vx = Math.max(-robot.maxSpeed, Math.min(robot.maxSpeed, robot.vx));
      robot.x += robot.vx;

      const hit = this.level.obstacleRectsNear(robot).find((tile) => rectsOverlap(robot, tile));
      if (!hit) return;
      if (robot.vx > 0) robot.x = hit.x - robot.w;
      if (robot.vx < 0) robot.x = hit.x + hit.w;
      robot.vx = 0;
      robot.direction *= -1;
      robot.state = "watching";
      robot.cooldown = robot.cooldownFrames ?? 90;
      this.effects.burst(robot.x + robot.w / 2, robot.y + robot.h / 2, Theme.steel, 12);
    });
  }

  robotCanSeePlayer(robot) {
    const robotY = robot.y + robot.h / 2;
    const playerY = this.player.y + this.player.h / 2;
    if (Math.abs(robotY - playerY) > this.config.canvas.tileSize * 0.55) return false;
    const robotX = robot.x + robot.w / 2;
    const playerX = this.player.x + this.player.w / 2;
    if (robot.direction > 0 && playerX <= robotX) return false;
    if (robot.direction < 0 && playerX >= robotX) return false;
    return !this.lineBlocked(robotX, playerX, robotY);
  }

  lineBlocked(fromX, toX, y) {
    return this.segmentBlocked(fromX, y, toX, y);
  }

  segmentBlocked(fromX, fromY, toX, toY) {
    const tileSize = this.config.canvas.tileSize;
    const distance = Math.hypot(toX - fromX, toY - fromY);
    const steps = Math.max(1, Math.ceil(distance / (tileSize / 3)));
    for (let i = 1; i < steps; i += 1) {
      const t = i / steps;
      const tx = Math.floor((fromX + (toX - fromX) * t) / tileSize);
      const ty = Math.floor((fromY + (toY - fromY) * t) / tileSize);
      if (this.level.isSolid(tx, ty) || this.level.slopeAt(tx, ty)) return true;
    }
    return false;
  }

  updateFliers() {
    this.level.fliers.forEach((flier) => {
      const nextDirection = this.choosePatrolDirection(flier);
      flier.direction = nextDirection;
      const vector = this.directionVector(nextDirection);
      flier.x += vector.x * flier.speed;
      flier.y += vector.y * flier.speed;
      this.clampFlierToPatrol(flier);
    });
  }

  choosePatrolDirection(flier) {
    const current = flier.direction ?? "right";
    const probe = this.nextFlierRect(flier, current);
    if (this.flierInsidePatrol(probe, flier) && !this.level.obstacleRectsNear(probe).some((tile) => rectsOverlap(probe, tile))) {
      return current;
    }
    const order = ["right", "down", "left", "up"];
    const index = Math.max(0, order.indexOf(current));
    for (let i = 1; i <= order.length; i += 1) {
      const direction = order[(index + i) % order.length];
      const next = this.nextFlierRect(flier, direction);
      if (this.flierInsidePatrol(next, flier) && !this.level.obstacleRectsNear(next).some((tile) => rectsOverlap(next, tile))) {
        return direction;
      }
    }
    return this.oppositeDirection(current);
  }

  nextFlierRect(flier, direction) {
    const vector = this.directionVector(direction);
    return {
      x: flier.x + vector.x * Math.max(2, flier.speed + 1),
      y: flier.y + vector.y * Math.max(2, flier.speed + 1),
      w: flier.w,
      h: flier.h,
    };
  }

  flierInsidePatrol(rect, flier) {
    const patrol = flier.patrol;
    if (!patrol) return true;
    return rect.x >= patrol.left && rect.y >= patrol.top && rect.x + rect.w <= patrol.right && rect.y + rect.h <= patrol.bottom;
  }

  clampFlierToPatrol(flier) {
    const patrol = flier.patrol;
    if (!patrol) return;
    flier.x = Math.max(patrol.left, Math.min(flier.x, patrol.right - flier.w));
    flier.y = Math.max(patrol.top, Math.min(flier.y, patrol.bottom - flier.h));
  }

  chooseFlierDirection(flier) {
    const current = flier.direction ?? "right";
    const candidates = [current, "up", "right", "down", "left", this.oppositeDirection(current)];
    const unique = [...new Set(candidates)];
    return unique.find((direction) => this.canFlierMove(flier, direction)) ?? this.oppositeDirection(current);
  }

  canFlierMove(flier, direction) {
    const vector = this.directionVector(direction);
    const probe = {
      x: flier.x + vector.x * Math.max(2, flier.speed + 1),
      y: flier.y + vector.y * Math.max(2, flier.speed + 1),
      w: flier.w,
      h: flier.h,
    };
    return !this.level.obstacleRectsNear(probe).some((tile) => rectsOverlap(probe, tile));
  }

  directionVector(direction) {
    if (direction === "left") return { x: -1, y: 0 };
    if (direction === "right") return { x: 1, y: 0 };
    if (direction === "up") return { x: 0, y: -1 };
    return { x: 0, y: 1 };
  }

  oppositeDirection(direction) {
    if (direction === "left") return "right";
    if (direction === "right") return "left";
    if (direction === "up") return "down";
    return "up";
  }

  updateTurrets() {
    this.level.turrets.forEach((turret) => {
      if (!turret.active) return;
      turret.cooldown -= 1;
      const playerX = this.player.x + this.player.w / 2;
      const playerY = this.player.y + this.player.h / 2;
      const turretX = turret.x + turret.w / 2;
      const turretY = turret.y + turret.h / 2;
      const canSeePlayer = this.turretCanSeePlayer(turret, playerX, playerY);
      if (canSeePlayer) {
        turret.lastSeenX = playerX;
        turret.lastSeenY = playerY;
      }
      const aimX = turret.lastSeenX ?? playerX;
      const aimY = turret.lastSeenY ?? playerY;
      turret.aimAngle = Math.atan2(aimY - turretY, aimX - turretX);
      if (!canSeePlayer) return;
      if (this.turretHasLiveRocket(turret)) return;
      if (turret.cooldown > 0) return;
      this.spawnTurretRocket(turret, playerX, playerY);
      turret.cooldown = turret.cooldownFrames ?? 120;
    });
  }

  turretHasLiveRocket(turret) {
    return this.level.rockets.some((rocket) =>
      rocket.ownerTurretId === turret.id &&
      rocket.active &&
      !rocket.destroyed
    );
  }

  turretCanSeePlayer(turret, playerX, playerY) {
    const turretX = turret.x + turret.w / 2;
    const turretY = turret.y + turret.h / 2;
    if (Math.hypot(playerX - turretX, playerY - turretY) > turret.radius) return false;
    return !this.segmentBlocked(turretX, turretY, playerX, playerY);
  }

  spawnTurretRocket(turret, targetX, targetY) {
    const w = turret.rocketWidth ?? 20;
    const h = turret.rocketHeight ?? 10;
    const x = turret.x + turret.w / 2 - w / 2;
    const y = turret.y + turret.h / 2 - h / 2;
    const angle = Math.atan2(targetY - (y + h / 2), targetX - (x + w / 2));
    this.level.rockets.push({
      id: `${turret.id}-rocket-${performance.now().toFixed(1)}`,
      x,
      y,
      spawnX: x,
      spawnY: y,
      w,
      h,
      vx: 0,
      vy: 0,
      speed: 0,
      age: 0,
      angle,
      initialAngle: angle,
      targetX,
      targetY,
      active: true,
      initialActive: false,
      temporary: true,
      ownerTurretId: turret.id,
      destroyed: false,
      reacquireTimer: 0,
      turnCooldown: 0,
      trail: [],
      accelerationRampFrames: turret.accelerationRampFrames ?? 50,
      acceleration: turret.acceleration ?? 0.075,
      maxSpeed: turret.rocketSpeed ?? turret.maxSpeed ?? 4.2,
      turnRate: turret.turnRate ?? 0.05,
      reactionFrames: turret.reactionFrames ?? 20,
      turnDelayFrames: turret.turnDelayFrames ?? 12,
    });
    this.effects.burst(turret.x + turret.w / 2, turret.y + turret.h / 2, Theme.spike, 10);
  }

  updateRockets() {
    this.level.rockets.forEach((rocket) => {
      if (!rocket.active || rocket.destroyed) return;

      rocket.age = (rocket.age ?? 0) + 1;
      rocket.reacquireTimer -= 1;
      rocket.turnCooldown -= 1;
      if (rocket.reacquireTimer <= 0 && rocket.turnCooldown <= 0) {
        const playerX = this.player.x + this.player.w / 2;
        const playerY = this.player.y + this.player.h / 2;
        const cx = rocket.x + rocket.w / 2;
        const cy = rocket.y + rocket.h / 2;
        if (!this.segmentBlocked(cx, cy, playerX, playerY)) {
          rocket.targetX = playerX;
          rocket.targetY = playerY;
        }
        rocket.reacquireTimer = rocket.reactionFrames ?? 28;
      }

      const cx = rocket.x + rocket.w / 2;
      const cy = rocket.y + rocket.h / 2;
      rocket.trail ??= [];
      rocket.trail.push({ x: cx, y: cy, life: 1 });
      if (rocket.trail.length > 22) rocket.trail.shift();
      const dx = rocket.targetX - cx;
      const dy = rocket.targetY - cy;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const acceleration = rocket.acceleration ?? 0.035;
      const maxSpeed = rocket.maxSpeed ?? 4;
      const rampFrames = Math.max(1, rocket.accelerationRampFrames ?? 50);
      const ramp = Math.max(0.12, Math.min(1, rocket.age / rampFrames));
      const desiredAngle = Math.atan2(dy, dx);
      const turnRate = rocket.turnRate ?? 0.045;
      let delta = desiredAngle - rocket.angle;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      rocket.angle += Math.max(-turnRate, Math.min(turnRate, delta));

      rocket.speed = Math.min(maxSpeed, rocket.speed + acceleration * ramp);
      rocket.vx = Math.cos(rocket.angle) * rocket.speed;
      rocket.vy = Math.sin(rocket.angle) * rocket.speed;

      if (distance < 26 && rocket.turnCooldown <= 0) {
        rocket.turnCooldown = rocket.turnDelayFrames ?? 22;
        rocket.speed *= 0.35;
        rocket.reacquireTimer = 0;
      }

      rocket.x += rocket.vx;
      rocket.y += rocket.vy;

      if (this.rocketHitsSolid(rocket)) {
        this.destroyRocket(rocket);
      }
    });
  }

  rocketHitsSolid(rocket) {
    return this.level.obstacleRectsNear(rocket).some((tile) => rectsOverlap(rocket, tile));
  }

  destroyRocket(rocket) {
    rocket.active = false;
    rocket.destroyed = true;
    rocket.vx = 0;
    rocket.vy = 0;
    rocket.speed = 0;
    this.effects.burst(rocket.x + rocket.w / 2, rocket.y + rocket.h / 2, Theme.spike, 24);
    this.renderer.shake(8);
  }

  updateSpringPads() {
    const maxCompression = this.config.physics.springPadCompression ?? this.config.canvas.tileSize / 2;
    const pressSpeed = this.config.physics.springPadPressSpeed ?? 0.8;
    const releaseSpeed = this.config.physics.springPadReleaseSpeed ?? 0.5;

    this.level.springPads.forEach((pad) => {
      if (this.player.dropThroughSpringFrames > 0) {
        pad.wasContact = false;
        pad.targetCompression = 0;
        return;
      }
      const surfaceBefore = pad.y + pad.compression;
      const playerWasAbove = this.player.prevY + this.player.h <= surfaceBefore + 8;
      const overlapsX = this.player.x < pad.x + pad.w && this.player.x + this.player.w > pad.x;
      const feetY = this.player.y + this.player.h;
      const hitsTop = feetY >= surfaceBefore - 2 && feetY <= surfaceBefore + 20;
      const contact = this.player.vy >= 0 && overlapsX && hitsTop && playerWasAbove;

      const landingImpact = contact && !pad.wasContact && this.player.prevY + this.player.h < surfaceBefore - 2;
      if (landingImpact) pad.targetCompression = maxCompression;
      if (!contact) pad.targetCompression = 0;

      const target = pad.targetCompression;
      const speed = target > pad.compression ? pressSpeed : releaseSpeed;
      if (Math.abs(target - pad.compression) <= speed) {
        pad.compression = target;
      } else {
        pad.compression += Math.sign(target - pad.compression) * speed;
      }

      const surfaceAfter = pad.y + pad.compression;
      if (contact) {
        this.player.y = surfaceAfter - this.player.h;
        this.player.vy = 0;
        this.player.vx *= 0.985;
        this.player.grounded = true;
        this.player.lastGroundTile = { tx: pad.tx, ty: pad.ty, tile: "T" };
      }

      pad.wasContact = contact;
    });
  }

  handleSlopeDropInput() {
    if (!this.input.consumeDownDoublePressed?.()) return;
    if (!this.player.grounded) return;
    const onSlope = this.player.lastGroundTile?.rotation !== undefined;
    const onSpring = this.player.lastGroundTile?.tile === "T";
    if (!onSlope && !onSpring) return;
    if (onSlope) {
      this.player.dropThroughSlopeFrames = 18;
      this.player.ignoreSlopeSolidFrames = Math.max(this.player.ignoreSlopeSolidFrames ?? 0, 18);
    }
    if (onSpring) this.player.dropThroughSpringFrames = 18;
    this.player.grounded = false;
    this.player.y += 5;
    this.player.vy = Math.max(this.player.vy, 1.4);
  }

  updateLasers(now) {
    this.level.lasers.forEach((laser) => {
      if (!laser.active) return;
      const playerX = this.player.x + this.player.w / 2;
      const playerY = this.player.y + this.player.h / 2;
      const distance = Math.hypot(playerX - laser.x, playerY - laser.y);
      const canSeePlayer = distance <= laser.detectionRadius && !this.segmentBlocked(laser.x, laser.y, playerX, playerY);

      if (laser.state === "idle" && canSeePlayer) {
        laser.state = "charging";
        laser.targetX = playerX;
        laser.targetY = playerY;
        laser.beamAngle = Math.atan2(laser.targetY - laser.y, laser.targetX - laser.x);
        laser.chargeUntil = now + (laser.chargeMs ?? 2000);
        this.effects.burst(laser.x, laser.y, Theme.key, 10);
      }

      if (laser.state === "charging" && now >= laser.chargeUntil) {
        laser.state = "firing";
        const beamEnd = this.laserBeamEnd(laser);
        laser.beamEndX = beamEnd.x;
        laser.beamEndY = beamEnd.y;
        laser.fireUntil = now + (laser.fireMs ?? 220);
      }

      if (laser.state === "firing" && now >= laser.fireUntil) {
        laser.state = "cooldown";
        laser.cooldownUntil = now + (laser.cooldownMs ?? 700);
      }

      if (laser.state === "cooldown" && now >= laser.cooldownUntil) {
        laser.state = "idle";
      }
    });
  }

  laserBeamEnd(laser) {
    return this.raycastSolid(laser.x, laser.y, laser.beamAngle, laser.fireRadius ?? laser.detectionRadius ?? 900);
  }

  raycastSolid(x, y, angle, maxDistance) {
    const tileSize = this.config.canvas.tileSize;
    const step = Math.max(4, tileSize / 4);
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    let lastX = x;
    let lastY = y;
    for (let distance = step; distance <= maxDistance; distance += step) {
      const px = x + dx * distance;
      const py = y + dy * distance;
      const tx = Math.floor(px / tileSize);
      const ty = Math.floor(py / tileSize);
      if (this.level.isSolid(tx, ty) || this.level.slopeAt(tx, ty)) return { x: lastX, y: lastY };
      lastX = px;
      lastY = py;
    }
    return { x: x + dx * maxDistance, y: y + dy * maxDistance };
  }

  updateTriggers() {
    const playerBounds = this.player.bounds;

    this.level.buttons.forEach((button) => {
      if (button.pressed || !rectsOverlap(playerBounds, button)) return;
      button.pressed = true;
      this.effects.burst(button.x + 12, button.y + 10, Theme.coin, 16);
      this.applyActions(this.level.data.buttonActions?.[button.id]);
    });

    this.level.triggers.forEach((trigger) => {
      if ((trigger.once ?? true) && trigger.fired) return;
      if (trigger.requiresKey && !this.player.hasKey) return;
      if (!rectsOverlap(playerBounds, trigger)) return;
      trigger.fired = true;
      this.applyActions(trigger.actions);
    });

    if (this.player.grounded && this.player.lastGroundTile?.tile === "F") {
      const block = this.level.triggerBreakBlock(this.player.lastGroundTile.tx, this.player.lastGroundTile.ty);
      if (block) {
        this.ui.showMessage("Эта платформа работает по краткосрочному договору.");
      }
    }

    this.level.updateBreakBlocks((block) => {
      this.effects.burst(block.tx * this.config.canvas.tileSize + 16, block.ty * this.config.canvas.tileSize + 16, Theme.steel, 18);
    });
  }

  handlePickupsAndDoors() {
    const body = this.player.bounds;
    const key = this.level.collectibles.key;

    for (const coin of this.level.collectibles.requiredCoins) {
      if (coin.taken || !rectsOverlap(body, coin)) continue;
      coin.taken = true;
      this.player.requiredCoins += 1;
      this.level.setCoinGateState(this.player.requiredCoins);
      this.effects.burst(coin.x + 9, coin.y + 10, Theme.coin, 22);
      const required = this.level.data.coinGateRequires ?? 3;
      if (this.player.requiredCoins >= required) {
        this.ui.showMessage("Три одинаковые монеты собраны. Проход открылся.");
      } else {
        this.ui.showMessage(`Монета засчитана: ${this.player.requiredCoins}/${required}. Остальные выглядят так же.`);
      }
    }

    for (const coin of this.level.collectibles.coins) {
      if (coin.taken || !rectsOverlap(body, coin)) continue;
      coin.taken = true;
      this.applyActions(this.level.data.coinActions?.[coin.id]);
      this.effects.burst(coin.x + 9, coin.y + 10, Theme.coin, 22);
      this.die("ХАЛЯВНАЯ монетка оказалась очень дорогой.");
      return;
    }

    if (key && !key.taken && rectsOverlap(body, key)) {
      key.taken = true;
      this.player.hasKey = true;
      this.effects.burst(key.x + 9, key.y + 9, Theme.key, 24);
      this.applyActions(this.level.data.onKey);
      if (!this.level.data.onKey?.message) this.ui.showMessage("Ключ забран. Теперь дверь хотя бы обязана притвориться честной.");
    }

    for (const door of this.level.doors.fake) {
      if (door.sprung || !rectsOverlap(body, door.hitbox ?? door)) continue;
      door.sprung = true;
      this.die("Этот выход просто нарисовали с большой уверенностью.");
      return;
    }

    if (this.level.doors.real && rectsOverlap(body, this.level.doors.real.hitbox ?? this.level.doors.real)) {
      if (this.player.hasKey || this.level.data.requiresKeyForExit === false) this.win();
      else this.ui.showMessage("Заперто. Ключ наверху, рядом с шумным кругом.");
    }
  }

  checkHazards() {
    const hurtbox = this.player.hurtbox;
    const tileSize = this.config.canvas.tileSize;
    const minTx = Math.floor(this.player.x / tileSize) - 1;
    const maxTx = Math.floor((this.player.x + this.player.w) / tileSize) + 1;
    const minTy = Math.floor(this.player.y / tileSize) - 1;
    const maxTy = Math.floor((this.player.y + this.player.h) / tileSize) + 1;

    for (let ty = minTy; ty <= maxTy; ty += 1) {
      for (let tx = minTx; tx <= maxTx; tx += 1) {
        if (this.level.tileAt(tx, ty) !== "S") continue;
        const spikeRect = { x: tx * tileSize + 4, y: ty * tileSize + 8, w: tileSize - 8, h: tileSize - 8 };
        if (rectsOverlap(hurtbox, spikeRect)) this.die("Шипы снова победили.");
      }
    }

    this.level.hiddenSpikes.forEach((spike) => {
      if (spike.active && rectsOverlap(hurtbox, spike)) this.die("Сюрприз-шипы. Классика.");
    });

    this.level.saws.forEach((saw) => {
      const dx = hurtbox.x + hurtbox.w / 2 - saw.x;
      const dy = hurtbox.y + hurtbox.h / 2 - saw.y;
      if (saw.active && Math.hypot(dx, dy) < saw.r + 10) this.die("Пила выбрала идеальный тайминг.");
    });

    this.level.rockets.forEach((rocket) => {
      if (rocket.active && rectsOverlap(hurtbox, rocket)) this.die("Ракета догнала тебя с задержкой, но с характером.");
    });

    this.level.robots.forEach((robot) => {
      if (rectsOverlap(hurtbox, robot)) this.die("Робот увидел прямую линию и выбрал насилие.");
    });

    this.level.fliers.forEach((flier) => {
      if (rectsOverlap(hurtbox, flier)) this.die("Летающий робот шел по своему маршруту. Ты тоже.");
    });

    this.level.mines.forEach((mine) => {
      if (!mine.active || mine.exploded) return;
      const feet = { x: this.player.x + 4, y: this.player.y + this.player.h - 4, w: this.player.w - 8, h: 7 };
      if (!rectsOverlap(feet, mine)) return;
      mine.exploded = true;
      mine.active = false;
      this.effects.burst(mine.x + mine.w / 2, mine.y + mine.h / 2, Theme.coin, 16);
      this.effects.burst(mine.x + mine.w / 2, mine.y + mine.h / 2, Theme.spike, 22);
      this.die("Мина была маленькая, но аргумент убедительный.");
    });

    this.level.wallMines.forEach((mine) => {
      if (!mine.active || mine.exploded) return;
      if (!rectsOverlap(hurtbox, mine)) return;
      mine.exploded = true;
      mine.active = false;
      this.effects.burst(mine.x + mine.w / 2, mine.y + mine.h / 2, Theme.coin, 12);
      this.effects.burst(mine.x + mine.w / 2, mine.y + mine.h / 2, Theme.spike, 24);
      this.die("Настенная мина тихо пикнула и сразу перешла к делу.");
    });

    this.level.lasers.forEach((laser) => {
      if (laser.state !== "firing") return;
      const playerX = hurtbox.x + hurtbox.w / 2;
      const playerY = hurtbox.y + hurtbox.h / 2;
      const beamEndX = laser.beamEndX ?? laser.targetX;
      const beamEndY = laser.beamEndY ?? laser.targetY;
      const beamX = beamEndX - laser.x;
      const beamY = beamEndY - laser.y;
      const beamLength = Math.max(1, Math.hypot(beamX, beamY));
      const projection = ((playerX - laser.x) * beamX + (playerY - laser.y) * beamY) / beamLength;
      if (projection < 0 || projection > beamLength) return;
      const dx = Math.cos(laser.beamAngle);
      const dy = Math.sin(laser.beamAngle);
      const distanceToBeam = Math.abs((playerX - laser.x) * dy - (playerY - laser.y) * dx);
      if (distanceToBeam < 8) this.die("Лазер выстрелил туда, где ты был слишком недавно.");
    });

    this.level.bombs.forEach((bomb) => {
      if (!bomb.active || bomb.exploded) return;
      const bombBody = { x: bomb.x + 4, y: bomb.y + 4, w: bomb.w - 8, h: bomb.h - 8 };
      if (!rectsOverlap(hurtbox, bombBody)) return;
      bomb.exploded = true;
      bomb.active = false;
      this.effects.burst(bomb.x + bomb.w / 2, bomb.y + bomb.h / 2, Theme.coin, 18);
      this.effects.burst(bomb.x + bomb.w / 2, bomb.y + bomb.h / 2, Theme.spike, 22);
      this.die("Бомба честно занимала один блок. Этого хватило.");
    });

    if (this.player.y > this.level.pixelHeight + 80) this.die("У подвала внезапно нет пола.");
  }

  updateHints(now) {
    if (now - this.hintTimer < this.config.timing.hintIntervalMs) return;
    this.hintTimer = now;
    const messages = this.level.data.messages;
    this.ui.showMessage(messages[Math.floor(Math.random() * messages.length)]);
  }

  updateTextZones(now) {
    const zone = this.level.textZones.find((item) => rectsOverlap(this.player.bounds, item));
    if (!zone) return false;
    this.hintTimer = now;
    if (zone.text) this.ui.showMessage(zone.text);
    return true;
  }

  applyActions(actions, options = {}) {
    if (!actions) return;
    actions.activateHiddenSpikes?.forEach((id) => this.activateHiddenSpike(id));
    actions.activateSaws?.forEach((id) => this.activateSaw(id));
    actions.activateRockets?.forEach((id) => this.activateRocket(id));
    actions.activateLasers?.forEach((id) => this.activateLaser(id));
    actions.deactivateSaws?.forEach((id) => this.deactivateSaw(id));
    actions.deactivateLasers?.forEach((id) => this.deactivateLaser(id));
    if (actions.message && !options.silent) this.ui.showMessage(actions.message);
  }

  activateHiddenSpike(id) {
    const spike = this.level.hiddenSpikes.find((item) => item.id === id);
    if (spike) spike.active = true;
  }

  activateSaw(id) {
    const saw = this.level.saws.find((item) => item.id === id);
    if (saw) saw.active = true;
  }

  deactivateSaw(id) {
    const saw = this.level.saws.find((item) => item.id === id);
    if (saw) saw.active = false;
  }

  activateLaser(id) {
    const laser = this.level.lasers.find((item) => item.id === id);
    if (!laser) return;
    laser.active = true;
    laser.state = "idle";
    laser.targetX = laser.x;
    laser.targetY = laser.y;
    this.effects.burst(laser.x, laser.y, Theme.key, 12);
  }

  deactivateLaser(id) {
    const laser = this.level.lasers.find((item) => item.id === id);
    if (laser) laser.active = false;
  }

  activateRocket(id) {
    const turret = this.level.turrets.find((item) => item.id === id);
    if (turret) {
      turret.active = true;
      turret.cooldown = 10;
      this.effects.burst(turret.x + turret.w / 2, turret.y + turret.h / 2, Theme.spike, 14);
      return;
    }
    const rocket = this.level.rockets.find((item) => item.id === id);
    if (!rocket || rocket.destroyed) return;
    rocket.active = true;
    rocket.targetX = this.player.x + this.player.w / 2;
    rocket.targetY = this.player.y + this.player.h / 2;
    rocket.speed = 0;
    rocket.age = 0;
    rocket.trail = [];
    rocket.reacquireTimer = rocket.reactionFrames ?? 38;
    this.effects.burst(rocket.x + rocket.w / 2, rocket.y + rocket.h / 2, Theme.spike, 18);
  }

  die(reason) {
    if (!this.player.alive || this.player.win) return;
    this.player.alive = false;
    this.deaths += 1;
    this.freeze = this.config.timing.deathFreezeFrames;
    this.ui.setDeaths(this.deaths);
    this.ui.shake();
    this.renderer.shake(16);
    this.effects.burst(this.player.x + this.player.w / 2, this.player.y + this.player.h / 2, Theme.spike, 32);
    this.ui.showMessage(reason);
    window.setTimeout(() => this.respawn(), this.config.timing.respawnMs);
  }

  respawn() {
    this.player.spawn(this.level.start);
    this.player.requiredCoins = 0;
    this.level.resetDynamicState();
    this.level.collectibles.coins.forEach((coin) => {
      coin.taken = false;
    });
    this.level.collectibles.requiredCoins.forEach((coin) => {
      coin.taken = false;
    });
    this.level.doors.fake.forEach((door) => {
      door.sprung = false;
    });
    if (this.player.hasKey) this.applyActions(this.level.data.onKey, { silent: true });
    this.freeze = 0;
  }

  win() {
    if (this.player.win) return;
    this.player.win = true;
    const elapsedMs = performance.now() - this.startedAt;
    this.effects.burst(this.player.x + this.player.w / 2, this.player.y + this.player.h / 2, Theme.player, 42);
    this.ui.showMessage("Настоящий выход найден. Лабиринт нехотя тебя уважает.");
    this.ui.setRestartVisible(false);
    this.setWinState(true);
    this.state = "paused";
    this.ui.showPauseMenu(true);
    window.dispatchEvent(new CustomEvent("level-completed", {
      detail: {
        levelId: this.selectedLevelId,
        title: this.currentLevelEntry?.title ?? this.level?.data?.name ?? this.selectedLevelId,
        elapsedMs,
        deaths: this.deaths,
      },
    }));
  }

  reportLongFrame(now) {
    const event = this.performanceMonitor.detectLongFrame({
      particles: this.effects.particles.length,
      activeSaws: this.level.saws.filter((saw) => saw.active).length,
      activeRockets: this.level.rockets.filter((rocket) => rocket.active).length,
      activeLasers: this.level.lasers.filter((laser) => laser.active).length,
      activeBombs: this.level.bombs.filter((bomb) => bomb.active).length,
      activeWallMines: this.level.wallMines.filter((mine) => mine.active && !mine.exploded).length,
      activeHiddenSpikes: this.level.hiddenSpikes.filter((spike) => spike.active).length,
      camera: {
        x: Math.round(this.renderer.camera.x),
        y: Math.round(this.renderer.camera.y),
      },
      player: {
        x: Math.round(this.player.x),
        y: Math.round(this.player.y),
        vx: Number(this.player.vx.toFixed(2)),
        vy: Number(this.player.vy.toFixed(2)),
      },
    });
    if (!event || now - this.lastLongFrameLog < 800) return;
    this.lastLongFrameLog = now;
    console.info("[perf] Длинный кадр", event);
  }

  togglePerformanceOverlay() {
    this.performanceMonitor.toggle();
  }

  cycleFpsCap() {
    this.fpsCapIndex = (this.fpsCapIndex + 1) % this.config.performance.fpsOptions.length;
    this.fpsCap = this.config.performance.fpsOptions[this.fpsCapIndex];
    this.performanceMonitor.setFpsCap(this.fpsCap);
    this.ui.showMessage(`Лимит FPS: ${this.fpsCap}`);
  }

  setHitboxesVisible(visible) {
    this.hitboxesVisible = Boolean(visible);
    this.ui.showMessage(this.hitboxesVisible ? "Хитбоксы включены." : "Хитбоксы выключены.");
  }

  setWinState(visible) {
    if (typeof this.ui.setWinState === "function") {
      this.ui.setWinState(visible);
      return;
    }
    this.ui.gamePanelEl?.classList.toggle("is-won", visible);
  }

  selectLevel(levelId) {
    this.selectedLevelId = levelId;
    this.ui.setSelectedLevel(levelId);
  }

  setPhysicsMode(mode) {
    if (!this.config.physicsProfiles?.[mode]) return;
    this.physicsMode = mode;
    this.physics.setMode(mode);
    this.ui.setSelectedPhysicsMode(mode);
    const label = this.config.physicsProfiles[mode].label ?? mode;
    this.ui.showMessage(`Физика: ${label}.`);
  }

  loadSelectedLevel() {
    const selected = this.levels.find((level) => level.id === this.selectedLevelId) ?? this.levels[0];
    this.selectedLevelId = selected.id;
    this.currentLevelEntry = selected;
    if (selected.data.physicsMode && this.config.physicsProfiles?.[selected.data.physicsMode]) {
      this.physicsMode = selected.data.physicsMode;
      this.physics.setMode(selected.data.physicsMode);
      this.ui.setSelectedPhysicsMode(selected.data.physicsMode);
    }
    this.level = new Level(selected.data, this.config.canvas.tileSize);
    this.player = new Player(this.config, this.level.start);
    this.renderer.resetStaticLayer();
    this.renderer.setInitialCamera(this.level, this.player);
    this.ui.setSelectedLevel(selected.id);
    this.ui.setHeader?.(selected.title ?? selected.data.name ?? "Уровень", "текущий уровень");
  }

  openEditor() {
    this.state = "editor";
    this.level = null;
    this.player = null;
    this.effects.reset();
    this.renderer.resetStaticLayer();
    this.ui.setRestartVisible(false);
    this.setWinState(false);
    this.ui.showMainMenu(false);
    this.ui.showPauseMenu(false);
    this.ui.showEditorMenu(true);
  }

  closeEditor() {
    this.state = "menu";
    this.ui.showEditorMenu(false);
    this.ui.showMainMenu(true);
    this.ui.showPauseMenu(false);
  }

  playLevelData(levelData) {
    const id = "editor-level";
    this.setLevelData(id, "Редактор", levelData);
    this.selectedLevelId = id;
    this.loadSelectedLevel();
    this.resetGame();
    this.state = "playing";
    this.ui.showEditorMenu(false);
    this.ui.showMainMenu(false);
    this.ui.showPauseMenu(false);
  }

  setLevelData(id, title, levelData) {
    const existing = this.levels.findIndex((level) => level.id === id);
    const entry = { id, title, data: levelData };
    if (existing >= 0) this.levels[existing] = entry;
    else this.levels.push(entry);
  }
}
