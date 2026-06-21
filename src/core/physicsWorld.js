import { rectsOverlap } from "./rect.js";

export class PhysicsWorld {
  constructor(config) {
    this.config = config;
    this.mode = config.initialPhysicsMode ?? "classic";
  }

  setMode(mode) {
    if (!this.config.physicsProfiles?.[mode]) return;
    this.mode = mode;
  }

  moveActor(actor, level, input, consumeJumpPressed, onJump, onWallSlide) {
    const physics = this.physicsForLevel(level);
    actor.prevX = actor.x;
    actor.prevY = actor.y;
    actor.touchingWall = 0;
    actor.wallSliding = false;
    if (actor.ignoreSlopeSolidFrames > 0) actor.ignoreSlopeSolidFrames -= 1;
    if (actor.dropThroughSlopeFrames > 0) actor.dropThroughSlopeFrames -= 1;
    if (actor.dropThroughSpringFrames > 0) actor.dropThroughSpringFrames -= 1;
    if (actor.wallLatchLockTimer > 0) actor.wallLatchLockTimer -= 1;

    if (actor.wallJumpLockTimer > 0) {
      actor.wallJumpLockTimer -= 1;
      if (actor.wallJumpLockTimer === 0) actor.wallJumpLockSide = 0;
    }

    const acceleration = actor.grounded ? physics.groundAcceleration : physics.airAcceleration;
    const friction = actor.grounded ? physics.groundFriction : physics.airFriction;
    const horizontalInput = (input.right ? 1 : 0) - (input.left ? 1 : 0);

    if (horizontalInput !== 0 && actor.vx * horizontalInput < 0 && physics.turnFriction) {
      actor.vx *= physics.turnFriction;
    }
    if (horizontalInput !== 0) {
      actor.vx += horizontalInput * acceleration;
      actor.facing = horizontalInput;
    }
    if (horizontalInput === 0) actor.vx *= friction;
    actor.vx = this.clamp(actor.vx, -(physics.maxHorizontalSpeed ?? physics.maxRunSpeed), physics.maxHorizontalSpeed ?? physics.maxRunSpeed);

    if (consumeJumpPressed()) {
      if (actor.grounded) {
        this.startJump(actor, physics.jumpVelocity, physics);
        onJump();
      } else if (actor.wallContactSide !== 0) {
        this.startWallJump(actor, input, physics);
        onJump();
      }
    }

    actor.vy += physics.gravity;
    this.applyJumpHold(actor, input, physics);
    if (!input.jump && actor.vy < -1 && physics.jumpReleaseGravity) actor.vy += physics.jumpReleaseGravity;

    actor.x += actor.vx;
    if (actor.grounded) this.resolveSlopes(actor, level, physics, { horizontal: true, inputX: horizontalInput, onSlopeSlide: onWallSlide });
    this.resolveAxis(actor, level, "x");
    this.resolveSlopeWalls(actor, level);
    if (actor.touchingWall !== 0 && actor.touchingWall === -actor.wallJumpLockSide) actor.wallJumpLockSide = 0;
    if (actor.touchingWall === 0 && actor.wallContactSide !== 0 && this.isStillTouchingWall(actor, level, actor.wallContactSide)) {
      actor.touchingWall = actor.wallContactSide;
    }

    this.applyWallSlide(actor, input, physics, onWallSlide);

    if (input.down && !actor.grounded && actor.vy > -1) actor.vy += physics.fastFallGravity;
    actor.vy = Math.min(physics.maxFallSpeed, actor.vy);

    actor.grounded = false;
    actor.y += actor.vy;
    this.resolveAxis(actor, level, "y");
    this.resolveSlopeSolids(actor, level);
    this.resolveSlopes(actor, level, physics, { inputX: horizontalInput, onSlopeSlide: onWallSlide });

    if (actor.grounded) {
      if (!level.slopes?.includes(actor.lastGroundTile)) {
        actor.slopeContactFrames = 0;
        actor.lastSlopeId = null;
      }
      actor.wallContactSide = 0;
      actor.wallContactFrames = 0;
      actor.wallSliding = false;
      actor.wallJumpLockSide = 0;
      actor.wallJumpLockTimer = 0;
      actor.wallLatchLockTimer = 0;
      actor.wallImpactVx = 0;
      actor.jumpHoldFrames = 0;
      actor.jumpHoldTotalFrames = 0;
    }
  }

