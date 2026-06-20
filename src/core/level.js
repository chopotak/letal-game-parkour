import { rectsOverlap, tileRect } from "./rect.js";

export class Level {
  constructor(data, tileSize) {
    this.data = data;
    this.tileSize = tileSize;
    this.rows = data.map.map((row) => row.split(""));
    this.widthTiles = this.rows[0].length;
    this.heightTiles = this.rows.length;
    this.pixelWidth = this.widthTiles * tileSize;
    this.pixelHeight = this.heightTiles * tileSize;
    this.breakBlocks = [];
    const hazards = data.hazards ?? {};
    this.hiddenSpikes = (hazards.hiddenSpikes ?? []).map((spike) => this.createHiddenSpike(spike));
    this.saws = (hazards.saws ?? []).map((saw) => this.createSaw(saw));
    this.rockets = (hazards.rockets ?? []).map((rocket) => this.createRocket(rocket));
    this.turrets = (hazards.turrets ?? []).map((turret) => this.createTurret(turret));
    this.robots = (hazards.robots ?? []).map((robot) => this.createRobot(robot));
    this.fliers = (hazards.fliers ?? []).map((flier) => this.createFlier(flier));
    this.mines = (hazards.mines ?? []).map((mine) => this.createMine(mine));
    this.wallMines = (hazards.wallMines ?? []).map((mine) => this.createWallMine(mine));
    this.lasers = (hazards.lasers ?? []).map((laser) => this.createLaser(laser));
    this.slopes = this.mergeSlopeChains((hazards.slopes ?? []).map((slope) => this.createSlope(slope)));
    this.clearSlopeCells();
    this.bombs = (hazards.bombs ?? []).map((bomb) => this.createBomb(bomb));
    this.triggers = (data.triggers ?? []).map((trigger) => this.createTrigger(trigger));
    this.textZones = (data.textZones ?? []).map((zone) => this.createTextZone(zone));
    this.start = { x: tileSize * 2 + 5, y: (this.heightTiles - 4) * tileSize + tileSize - 27 };
    this.collectibles = {
      coins: [],
      requiredCoins: [],
      key: null,
    };
    this.doors = {
      fake: [],
      real: null,
    };
    this.coinGates = [];
    this.buttons = [];
    this.springPads = [];
    this.scanMarkers();
  }

  createHiddenSpike(spike) {
    const height = spike.height ?? 28;
    return {
      ...spike,
      x: spike.tx * this.tileSize,
      y: (spike.ty + 1) * this.tileSize - height,
      w: spike.tiles * this.tileSize,
      h: height,
      active: spike.active ?? false,
      initialActive: spike.active ?? false,
    };
  }

  clearSlopeCells() {
    this.slopes.forEach((slope) => {
      for (let ty = slope.ty; ty < slope.ty + slope.sizeTiles; ty += 1) {
        for (let tx = slope.tx; tx < slope.tx + slope.sizeTiles; tx += 1) {
          if (this.rows[ty]?.[tx] === "#" || this.rows[ty]?.[tx] === "F") {
            this.rows[ty][tx] = ".";
          }
        }
      }
    });
  }

  createSaw(saw) {
    const x = saw.tx * this.tileSize + this.tileSize / 2;
    const y = saw.ty * this.tileSize + this.tileSize / 2;
    return {
      ...saw,
      x,
      y,
      baseX: x,
      baseY: y,
      span: (saw.spanTiles ?? 0) * this.tileSize,
      axis: saw.axis ?? "x",
      active: saw.active ?? true,
      initialActive: saw.active ?? true,
      initialT: saw.t ?? 0,
    };
  }

  createRocket(rocket) {
    return {
      ...rocket,
      x: rocket.tx * this.tileSize + (rocket.offsetX ?? 0),
      y: rocket.ty * this.tileSize + (rocket.offsetY ?? 0),
      spawnX: rocket.tx * this.tileSize + (rocket.offsetX ?? 0),
      spawnY: rocket.ty * this.tileSize + (rocket.offsetY ?? 0),
      w: rocket.w ?? 20,
      h: rocket.h ?? 11,
      vx: 0,
      vy: 0,
      speed: 0,
      age: 0,
      angle: rocket.angle ?? 0,
      initialAngle: rocket.angle ?? 0,
      targetX: rocket.tx * this.tileSize,
      targetY: rocket.ty * this.tileSize,
      active: rocket.active ?? false,
      initialActive: rocket.active ?? false,
      destroyed: false,
      reacquireTimer: 0,
      turnCooldown: 0,
      trail: [],
      accelerationRampFrames: rocket.accelerationRampFrames ?? 50,
    };
  }

