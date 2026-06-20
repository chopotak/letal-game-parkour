export class Player {
  constructor(config, spawn) {
    this.w = config.player.width;
    this.h = config.player.height;
    this.spawn(spawn);
    this.hasKey = false;
    this.win = false;
    this.requiredCoins = 0;
  }

  get bounds() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  get hurtbox() {
    return { x: this.x + 3, y: this.y + 3, w: this.w - 6, h: this.h - 5 };
  }

  spawn(spawn) {
    this.x = spawn.x;
    this.y = spawn.y;
    this.vx = 0;
    this.vy = 0;
    this.grounded = false;
    this.alive = true;
    this.facing = 1;
    this.lastGroundTile = null;
    this.touchingWall = 0;
    this.wallContactSide = 0;
    this.wallContactFrames = 0;
    this.wallSliding = false;
    this.wallJumpLockSide = 0;
    this.wallJumpLockTimer = 0;
    this.wallLatchLockTimer = 0;
    this.wallImpactVx = 0;
    this.jumpHoldFrames = 0;
    this.jumpHoldTotalFrames = 0;
    this.slopeContactFrames = 0;
    this.lastSlopeId = null;
    this.ignoreSlopeSolidFrames = 0;
    this.dropThroughSlopeFrames = 0;
    this.dropThroughSpringFrames = 0;
  }
}
