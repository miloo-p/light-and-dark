class ShadowEnergy extends MovableObject {
  height = 60;
  width = 60;

  particles = [];

  images = [
    "img/shadow-energy/1_energy_bottle_on_ground.png",
    "img/shadow-energy/2_energy_bottle_on_ground.png",
  ];

  constructor(x, y) {
    super();
    let randomIndex = Math.floor(Math.random() * this.images.length);
    this.loadImage(this.images[randomIndex]);
    this.x = x;
    this.y = y + 75;
  }

  draw(ctx) {
    this.handleParticles(ctx);
    super.draw(ctx);
  }
}