  createTurret(turret) {
    const x = turret.tx * this.tileSize + 4;
    const y = turret.ty * this.tileSize + 4;
    return {
      ...turret,
      x,
      y,
      w: this.tileSize - 8,
      h: this.tileSize - 8,
      active: turret.active ?? true,
      initialActive: turret.active ?? true,
      radiusTiles: turret.radiusTiles ?? 10,
      radius: (turret.radiusTiles ?? 10) * this.tileSize,
      cooldownFrames: turret.cooldownFrames ?? 120,
      cooldown: 30,
      rocketSpeed: turret.rocketSpeed ?? turret.maxSpeed ?? 4.2,
      aggression: turret.aggression ?? 8,
      aimAngle: turret.aimAngle ?? 0,
      lastSeenX: null,
      lastSeenY: null,
      accelerationRampFrames: turret.accelerationRampFrames ?? 50,
      rocketWidth: turret.rocketWidth ?? 20,
      rocketHeight: turret.rocketHeight ?? 10,
    };
  }

  createRobot(robot) {
    const direction = robot.direction === "left" ? -1 : 1;
    return {
      ...robot,
      x: robot.tx * this.tileSize + 2,
      y: robot.ty * this.tileSize + 3,
      spawnX: robot.tx * this.tileSize + 2,
      spawnY: robot.ty * this.tileSize + 3,
      w: this.tileSize - 4,
      h: this.tileSize - 5,
      direction,
      initialDirection: direction,
      vx: 0,
      state: "watching",
      cooldown: 0,
      cooldownFrames: robot.cooldownFrames ?? 90,
      maxSpeed: robot.maxSpeed ?? 2.2,
      acceleration: robot.acceleration ?? 0.08,
    };
  }

  createFlier(flier) {
    const areaWidthTiles = flier.areaWidthTiles ?? 6;
    const areaHeightTiles = flier.areaHeightTiles ?? 4;
    const patrol = {
      left: flier.tx * this.tileSize,
      top: flier.ty * this.tileSize,
      right: (flier.tx + areaWidthTiles) * this.tileSize,
      bottom: (flier.ty + areaHeightTiles) * this.tileSize,
    };
    return {
      ...flier,
      x: flier.tx * this.tileSize + 2,
      y: flier.ty * this.tileSize + 2,
      spawnX: flier.tx * this.tileSize + 2,
      spawnY: flier.ty * this.tileSize + 2,
      w: this.tileSize - 4,
      h: this.tileSize - 4,
      direction: flier.direction ?? "right",
      initialDirection: flier.direction ?? "right",
      speed: flier.speed ?? 0.8,
      areaWidthTiles,
      areaHeightTiles,
      patrol,
    };
  }

  createMine(mine) {
    const w = this.tileSize / 2;
    const h = this.tileSize / 3;
    return {
      ...mine,
      x: mine.tx * this.tileSize + (this.tileSize - w) / 2,
      y: mine.ty * this.tileSize + this.tileSize - h - 2,
      w,
      h,
      active: mine.active ?? true,
      initialActive: mine.active ?? true,
      exploded: false,
    };
  }

  createWallMine(mine) {
    const side = mine.side ?? mine.placement ?? "floor";
    const long = Math.round(this.tileSize * 0.56);
    const flat = Math.round(this.tileSize * 0.18);
    const baseX = mine.tx * this.tileSize;
    const baseY = mine.ty * this.tileSize;
    const vertical = side === "left" || side === "right";
    const w = vertical ? flat : long;
    const h = vertical ? long : flat;
    const x = side === "right"
      ? baseX + this.tileSize - w - 2
      : side === "left"
        ? baseX + 2
        : baseX + (this.tileSize - w) / 2;
    const y = side === "ceiling"
      ? baseY + 2
      : side === "floor"
        ? baseY + this.tileSize - h - 2
        : baseY + (this.tileSize - h) / 2;
    return {
      ...mine,
      side,
      x,
      y,
      w,
      h,
      active: mine.active ?? true,
      initialActive: mine.active ?? true,
      exploded: false,
    };
  }

