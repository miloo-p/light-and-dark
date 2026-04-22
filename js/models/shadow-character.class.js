class ShadowCharacter extends MovableObject {
  particles = [];

  constructor() {
    super().loadimage(`img/characters/shadow/01_idle/i1-1.png`);

    this.x = 20;
    this.y = 240;
    this.width = 138;
    this.height = 150;
  }

  handleParticles(ctx) {
    if (Math.random() < 0.05) {
      let centerX = this.x + this.width / 2;
      let centerY = this.y + this.height / 2 + 20;
      this.particles.push(new Particle(centerX, centerY));
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.update();

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      } else {
        // Sonst auf das Canvas zeichnen
        p.draw(ctx);
      }
    }
  }
}
