class ShadowEnergy extends MovableObject {
  height = 60;
  width = 60;

  images = [
    "img/shadow-energy/1_energy_bottle_on_ground.png",
    "img/shadow-energy/2_energy_bottle_on_ground.png",
  ];

  constructor(x, y) {
    super();
    let randomIndex = Math.floor(Math.random() * this.images.length);
    this.loadimage(this.images[randomIndex]);
    this.x = x;
    this.y = y + 75;
  }

  draw(ctx) {
    super.draw(ctx);
    this.handleParticles(ctx, this.width / 2, 15, 0.03);
  }
}