  createLaser(laser) {
    const x = laser.tx * this.tileSize + this.tileSize / 2;
    const y = laser.ty * this.tileSize + this.tileSize / 2;
    const radiusTiles = laser.radiusTiles ?? laser.fireRadiusTiles ?? laser.detectionRadiusTiles ?? 12;
    return {
      ...laser,
      x,
      y,
      radiusTiles,
      detectionRadius: radiusTiles * this.tileSize,
      fireRadius: radiusTiles * this.tileSize,
      chargeFrames: laser.chargeFrames ?? 120,
      fireFrames: laser.fireFrames ?? 18,
      cooldownFrames: laser.cooldownFrames ?? 45,
      state: "idle",
      timer: 0,
      chargeUntil: 0,
      fireUntil: 0,
      cooldownUntil: 0,
      targetX: x,
      targetY: y,
      beamAngle: 0,
      beamEndX: x,
      beamEndY: y,
      active: laser.active ?? true,
      initialActive: laser.active ?? true,
    };
  }

  createSlope(slope) {
    const sizeTiles = Math.max(1, Math.round(Number(slope.sizeTiles ?? 1)));
    return {
      ...slope,
      x: slope.tx * this.tileSize,
      y: slope.ty * this.tileSize,
      w: sizeTiles * this.tileSize,
      h: sizeTiles * this.tileSize,
      sizeTiles,
      rotation: Number(slope.rotation ?? 0),
    };
  }

  mergeSlopeChains(slopes) {
    const used = new Set();
    const merged = [];
    const key = (slope) => `${slope.tx},${slope.ty},${((Number(slope.rotation) % 360) + 360) % 360}`;
    const byKey = new Map(slopes.map((slope) => [key(slope), slope]));

    slopes.forEach((slope) => {
      const rotation = ((Number(slope.rotation) % 360) + 360) % 360;
      const ownKey = key(slope);
      if (used.has(ownKey) || slope.sizeTiles > 1 || (rotation !== 0 && rotation !== 90)) {
        if (!used.has(ownKey)) merged.push(slope);
        used.add(ownKey);
        return;
      }

      const chain = [slope];
      const step = rotation === 0 ? { x: -1, y: 1 } : { x: 1, y: 1 };
      const previousKey = `${slope.tx - step.x},${slope.ty - step.y},${rotation}`;
      if (byKey.has(previousKey)) return;

      used.add(ownKey);
      let tx = slope.tx + step.x;
      let ty = slope.ty + step.y;
      while (byKey.has(`${tx},${ty},${rotation}`)) {
        const next = byKey.get(`${tx},${ty},${rotation}`);
        used.add(key(next));
        chain.push(next);
        tx += step.x;
        ty += step.y;
      }

      if (chain.length === 1) {
        merged.push(slope);
        return;
      }

      const minTx = Math.min(...chain.map((item) => item.tx));
      const minTy = Math.min(...chain.map((item) => item.ty));
      const sizeTiles = chain.length;
      merged.push(this.createSlope({
        ...slope,
        id: `${slope.id ?? "slope"}-merged`,
        tx: minTx,
        ty: minTy,
        sizeTiles,
        mergedFrom: chain.map((item) => item.id),
      }));
    });

    return merged;
  }

  createBomb(bomb) {
    return {
      ...bomb,
      x: bomb.tx * this.tileSize,
      y: bomb.ty * this.tileSize,
      w: this.tileSize,
      h: this.tileSize,
      active: bomb.active ?? true,
      initialActive: bomb.active ?? true,
      exploded: false,
    };
  }

  createTrigger(trigger) {
    return {
      ...trigger,
      x: trigger.tx * this.tileSize,
      y: trigger.ty * this.tileSize,
      w: trigger.wTiles * this.tileSize,
      h: trigger.hTiles * this.tileSize,
      fired: false,
    };
  }

  createTextZone(zone) {
    return {
      ...zone,
      x: zone.tx * this.tileSize,
      y: zone.ty * this.tileSize,
      w: Math.max(1, zone.wTiles ?? 3) * this.tileSize,
      h: Math.max(1, zone.hTiles ?? 3) * this.tileSize,
      text: zone.text ?? "",
    };
  }

