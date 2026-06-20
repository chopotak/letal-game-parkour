export class PerformanceMonitor {
  constructor(config) {
    this.config = config.performance;
    this.visible = this.config.debugOverlay;
    this.lastNow = null;
    this.history = [];
    this.longFrames = [];
    this.current = {
      frameMs: 0,
      updateMs: 0,
      renderMs: 0,
      fps: 0,
      updateSteps: 0,
      fpsCap: this.config.initialFpsCap,
    };
  }

  toggle() {
    this.visible = !this.visible;
  }

  beginFrame(now) {
    const frameMs = this.lastNow === null ? 0 : now - this.lastNow;
    this.lastNow = now;
    this.current.frameMs = frameMs;
    return performance.now();
  }

  markUpdate(start, updateSteps) {
    this.current.updateMs = performance.now() - start;
    this.current.updateSteps = updateSteps;
    return performance.now();
  }

  markRender(start) {
    this.current.renderMs = performance.now() - start;
    this.current.fps = this.current.frameMs > 0 ? 1000 / this.current.frameMs : 0;
    this.history.push({ ...this.current });
    if (this.history.length > this.config.historySize) this.history.shift();
  }

  average(key) {
    if (this.history.length === 0) return 0;
    return this.history.reduce((sum, frame) => sum + frame[key], 0) / this.history.length;
  }

  max(key) {
    if (this.history.length === 0) return 0;
    return Math.max(...this.history.map((frame) => frame[key]));
  }

  detectLongFrame(context) {
    if (this.current.frameMs < this.config.longFrameMs) return null;
    const event = {
      at: new Date().toLocaleTimeString(),
      frameMs: this.current.frameMs,
      updateMs: this.current.updateMs,
      renderMs: this.current.renderMs,
      ...context,
    };
    this.longFrames.push(event);
    if (this.longFrames.length > 20) this.longFrames.shift();
    return event;
  }

  snapshot() {
    return {
      visible: this.visible,
      frameMs: this.current.frameMs,
      updateMs: this.current.updateMs,
      renderMs: this.current.renderMs,
      fps: this.current.fps,
      avgFrameMs: this.average("frameMs"),
      maxFrameMs: this.max("frameMs"),
      avgUpdateMs: this.average("updateMs"),
      avgRenderMs: this.average("renderMs"),
      updateSteps: this.current.updateSteps,
      fpsCap: this.current.fpsCap,
      longFrames: this.longFrames,
    };
  }

  setFpsCap(fpsCap) {
    this.current.fpsCap = fpsCap;
  }
}