  physicsForLevel(level) {
    const levelMode = level?.data?.physicsMode;
    const mode = this.config.physicsProfiles?.[levelMode] ? levelMode : this.mode;
    const profile = this.config.physicsProfiles?.[mode] ?? this.config.physics;
    const overrides = level?.data?.physicsOverrides?.[mode] ?? {};
    const base = { ...profile, ...overrides };
    const tuning = level?.data?.playerTuning ?? {};
    const modernScale = tuning.tuningScale === 15 || tuning.accelerationLevel !== undefined || tuning.verticalLevel !== undefined || tuning.wallJumpLevel !== undefined;
    const speedLevel = this.normalizeTuningLevel(tuning.speedLevel, 14, !modernScale);
    const jumpLevel = this.normalizeTuningLevel(tuning.jumpLevel, 14, !modernScale);
    const accelerationLevel = this.normalizeTuningLevel(tuning.accelerationLevel, 10, false);
    const verticalLevel = this.normalizeTuningLevel(tuning.verticalLevel, 10, false);
    const wallJumpLevel = this.normalizeTuningLevel(tuning.wallJumpLevel, 15, false);
    const speedFactor = this.factorFromLevel(speedLevel, 10, 0.18, 0.55, 1.25);
    const accelerationFactor = this.factorFromLevel(accelerationLevel, 10, 0.42, 1, 1.28);
    const jumpFactor = this.factorFromLevel(jumpLevel, 10, 0.74, 0.74, 1.1);
    const verticalFactor = this.factorFromLevel(verticalLevel, 10, 0.58, 1, 1.24);
    const wallJumpFactor = this.factorFromLevel(wallJumpLevel, 15, 0.45, 0.75, 1);

    return {
      ...base,
      groundAcceleration: base.groundAcceleration * accelerationFactor,
      airAcceleration: base.airAcceleration * accelerationFactor,
      maxRunSpeed: base.maxRunSpeed * speedFactor,
      maxHorizontalSpeed: (base.maxHorizontalSpeed ?? base.maxRunSpeed) * speedFactor,
      jumpVelocity: base.jumpVelocity * jumpFactor,
      jumpHoldForce: base.jumpHoldForce ? base.jumpHoldForce * jumpFactor : base.jumpHoldForce,
      jumpHoldForceEnd: base.jumpHoldForceEnd ? base.jumpHoldForceEnd * jumpFactor : base.jumpHoldForceEnd,
      gravity: base.gravity * verticalFactor,
      fastFallGravity: base.fastFallGravity ? base.fastFallGravity * verticalFactor : base.fastFallGravity,
      maxFallSpeed: base.maxFallSpeed * verticalFactor,
      jumpReleaseGravity: base.jumpReleaseGravity ? base.jumpReleaseGravity * verticalFactor : base.jumpReleaseGravity,
      wallJumpVelocityY: base.wallJumpVelocityY * wallJumpFactor,
      wallClimbJumpVelocityY: (base.wallClimbJumpVelocityY ?? base.wallJumpVelocityY) * wallJumpFactor,
    };
  }