  scanMarkers() {
    for (let ty = 0; ty < this.rows.length; ty += 1) {
      for (let tx = 0; tx < this.rows[ty].length; tx += 1) {
        const tile = this.rows[ty][tx];
        const x = tx * this.tileSize;
        const y = ty * this.tileSize;
        if (tile === "P") {
          this.start = { x: x + 5, y: y + this.tileSize - 27 };
          this.rows[ty][tx] = ".";
        }
        if (tile === "C") {
          this.collectibles.coins.push({ id: `coin${this.collectibles.coins.length}`, x: x + 8, y: y + 5, w: 18, h: 20, taken: false });
          this.rows[ty][tx] = ".";
        }
        if (tile === "M") {
          this.collectibles.requiredCoins.push({
            id: `requiredCoin${this.collectibles.requiredCoins.length}`,
            x: x + 8,
            y: y + 5,
            w: 18,
            h: 20,
            taken: false,
          });
          this.rows[ty][tx] = ".";
        }
        if (tile === "K") {
          this.collectibles.key = { x: x + 7, y: y + 7, w: 28, h: 20, taken: false };
          this.rows[ty][tx] = ".";
        }
        if (tile === "B") {
          this.buttons.push({ id: `button${this.buttons.length}`, x: x + 4, y: y + 10, w: this.tileSize - 8, h: this.tileSize - 10, pressed: false });
          this.rows[ty][tx] = ".";
        }
        if (tile === "T") {
          let run = 0;
          while (this.rows[ty][tx + run] === "T") run += 1;
          this.springPads.push({
            id: `spring${this.springPads.length}`,
            x: x + 2,
            y: y + 4,
            w: run * this.tileSize - 4,
            h: this.tileSize - 4,
            tx,
            ty,
            compression: 0,
            targetCompression: 0,
            wasContact: false,
          });
          for (let i = 0; i < run; i += 1) {
            this.rows[ty][tx + i] = ".";
          }
        }
        if (tile === "E") {
          this.doors.fake.push({
            id: `fakeDoor${this.doors.fake.length}`,
            x,
            y: y - 2,
            w: 28,
            h: 34,
            hitbox: { x: x - 6, y: y - 10, w: this.tileSize + 12, h: this.tileSize + 18 },
            sprung: false,
          });
          this.rows[ty][tx] = ".";
        }
        if (tile === "D") {
          this.doors.real = {
            x,
            y: y - 2,
            w: 28,
            h: 34,
            hitbox: { x: x - 6, y: y - 10, w: this.tileSize + 12, h: this.tileSize + 18 },
          };
          this.rows[ty][tx] = ".";
        }
        if (tile === "G") {
          this.coinGates.push({
            id: `coinGate${this.coinGates.length}`,
            x,
            y: y - 2,
            w: 28,
            h: 34,
            requiredCount: this.data.coinGateRequires ?? 3,
            open: false,
          });
          this.rows[ty][tx] = ".";
        }
        if (tile === "X") {
          this.bombs.push(this.createBomb({ id: `bomb${this.bombs.length}`, tx, ty, active: true }));
          this.rows[ty][tx] = ".";
        }
        if (tile === "W") {
          this.wallMines.push(this.createWallMine({ id: `wallMine${this.wallMines.length}`, tx, ty, side: "floor", active: true }));
          this.rows[ty][tx] = ".";
        }
        if (tile === "F") {
          this.breakBlocks.push({ tx, ty, timer: null, gone: false });
        }
      }
    }
  }

  resetDynamicState() {
    this.hiddenSpikes.forEach((spike) => {
      spike.active = false;
    });
    this.breakBlocks.forEach((block) => {
      block.timer = null;
      block.gone = false;
    });
    this.saws.forEach((saw) => {
      saw.active = saw.initialActive;
      saw.x = saw.baseX;
      saw.y = saw.baseY;
      saw.t = saw.initialT ?? saw.t;
    });
    this.rockets = this.rockets.filter((rocket) => !rocket.temporary);
    this.rockets.forEach((rocket) => {
      rocket.active = rocket.initialActive;
      rocket.x = rocket.spawnX;
      rocket.y = rocket.spawnY;
      rocket.vx = 0;
      rocket.vy = 0;
      rocket.speed = 0;
      rocket.age = 0;
      rocket.angle = rocket.initialAngle;
      rocket.targetX = rocket.spawnX;
      rocket.targetY = rocket.spawnY;
      rocket.destroyed = false;
      rocket.reacquireTimer = 0;
      rocket.turnCooldown = 0;
      rocket.trail = [];
    });
    this.turrets.forEach((turret) => {
      turret.active = turret.initialActive;
      turret.cooldown = 30;
      turret.lastSeenX = null;
      turret.lastSeenY = null;
      turret.aimAngle = turret.aimAngle ?? 0;
    });
    this.robots.forEach((robot) => {
      robot.x = robot.spawnX;
      robot.y = robot.spawnY;
      robot.vx = 0;
      robot.direction = robot.initialDirection;
      robot.state = "watching";
      robot.cooldown = 0;
    });
    this.fliers.forEach((flier) => {
      flier.x = flier.spawnX;
      flier.y = flier.spawnY;
      flier.direction = flier.initialDirection;
    });
    this.mines.forEach((mine) => {
      mine.active = mine.initialActive;
      mine.exploded = false;
    });
    this.wallMines.forEach((mine) => {
      mine.active = mine.initialActive;
      mine.exploded = false;
    });
    this.lasers.forEach((laser) => {
      laser.active = laser.initialActive;
      laser.state = "idle";
      laser.timer = 0;
      laser.chargeUntil = 0;
      laser.fireUntil = 0;
      laser.cooldownUntil = 0;
      laser.targetX = laser.x;
      laser.targetY = laser.y;
      laser.beamAngle = 0;
      laser.beamEndX = laser.x;
      laser.beamEndY = laser.y;
    });
    this.bombs.forEach((bomb) => {
      bomb.active = bomb.initialActive;
      bomb.exploded = false;
    });
    this.springPads.forEach((pad) => {
      pad.compression = 0;
      pad.targetCompression = 0;
      pad.wasContact = false;
    });
    this.triggers.forEach((trigger) => {
      trigger.fired = false;
    });
    this.hiddenSpikes.forEach((spike) => {
      spike.active = spike.initialActive;
    });
    this.buttons.forEach((button) => {
      button.pressed = false;
    });
    this.setCoinGateState(0);
  }

