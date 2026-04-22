class Particle {
  x;
  y;
  size;
  life = 1.5;
  decay;
  vx;
  vy;

  constructor(startX, startY) {
    this.x = startX + (Math.random() * 60 - 30);
    this.y = startY + Math.random() * 60;
    this.size = Math.random() * 2 + 10;
    this.decay = Math.random() * 0.005 + 0.005;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = Math.random() * -0.5 - 0.1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.size += 0.05;
  }

  draw(ctx) {
    ctx.save();

    ctx.globalAlpha = Math.max(0, this.life);

    ctx.globalCompositeOperation = "lighter";

    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(138, 43, 226, 0.5)";

    ctx.fillStyle = "rgba(84, 31, 133, 0.15)";

    // Partikel zeichnen
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