  normalizeTuningLevel(value, fallback, migrateOldFivePointScale = false) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    if (migrateOldFivePointScale && numeric <= 5) return Math.max(10, Math.min(15, Math.round(10 + (numeric - 1) * 1.25)));
    return Math.max(1, Math.min(15, Math.round(numeric)));
  }

  factorFromLevel(level, anchorLevel, minFactor, anchorFactor, maxFactor) {
    if (level <= anchorLevel) {
      const t = (level - 1) / Math.max(1, anchorLevel - 1);
      return minFactor + (anchorFactor - minFactor) * t;
    }
    const t = (level - anchorLevel) / Math.max(1, 15 - anchorLevel);
    return anchorFactor + (maxFactor - anchorFactor) * t;
  }

  startJump(actor, velocity, physics) {
    const jumpedFromSlope = actor.lastGroundTile?.rotation !== undefined;
    actor.vy = velocity;
    if (jumpedFromSlope) {
      actor.vx *= physics.slopeJumpHorizontalCarry ?? 0.25;
      actor.ignoreSlopeSolidFrames = physics.slopeJumpGraceFrames ?? 8;
    }
    actor.grounded = false;
    actor.jumpHoldFrames = physics.jumpHoldFrames ?? 0;
    actor.jumpHoldTotalFrames = actor.jumpHoldFrames;
  }

  startWallJump(actor, input, physics) {
    const jumpSide = actor.wallContactSide;
    const outward = -jumpSide;
    const holdingAway = (jumpSide === 1 && input.left) || (jumpSide === -1 && input.right);
    const holdingToward = (jumpSide === 1 && input.right) || (jumpSide === -1 && input.left);
    const impactCarry = Math.max(0, actor.wallImpactVx * jumpSide) * (physics.wallJumpMomentumCarry ?? 0);

    if (holdingToward && !holdingAway) {
      actor.vx = outward * (physics.wallClimbJumpVelocityX ?? 0.8);
      actor.vy = physics.wallClimbJumpVelocityY ?? physics.wallJumpVelocityY;
    } else {
      let outwardImpulse = physics.wallJumpVelocityX + impactCarry;
      if (holdingAway) outwardImpulse += physics.wallJumpAwayBoost ?? 0;
      actor.vx = actor.vx * (physics.wallJumpMomentumCarry ?? 0) + outward * outwardImpulse;
      actor.vy = physics.wallJumpVelocityY;
    }

    actor.grounded = false;
    actor.jumpHoldFrames = Math.round((physics.jumpHoldFrames ?? 0) * 0.65);
    actor.jumpHoldTotalFrames = actor.jumpHoldFrames;
    actor.wallJumpLockSide = jumpSide;
    actor.wallJumpLockTimer = Number.isFinite(physics.sameWallRelatchFrames) ? physics.sameWallRelatchFrames : -1;
    actor.wallLatchLockTimer = 0;
    actor.wallContactFrames = 0;
    actor.wallContactSide = 0;
    actor.wallImpactVx = 0;
  }

  applyJumpHold(actor, input, physics) {
    if (!input.jump) {
      actor.jumpHoldFrames = 0;
      actor.jumpHoldTotalFrames = 0;
      return;
    }
    if (actor.jumpHoldFrames <= 0 || actor.vy >= 0 || !physics.jumpHoldForce) return;
    const totalFrames = Math.max(1, actor.jumpHoldTotalFrames || actor.jumpHoldFrames);
    const remaining = Math.max(0, Math.min(1, actor.jumpHoldFrames / totalFrames));
    const decay = physics.jumpHoldDecay ?? 1;
    const endForce = physics.jumpHoldForceEnd ?? physics.jumpHoldForce;
    const holdForce = endForce + (physics.jumpHoldForce - endForce) * remaining ** decay;
    actor.vy -= holdForce;
    actor.jumpHoldFrames -= 1;
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  applyWallSlide(actor, input, physics, onWallSlide = () => {}) {
    const side = actor.touchingWall || (actor.wallLatchLockTimer > 0 ? actor.wallContactSide : 0);
    const continuingSameLatch = side !== 0 && actor.wallContactSide === side;
    if (side !== 0 && side === actor.wallJumpLockSide && !continuingSameLatch) {
      actor.wallContactSide = 0;
      actor.wallContactFrames = 0;
      actor.wallSliding = false;
      return;
    }

    if (actor.grounded || side === 0 || actor.vy < 0) {
      if (side === 0 && actor.wallLatchLockTimer <= 0) {
        actor.wallContactSide = 0;
        actor.wallContactFrames = 0;
      }
      return;
    }

    const gripFrames = physics.wallGripFrames ?? 90;
    if (input.down) {
      actor.wallContactSide = 0;
      actor.wallContactFrames = 0;
      actor.wallLatchLockTimer = 0;
      actor.wallSliding = false;
      return;
    }
    const pressingAway = (side === -1 && input.right) || (side === 1 && input.left);
    if (pressingAway && actor.wallContactFrames > gripFrames && actor.wallLatchLockTimer <= 0) {
      actor.wallContactFrames = 0;
      actor.wallContactSide = 0;
      return;
    }

    if (actor.wallContactSide !== side) {
      actor.wallContactSide = side;
      actor.wallContactFrames = 0;
      actor.wallLatchLockTimer = physics.wallLatchControlLockFrames ?? 30;
      if (physics.lockWallOnLatch && actor.wallJumpLockSide === 0) actor.wallJumpLockSide = side;
    }
    actor.wallContactFrames += 1;
    const maxSlideSpeed = actor.wallContactFrames > gripFrames ? physics.wallSlideSpeed : physics.wallGripFallSpeed;
    if (actor.vy > maxSlideSpeed) {
      const wallFriction = physics.wallFriction ?? 0;
      actor.vy = wallFriction > 0 ? maxSlideSpeed + (actor.vy - maxSlideSpeed) * wallFriction : maxSlideSpeed;
    }
    actor.wallSliding = actor.wallContactFrames > gripFrames;
    if (actor.wallSliding && actor.wallContactFrames % 8 === 0) onWallSlide(side);
  }

  isStillTouchingWall(actor, level, side) {
    const probe = {
      x: actor.x + side,
      y: actor.y + 3,
      w: actor.w,
      h: actor.h - 6,
    };
    return level.solidRectsNear(probe).some((tile) => tile.tile !== "U" && rectsOverlap(probe, tile) && !this.tileNearSlope(level, tile));
  }

  resolveSlopes(actor, level, physics, options = {}) {
    if (actor.dropThroughSlopeFrames > 0) return;
    if (!level.slopes?.length) return;
    const probe = {
      x: actor.x,
      y: actor.y - 2,
      w: actor.w,
      h: actor.h + 4,
    };

    for (const slope of level.slopesNear(probe)) {
      const rotation = ((Number(slope.rotation) % 360) + 360) % 360;
      if (rotation === 0 || rotation === 90) this.resolveFloorSlope(actor, slope, rotation, physics, options);
      else this.resolveCeilingSlope(actor, slope, rotation);
    }
  }

  resolveFloorSlope(actor, slope, rotation, physics, options = {}) {
    const contact = this.bestFloorSlopeContact(actor, slope, rotation, options.horizontal ? 8 : 3);
    if (!contact) return;
    const surfaceY = contact.surfaceY;
    const actorBottom = actor.y + actor.h;
    const previousBottom = (actor.prevY ?? actor.y) + actor.h;
    const followingGround = actor.grounded || options.horizontal;

    if (!followingGround) {
      if (actor.vy < 0) return;
      if (previousBottom > surfaceY + 3) return;
      if (actorBottom < surfaceY - Math.max(8, Math.abs(actor.vy) + 6)) return;
      if (actorBottom > surfaceY + Math.max(10, Math.abs(actor.vy) + 8)) return;
    } else {
      const snapUp = 20;
      const snapDown = Math.max(18, Math.abs(actor.vy) + 14);
      if (actorBottom < surfaceY - snapUp || actorBottom > surfaceY + snapDown) return;
    }

    const landedOnSlope = !actor.grounded && previousBottom < surfaceY - 2 && actor.vy > 0;
    actor.y = surfaceY - actor.h;
    actor.vy = Math.min(0, actor.vy);
    actor.grounded = true;
    actor.lastGroundTile = slope;
    if (landedOnSlope) actor.vx *= physics.slopeLandingFriction ?? 0.72;
    if (actor.lastSlopeId === slope.id) actor.slopeContactFrames = (actor.slopeContactFrames ?? 0) + 1;
    else actor.slopeContactFrames = 1;
    actor.lastSlopeId = slope.id;
    const downhill = rotation === 0 ? -1 : 1;
    const inputX = options.inputX ?? 0;
    const movingUphill = actor.vx * downhill < 0;
    const slideAcceleration = physics.slopeSlideAcceleration ?? 0.07;
    const idleSlideAcceleration = physics.slopeIdleSlideAcceleration ?? 0.045;

    let sliding = false;
    if (inputX === downhill) {
      actor.vx += downhill * slideAcceleration;
      sliding = true;
    } else if (inputX === -downhill) {
      if (movingUphill) actor.vx *= physics.slopeUphillFriction ?? 0.992;
    } else {
      actor.vx += downhill * idleSlideAcceleration;
      actor.vx *= physics.slopeIdleFriction ?? 0.995;
      const maxIdleSlide = physics.slopeIdleMaxSpeed ?? 0.9;
      actor.vx = this.clamp(actor.vx, -maxIdleSlide, maxIdleSlide);
      sliding = true;
    }

    if (sliding && (actor.slopeContactFrames ?? 0) % 18 === 0) options.onSlopeSlide?.(downhill);
  }

  resolveSlopeWalls(actor, level) {
    if (!level.slopes?.length) return;
    const probe = { x: actor.x - 4, y: actor.y, w: actor.w + 8, h: actor.h };
    for (const slope of level.slopesNear(probe)) {
      const rotation = ((Number(slope.rotation) % 360) + 360) % 360;
      if (rotation !== 0 && rotation !== 90) continue;
      if (this.canWalkOnSlopeTop(actor, slope, rotation)) continue;

      if (rotation === 0 && actor.vx < 0 && actor.prevX >= slope.x + slope.w - 2) {
        actor.x = slope.x + slope.w;
        actor.vx = 0;
      }
      if (rotation === 90 && actor.vx > 0 && actor.prevX + actor.w <= slope.x + 2) {
        actor.x = slope.x - actor.w;
        actor.vx = 0;
      }
    }
  }

  resolveSlopeSolids(actor, level) {
    if (actor.ignoreSlopeSolidFrames > 0) return;
    if (!level.slopes?.length) return;
    const probe = { x: actor.x - 2, y: actor.y - 4, w: actor.w + 4, h: actor.h + 8 };
    for (const slope of level.slopesNear(probe)) {
      const rotation = ((Number(slope.rotation) % 360) + 360) % 360;
      if (rotation !== 0 && rotation !== 90) continue;

      const cameFromBelow = (actor.prevY ?? actor.y) >= slope.y + slope.h - 2;
      if (actor.vy < 0 && cameFromBelow && this.actorInsideSlopeSolid(actor, slope, rotation)) {
        actor.y = Math.max(actor.y, slope.y + slope.h);
        actor.vy = 0;
        continue;
      }

      const correction = this.slopeSolidCorrection(actor, slope, rotation);
      if (!correction) continue;
      if (correction.axis === "y") {
        actor.y = correction.y;
        actor.vy = Math.min(0, actor.vy);
        actor.grounded = true;
        actor.lastGroundTile = slope;
        if (actor.lastSlopeId === slope.id) actor.slopeContactFrames = (actor.slopeContactFrames ?? 0) + 1;
        else actor.slopeContactFrames = 1;
        actor.lastSlopeId = slope.id;
      } else {
        actor.x = correction.x;
        actor.vx = 0;
      }
    }
  }

  slopeSolidCorrection(actor, slope, rotation) {
    if (!this.actorInsideSlopeSolid(actor, slope, rotation)) return null;
    const supportX = this.slopeSupportX(actor, rotation);
    const clampedX = this.clamp(supportX, slope.x, slope.x + slope.w);
    const surfaceY = this.floorSlopeSurfaceY(slope, rotation, clampedX);
    const previousSurfaceY = this.floorSlopeSurfaceY(slope, rotation, this.clamp(this.slopeSupportX({ ...actor, x: actor.prevX ?? actor.x }, rotation), slope.x, slope.x + slope.w));
    const previousBottom = (actor.prevY ?? actor.y) + actor.h;
    const actorBottom = actor.y + actor.h;
    const cameFromAbove = previousBottom <= previousSurfaceY + Math.max(10, Math.abs(actor.vy ?? 0) + 6);
    const closeToSurface = actorBottom >= surfaceY - 10 && actor.y <= surfaceY + 8;

    if (cameFromAbove || closeToSurface || actor.vy >= 0) {
      return { axis: "y", y: surfaceY - actor.h };
    }

    if (rotation === 0) return { axis: "x", x: slope.x + slope.w };
    return { axis: "x", x: slope.x - actor.w };
  }

  canWalkOnSlopeTop(actor, slope, rotation) {
    const contact = this.bestFloorSlopeContact(actor, slope, rotation, 4);
    if (!contact) return false;
    const surfaceY = contact.surfaceY;
    const bottom = actor.y + actor.h;
    return bottom >= surfaceY - 26 && bottom <= surfaceY + 18;
  }

  bestFloorSlopeContact(actor, slope, rotation, edgeTolerance = 3) {
    const sampleX = this.slopeSupportX(actor, rotation);
    const previousBottom = (actor.prevY ?? actor.y) + actor.h;
    if (sampleX < slope.x - edgeTolerance || sampleX > slope.x + slope.w + edgeTolerance) return null;
    const surfaceY = this.floorSlopeSurfaceY(slope, rotation, sampleX);
    const actorBottom = actor.y + actor.h;
    const distance = Math.abs(actorBottom - surfaceY);
    const nearSurface = actorBottom >= surfaceY - 32 && actorBottom <= surfaceY + Math.max(18, Math.abs(actor.vy ?? 0) + 14);
    const wasAbove = previousBottom <= surfaceY + 34;
    return nearSurface && wasAbove ? { sampleX, surfaceY, distance } : null;
  }

  slopeSupportX(actor, rotation) {
    return rotation === 0 ? actor.x + actor.w - 2 : actor.x + 2;
  }

  actorInsideSlopeSolid(actor, slope, rotation) {
    const samples = [
      actor.x + 2,
      actor.x + actor.w * 0.5,
      actor.x + actor.w - 2,
    ];
    return samples.some((sampleX) => {
      if (sampleX < slope.x || sampleX > slope.x + slope.w) return false;
      const surfaceY = this.floorSlopeSurfaceY(slope, rotation, sampleX);
      return actor.y < slope.y + slope.h && actor.y + actor.h > surfaceY + 2;
    });
  }

  floorSlopeSurfaceY(slope, rotation, worldX) {
    const localX = Math.max(0, Math.min(slope.w, worldX - slope.x));
    return rotation === 0 ? slope.y + slope.h - localX : slope.y + localX;
  }

  resolveCeilingSlope(actor, slope, rotation) {
    const headX = actor.x + actor.w / 2;
    const sampleX = this.clamp(headX, slope.x, slope.x + slope.w);
    const localX = sampleX - slope.x;
    const surfaceY = rotation === 180 ? slope.y + slope.h - localX : slope.y + localX;
    const actorTop = actor.y;
    if (headX < slope.x - 4 || headX > slope.x + slope.w + 4) return;
    if (actorTop <= surfaceY && actor.y + actor.h > slope.y + 2) {
      if (actor.vy < 0 || actorTop > surfaceY - Math.max(16, Math.abs(actor.vy) + 8)) {
        actor.y = surfaceY;
        actor.vy = Math.max(0, actor.vy);
        return;
      }
      if (rotation === 180 && actor.vx > 0) {
        actor.x = slope.x - actor.w;
        actor.vx = 0;
      }
      if (rotation === 270 && actor.vx < 0) {
        actor.x = slope.x + slope.w;
        actor.vx = 0;
      }
    }
  }

  resolveAxis(actor, level, axis) {
    for (const tile of level.solidRectsNear(actor.bounds)) {
      if (!rectsOverlap(actor.bounds, tile)) continue;

      if (axis === "x") {
        if (actor.grounded && actor.y + actor.h <= tile.y + 4) continue;
        if (this.isWalkableSlopeTileJoin(actor, level, tile)) continue;
        if (this.isSlopeTransition(actor, level, tile)) continue;
        if (actor.vx > 0) {
          actor.x = tile.x - actor.w;
          actor.wallImpactVx = actor.vx;
          if (tile.tile !== "U" && !this.tileNearSlope(level, tile)) actor.touchingWall = 1;
        }
        if (actor.vx < 0) {
          actor.x = tile.x + tile.w;
          actor.wallImpactVx = actor.vx;
          if (tile.tile !== "U" && !this.tileNearSlope(level, tile)) actor.touchingWall = -1;
        }
        actor.vx = 0;
      } else {
        if (actor.vy > 0) {
          actor.y = tile.y - actor.h;
          actor.grounded = true;
          actor.lastGroundTile = tile;
        }
        if (actor.vy < 0) actor.y = tile.y + tile.h;
        actor.vy = 0;
      }
    }
  }

  isSlopeTransition(actor, level, tile) {
    if (!actor.grounded || Math.abs(actor.vx) < 0.01) return false;
    const bottom = actor.y + actor.h;
    if (bottom > tile.y + tile.h + 4) return false;
    if (actor.vx > 0) {
      const leftSlope = level.slopeAt(tile.tx - 1, tile.ty);
      const rightSlope = level.slopeAt(tile.tx + 1, tile.ty);
      if (rightSlope && this.isFloorSlopeRotation(rightSlope, 90) && bottom <= tile.y + tile.h + 8) return true;
      return leftSlope && ((Number(leftSlope.rotation) % 360) + 360) % 360 === 0;
    }
    if (actor.vx < 0) {
      const rightSlope = level.slopeAt(tile.tx + 1, tile.ty);
      const leftSlope = level.slopeAt(tile.tx - 1, tile.ty);
      if (leftSlope && this.isFloorSlopeRotation(leftSlope, 0) && bottom <= tile.y + tile.h + 8) return true;
      return rightSlope && this.isFloorSlopeRotation(rightSlope, 90);
    }
    return false;
  }

  isWalkableSlopeTileJoin(actor, level, tile) {
    if (!actor.grounded || !this.tileNearSlope(level, tile, 1)) return false;
    const bottom = actor.y + actor.h;
    if (bottom < tile.y - 36 || bottom > tile.y + tile.h + 8) return false;
    const nearTop = bottom <= tile.y + 14;
    if (nearTop) return true;

    const slope = this.nearestSlopeForTile(level, tile);
    if (!slope) return false;
    const footX = actor.vx >= 0 ? actor.x + actor.w : actor.x;
    const surfaceY = this.floorSlopeSurfaceY(slope, ((Number(slope.rotation) % 360) + 360) % 360, footX);
    return Math.abs(bottom - surfaceY) <= 24 || Math.abs(bottom - tile.y) <= 24;
  }

  nearestSlopeForTile(level, tile) {
    for (let ty = tile.ty - 1; ty <= tile.ty + 1; ty += 1) {
      for (let tx = tile.tx - 1; tx <= tile.tx + 1; tx += 1) {
        const slope = level.slopeAt(tx, ty);
        if (slope) return slope;
      }
    }
    return null;
  }

  isFloorSlopeRotation(slope, rotation) {
    return slope && ((Number(slope.rotation) % 360) + 360) % 360 === rotation;
  }

  tileNearSlope(level, tile, radius = 1) {
    if (!level.slopes?.length || !Number.isFinite(tile.tx) || !Number.isFinite(tile.ty)) return false;
    for (let ty = tile.ty - radius; ty <= tile.ty + radius; ty += 1) {
      for (let tx = tile.tx - radius; tx <= tile.tx + radius; tx += 1) {
        if (level.slopeAt(tx, ty)) return true;
      }
    }
    return false;
  }
}