  resetFullState() {
    this.resetDynamicState();
    this.collectibles.coins.forEach((coin) => {
      coin.taken = false;
    });
    this.collectibles.requiredCoins.forEach((coin) => {
      coin.taken = false;
    });
    if (this.collectibles.key) this.collectibles.key.taken = false;
    this.doors.fake.forEach((door) => {
      door.sprung = false;
    });
  }

  setCoinGateState(count) {
    this.coinGates.forEach((gate) => {
      gate.open = count >= gate.requiredCount;
    });
  }

  tileAt(tx, ty) {
    if (ty < 0 || ty >= this.rows.length || tx < 0 || tx >= this.rows[0].length) {
      return "#";
    }
    const broken = this.breakBlocks.some((block) => block.tx === tx && block.ty === ty && block.gone);
    if (broken) return ".";
    return this.rows[ty][tx];
  }

  isSolid(tx, ty) {
    return this.tileAt(tx, ty) === "#" || this.tileAt(tx, ty) === "F";
  }

  solidRectsNear(rect) {
    const minTx = Math.floor(rect.x / this.tileSize) - 1;
    const maxTx = Math.floor((rect.x + rect.w) / this.tileSize) + 1;
    const minTy = Math.floor(rect.y / this.tileSize) - 1;
    const maxTy = Math.floor((rect.y + rect.h) / this.tileSize) + 1;
    const solids = [];

    for (let ty = minTy; ty <= maxTy; ty += 1) {
      for (let tx = minTx; tx <= maxTx; tx += 1) {
        if (this.isSolid(tx, ty)) solids.push({ ...tileRect(tx, ty, this.tileSize), tx, ty, tile: this.tileAt(tx, ty) });
      }
    }

    this.coinGates.forEach((gate) => {
      if (gate.open) return;
      if (rectsOverlap(rect, gate)) {
        solids.push({ ...gate, tx: Math.floor(gate.x / this.tileSize), ty: Math.floor(gate.y / this.tileSize), tile: "G" });
      }
    });

    return solids;
  }

  slopesNear(rect) {
    return this.slopes.filter((slope) => rectsOverlap(rect, slope));
  }

  slopeAt(tx, ty) {
    return this.slopes.find((slope) =>
      tx >= slope.tx &&
      tx < slope.tx + slope.sizeTiles &&
      ty >= slope.ty &&
      ty < slope.ty + slope.sizeTiles
    ) ?? null;
  }

  obstacleRectsNear(rect) {
    return [...this.solidRectsNear(rect), ...this.slopesNear(rect)];
  }

  triggerBreakBlock(tx, ty) {
    const block = this.breakBlocks.find((item) => item.tx === tx && item.ty === ty);
    if (block && block.timer === null) {
      block.timer = 44;
      return block;
    }
    return null;
  }

  updateBreakBlocks(onBreak) {
    this.breakBlocks.forEach((block) => {
      if (block.timer !== null && block.timer > 0) block.timer -= 1;
      if (block.timer === 0 && !block.gone) {
        block.gone = true;
        onBreak(block);
      }
    });
  }
}
