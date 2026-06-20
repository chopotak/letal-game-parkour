export class EffectSystem {
  constructor() {
    this.particles = [];
  }

  reset() {
    this.particles.length = 0;
  }

  burst(x, y, color, count = 18) {
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const speed = 1.2 + Math.random() * 3.7;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 28 + Math.random() * 24,
        color,
        size: 2 + Math.random() * 5,
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const particle = this.particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.08;
      particle.life -= 1;
      if (particle.life <= 0) this.particles.splice(i, 1);
    }
  }
}
