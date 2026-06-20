import { Theme } from "../config/theme.js";

export class SpritePainter {
  constructor(ctx, tileSize) {
    this.ctx = ctx;
    this.tileSize = tileSize;
  }

  pixelRect(x, y, w, h, color, shade = Theme.shadow) {
    this.ctx.fillStyle = shade;
    this.ctx.fillRect(Math.floor(x + 3), Math.floor(y + 3), Math.floor(w), Math.floor(h));
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  }

  tile(tile, x, y, pulse) {
    if (tile === "#") this.wall(x, y);
    if (tile === "S") this.spikes(x, y, pulse);
  }

  wall(x, y) {
    this.pixelRect(x, y, this.tileSize, this.tileSize, Theme.wall, "#0a0d12");
    this.ctx.fillStyle = Theme.wallLight;
    this.ctx.fillRect(x + 3, y + 3, this.tileSize - 6, 5);
    this.ctx.fillStyle = Theme.wallDark;
    this.ctx.fillRect(x + 4, y + this.tileSize - 8, this.tileSize - 8, 4);
  }

  spikes(x, y, pulse) {
    this.ctx.fillStyle = "#182230";
    this.ctx.fillRect(x, y + this.tileSize - 6, this.tileSize, 6);
    this.ctx.fillStyle = Theme.spike;
    for (let i = 0; i < 3; i += 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + 5 + i * 9, y + this.tileSize - 6);
      this.ctx.lineTo(x + 10 + i * 9, y + 9 + Math.sin(pulse * 0.08 + i) * 2);
      this.ctx.lineTo(x + 15 + i * 9, y + this.tileSize - 6);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  button(button) {
    const color = button.pressed ? "#b58322" : Theme.coin;
    this.pixelRect(button.x, button.y, button.w, button.h, color, "#0a0d12");
    this.ctx.fillStyle = "#7a4d13";
    this.ctx.fillRect(button.x + 7, button.y + 5, 14, 8);
  }

  breakBlock(block, pulse) {
    if (block.gone) return;
    const x = block.tx * this.tileSize;
    const y = block.ty * this.tileSize;
    const wobble = block.timer === null ? 0 : Math.sin(pulse * 0.85) * 2;
    this.pixelRect(x, y + wobble, this.tileSize, this.tileSize, Theme.steel, "#0a0d12");
    this.ctx.fillStyle = "#a9b7c8";
    this.ctx.fillRect(x + 5, y + 6 + wobble, 21, 4);
    this.ctx.fillStyle = "#596a80";
    this.ctx.fillRect(x + 6, y + 21 + wobble, 20, 4);
  }

  hiddenSpikes(spike) {
    if (!spike.active) return;
    this.ctx.fillStyle = Theme.spike;
    for (let x = spike.x; x < spike.x + spike.w; x += 13) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, spike.y + spike.h);
      this.ctx.lineTo(x + 7, spike.y);
      this.ctx.lineTo(x + 14, spike.y + spike.h);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  door(door, color, locked) {
    this.pixelRect(door.x, door.y, door.w, door.h, color, Theme.shadow);
    this.ctx.fillStyle = locked ? Theme.spike : "#071014";
    this.ctx.fillRect(door.x + 17, door.y + 17, 5, 5);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.globalAlpha = 0.12;
    this.ctx.fillRect(door.x + 5, door.y + 5, 6, 23);
    this.ctx.globalAlpha = 1;
  }

  coin(coin, pulse) {
    if (!coin || coin.taken) return;
    const bob = Math.sin(pulse * 0.07) * 2;
    this.ctx.fillStyle = Theme.coin;
    this.ctx.fillRect(coin.x + 5, coin.y + 1 + bob, 12, 18);
    this.ctx.fillStyle = "#fff0a6";
    this.ctx.fillRect(coin.x + 8, coin.y + 5 + bob, 4, 6);
  }

  key(key, pulse) {
    if (!key || key.taken) return;
    const bob = Math.sin(pulse * 0.08) * 3;
    this.ctx.fillStyle = Theme.key;
    this.ctx.fillRect(key.x, key.y + bob + 6, 14, 8);
    this.ctx.fillRect(key.x + 13, key.y + bob + 8, 15, 4);
    this.ctx.fillRect(key.x + 23, key.y + bob + 12, 4, 5);
    this.ctx.fillStyle = "#e8fffb";
    this.ctx.fillRect(key.x + 4, key.y + bob + 8, 4, 4);
  }

  saw(saw, pulse) {
    if (!saw.active) return;
    this.ctx.save();
    this.ctx.translate(saw.x, saw.y);
    this.ctx.rotate(pulse * 0.12);
    this.ctx.fillStyle = "#b8c6d6";
    for (let i = 0; i < 12; i += 1) {
      this.ctx.rotate(Math.PI / 6);
      this.ctx.fillRect(-3, -saw.r - 5, 6, 11);
    }
    this.ctx.fillStyle = Theme.saw;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, saw.r, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = "#172232";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, saw.r * 0.42, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  sawTrack(saw) {
    if (!saw.active || saw.span <= 0) return;
    this.ctx.save();
    this.ctx.globalAlpha = 0.36;
    this.ctx.strokeStyle = "#b8c6d6";
    this.ctx.setLineDash([8, 8]);
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    if (saw.axis === "y") {
      this.ctx.moveTo(saw.baseX, saw.baseY - saw.span);
      this.ctx.lineTo(saw.baseX, saw.baseY + saw.span);
    } else {
      this.ctx.moveTo(saw.baseX - saw.span, saw.baseY);
      this.ctx.lineTo(saw.baseX + saw.span, saw.baseY);
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  springPad(pad) {
    const squash = pad.compression ?? 0;
    this.ctx.fillStyle = "#071014";
    this.ctx.beginPath();
    this.ctx.moveTo(pad.x + 3, pad.y + squash + 3);
    this.ctx.lineTo(pad.x + pad.w + 3, pad.y + squash + 3);
    this.ctx.lineTo(pad.x + pad.w / 2 + 3, pad.y + pad.h + squash + 3);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.fillStyle = Theme.coin;
    this.ctx.beginPath();
    this.ctx.moveTo(pad.x, pad.y + squash);
    this.ctx.lineTo(pad.x + pad.w, pad.y + squash);
    this.ctx.lineTo(pad.x + pad.w / 2, pad.y + pad.h + squash);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.strokeStyle = "#fff0a6";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(pad.x + 4, pad.y + squash + 3);
    this.ctx.lineTo(pad.x + pad.w - 4, pad.y + squash + 3);
    this.ctx.stroke();
  }

  slope(slope) {
    const size = slope.w ?? this.tileSize;
    const points = this.slopePoints(slope.x, slope.y, size, slope.rotation);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => this.ctx.lineTo(point.x, point.y));
    this.ctx.closePath();
    this.ctx.clip();

    for (let y = slope.y; y < slope.y + size; y += this.tileSize) {
      for (let x = slope.x; x < slope.x + size; x += this.tileSize) {
        this.wall(x, y);
      }
    }

    this.ctx.strokeStyle = Theme.wallLight;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    this.ctx.lineTo(points[1].x, points[1].y);
    this.ctx.stroke();
    this.ctx.restore();
  }

  slopePoints(x, y, size, rotation) {
    const r = ((Number(rotation) % 360) + 360) % 360;
    const pad = 0;
    if (r === 90) {
      return [
        { x: x + pad, y: y + pad },
        { x: x + size - pad, y: y + size - pad },
        { x: x + pad, y: y + size - pad },
      ];
    }
    if (r === 180) {
      return [
        { x: x + size - pad, y: y + pad },
        { x: x + pad, y: y + size - pad },
        { x: x + pad, y: y + pad },
      ];
    }
    if (r === 270) {
      return [
        { x: x + pad, y: y + pad },
        { x: x + size - pad, y: y + size - pad },
        { x: x + size - pad, y: y + pad },
      ];
    }
    return [
      { x: x + pad, y: y + size - pad },
      { x: x + size - pad, y: y + pad },
      { x: x + size - pad, y: y + size - pad },
    ];
  }

  triggerZone(trigger, pulse) {
    if (!trigger.visible || trigger.fired) return;
    const alpha = 0.16 + Math.sin(pulse * 0.12) * 0.05;
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = Theme.spike;
    this.ctx.fillRect(trigger.x, trigger.y, trigger.w, trigger.h);
    this.ctx.globalAlpha = 0.75;
    this.ctx.strokeStyle = Theme.spike;
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(trigger.x + 2, trigger.y + 2, trigger.w - 4, trigger.h - 4);
    this.ctx.restore();
  }

  rocket(rocket, pulse) {
    if (rocket.destroyed) return;
    if (rocket.trail?.length) {
      this.ctx.save();
      rocket.trail.forEach((point, index) => {
        const alpha = (index + 1) / rocket.trail.length;
        this.ctx.globalAlpha = alpha * 0.28;
        this.ctx.fillStyle = index % 2 ? Theme.coin : Theme.spike;
        const size = 2 + alpha * 4;
        this.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
      });
      this.ctx.restore();
    }
    if (!rocket.active) {
      this.pixelRect(rocket.spawnX - 3, rocket.spawnY - 6, rocket.w + 6, rocket.h + 12, "#111820", "#071014");
      this.ctx.strokeStyle = Theme.spike;
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(rocket.spawnX - 3, rocket.spawnY - 6, rocket.w + 6, rocket.h + 12);
      return;
    }
    const angle = Number.isFinite(rocket.angle) ? rocket.angle : Math.atan2(rocket.vy, rocket.vx || 0.001);
    this.ctx.save();
    this.ctx.translate(rocket.x + rocket.w / 2, rocket.y + rocket.h / 2);
    this.ctx.rotate(angle);
    this.pixelRect(-rocket.w / 2, -rocket.h / 2, rocket.w, rocket.h, Theme.spike, "#071014");
    this.ctx.fillStyle = "#eef4ff";
    this.ctx.fillRect(4, -4, 7, 8);
    this.ctx.fillStyle = Theme.coin;
    const flame = 8 + Math.sin(pulse * 0.7) * 3;
    this.ctx.fillRect(-rocket.w / 2 - flame, -4, flame, 8);
    this.ctx.fillStyle = "#071014";
    this.ctx.fillRect(rocket.w / 2 - 6, -rocket.h / 2 - 4, 5, 6);
    this.ctx.fillRect(rocket.w / 2 - 6, rocket.h / 2 - 2, 5, 6);
    this.ctx.restore();
  }

  turret(turret, pulse) {
    if (!turret.active) return;
    const blink = Math.sin(pulse * 0.12) > 0;
    this.ctx.save();
    this.pixelRect(turret.x, turret.y, turret.w, turret.h, "#2f4057", "#071014");
    const cx = turret.x + turret.w / 2;
    const cy = turret.y + turret.h / 2;
    this.ctx.translate(cx, cy);
    this.ctx.rotate(turret.aimAngle ?? -Math.PI / 2);
    this.ctx.fillStyle = Theme.spike;
    this.ctx.fillRect(0, -4, turret.w * 0.62, 8);
    this.ctx.fillStyle = blink ? Theme.coin : "#071014";
    this.ctx.fillRect(turret.w * 0.18, -3, 5, 6);
    this.ctx.restore();
  }

  robot(robot, pulse) {
    const shake = robot.state === "charging" ? Math.sin(pulse * 0.55) * 1.5 : 0;
    this.ctx.save();
    this.pixelRect(robot.x, robot.y + shake, robot.w, robot.h, Theme.steel, "#071014");
    this.ctx.fillStyle = robot.state === "charging" ? Theme.spike : Theme.coin;
    const eyeX = robot.direction > 0 ? robot.x + robot.w - 11 : robot.x + 7;
    this.ctx.fillRect(eyeX, robot.y + 10 + shake, 5, 6);
    this.ctx.fillStyle = "#172232";
    this.ctx.fillRect(robot.x + 5, robot.y + robot.h - 7 + shake, robot.w - 10, 4);
    this.ctx.restore();
  }

  flier(flier, pulse) {
    const bob = Math.sin(pulse * 0.12 + flier.x * 0.02) * 2;
    this.ctx.save();
    this.ctx.fillStyle = "#071014";
    this.ctx.beginPath();
    this.ctx.arc(flier.x + flier.w / 2 + 3, flier.y + flier.h / 2 + bob + 3, flier.w / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = "#b583ff";
    this.ctx.beginPath();
    this.ctx.arc(flier.x + flier.w / 2, flier.y + flier.h / 2 + bob, flier.w / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = "#071014";
    this.ctx.fillRect(flier.x + 9, flier.y + 11 + bob, 4, 5);
    this.ctx.fillRect(flier.x + flier.w - 13, flier.y + 11 + bob, 4, 5);
    this.ctx.restore();
  }

  mine(mine, pulse) {
    if (!mine.active || mine.exploded) return;
    const blink = Math.sin(pulse * 0.25) > 0;
    this.ctx.save();
    this.pixelRect(mine.x, mine.y, mine.w, mine.h, Theme.spike, "#071014");
    this.ctx.fillStyle = blink ? Theme.coin : "#071014";
    this.ctx.fillRect(mine.x + mine.w / 2 - 2, mine.y - 4, 4, 4);
    this.ctx.restore();
  }

  wallMine(mine, pulse) {
    if (!mine.active || mine.exploded) return;
    const blink = Math.sin(pulse * 0.12) > 0.72;
    const vertical = mine.side === "left" || mine.side === "right";
    const lightSize = 4;
    this.ctx.save();
    this.pixelRect(mine.x, mine.y, mine.w, mine.h, "#151923", "#071014");
    this.ctx.fillStyle = Theme.spike;
    if (vertical) {
      this.ctx.fillRect(mine.x + Math.floor(mine.w / 2) - 1, mine.y + 4, 2, Math.max(2, mine.h - 8));
    } else {
      this.ctx.fillRect(mine.x + 4, mine.y + Math.floor(mine.h / 2) - 1, Math.max(2, mine.w - 8), 2);
    }
    this.ctx.fillStyle = blink ? Theme.coin : "#3a1120";
    this.ctx.fillRect(
      Math.floor(mine.x + mine.w / 2 - lightSize / 2),
      Math.floor(mine.y + mine.h / 2 - lightSize / 2),
      lightSize,
      lightSize,
    );
    this.ctx.restore();
  }

  bomb(bomb, pulse) {
    if (!bomb.active || bomb.exploded) return;
    const x = bomb.x;
    const y = bomb.y;
    const spark = Math.sin(pulse * 0.35) > 0;
    this.ctx.save();
    this.pixelRect(x + 7, y + 9, 18, 18, "#05070a", "#ff4c6a");
    this.ctx.fillStyle = "#2f4057";
    this.ctx.fillRect(x + 11, y + 6, 10, 6);
    this.ctx.fillStyle = "#b8c6d6";
    this.ctx.fillRect(x + 11, y + 11, 5, 5);
    this.ctx.strokeStyle = "#ffd15c";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x + 20, y + 7);
    this.ctx.lineTo(x + 25, y + 3);
    this.ctx.stroke();
    if (spark) {
      this.ctx.fillStyle = Theme.coin;
      this.ctx.fillRect(x + 25, y + 1, 4, 4);
      this.ctx.fillStyle = Theme.spike;
      this.ctx.fillRect(x + 28, y + 4, 3, 3);
    }
    this.ctx.restore();
  }

  laser(laser, pulse) {
    if (!laser.active) return;
    this.ctx.save();

    if (laser.state === "charging") {
      const blink = 0.45 + Math.sin(pulse * 0.35) * 0.25;
      this.ctx.globalAlpha = blink;
      this.ctx.strokeStyle = "#ffd15c";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(laser.x, laser.y);
      this.ctx.lineTo(laser.targetX, laser.targetY);
      this.ctx.stroke();
      this.ctx.fillStyle = "#ffd15c";
      this.ctx.fillRect(laser.targetX - 4, laser.targetY - 4, 8, 8);
      this.ctx.globalAlpha = 1;
    }

    if (laser.state === "firing") {
      const endX = laser.beamEndX ?? laser.targetX;
      const endY = laser.beamEndY ?? laser.targetY;
      this.ctx.strokeStyle = "#ff4c6a";
      this.ctx.lineWidth = 5;
      this.ctx.beginPath();
      this.ctx.moveTo(laser.x, laser.y);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(laser.x, laser.y);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
    }

    const core = laser.state === "charging" ? "#ffd15c" : laser.state === "firing" ? Theme.spike : Theme.key;
    this.pixelRect(laser.x - 11, laser.y - 11, 22, 22, core, "#071014");
    this.ctx.fillStyle = "#071014";
    this.ctx.fillRect(laser.x - 4, laser.y - 4, 8, 8);
    this.ctx.restore();
  }

  coinGate(gate) {
    const color = gate.open ? Theme.player : Theme.coin;
    this.ctx.save();
    if (gate.open) {
      this.ctx.globalAlpha = 0.45;
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(gate.x + 2, gate.y + 2, gate.w - 4, gate.h - 4);
      this.ctx.restore();
      return;
    }

    this.pixelRect(gate.x, gate.y, gate.w, gate.h, color, Theme.shadow);
    this.ctx.fillStyle = "#071014";
    this.ctx.fillRect(gate.x + 7, gate.y + 8, 14, 5);
    this.ctx.fillRect(gate.x + 7, gate.y + 16, 14, 5);
    this.ctx.fillRect(gate.x + 7, gate.y + 24, 14, 5);
    this.ctx.fillStyle = "#fff0a6";
    this.ctx.fillRect(gate.x + 19, gate.y + 17, 4, 4);
    this.ctx.restore();
  }

  player(player, pulse) {
    if (!player.alive) return;
    const x = Math.floor(player.x);
    const y = Math.floor(player.y + Math.sin(pulse * 0.14) * (player.grounded ? 1 : 0));
    const black = "#020406";
    const eye = "#f7f2df";
    const tailBob = Math.round(Math.sin(pulse * 0.14) * 1);
    const bodyY = y + 7;
    const bodyX = x + 1;

    this.ctx.fillStyle = black;

    if (player.facing > 0) {
      this.ctx.fillRect(x - 10, y + 16 + tailBob, 5, 5);
      this.ctx.fillRect(x - 8, y + 20 + tailBob, 5, 5);
      this.ctx.fillRect(x - 4, y + 22 + tailBob, 6, 4);
    } else {
      this.ctx.fillRect(x + player.w + 5, y + 16 + tailBob, 5, 5);
      this.ctx.fillRect(x + player.w + 3, y + 20 + tailBob, 5, 5);
      this.ctx.fillRect(x + player.w - 1, y + 22 + tailBob, 6, 4);
    }

    this.ctx.fillRect(bodyX + 3, bodyY + 4, player.w - 5, 14);
    this.ctx.fillRect(bodyX + 0, bodyY + 8, player.w + 1, 11);
    this.ctx.fillRect(bodyX + 4, bodyY + 18, player.w - 7, 3);

    this.ctx.beginPath();
    this.ctx.moveTo(bodyX + 2, bodyY + 5);
    this.ctx.lineTo(bodyX + 7, bodyY - 5);
    this.ctx.lineTo(bodyX + 12, bodyY + 5);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(bodyX + player.w - 12, bodyY + 5);
    this.ctx.lineTo(bodyX + player.w - 7, bodyY - 5);
    this.ctx.lineTo(bodyX + player.w - 2, bodyY + 5);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = eye;
    this.ctx.fillRect(bodyX + 7, bodyY + 11, 3, 6);
    this.ctx.fillRect(bodyX + player.w - 10, bodyY + 11, 3, 6);
  }
}
