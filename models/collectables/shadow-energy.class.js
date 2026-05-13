/**
 * Represents a collectable shadow energy bottle.
 * @class
 * @extends MovableObject
 */
class ShadowEnergy extends MovableObject {
  /** @type {number} */
  height = 60;

  /** @type {number} */
  width = 60;

  /** @type {Particle[]} */
  particles = [];

  /** @type {string[]} */
  images = [
    "img/shadow-energy/1_energy_bottle_on_ground.png",
    "img/shadow-energy/2_energy_bottle_on_ground.png",
  ];

  /**
   * Initializes a new shadow energy collectable with a random visual variation.
   * @param {number} x - The base horizontal coordinate for placement.
   * @param {number} y - The base vertical coordinate.
   */
  constructor(x, y) {
    super();

    // Pick a random variation of the bottle image
    let randomIndex = Math.floor(Math.random() * this.images.length);
    this.loadImage(this.images[randomIndex]);

    this.x = x;
    // Offset the vertical position so it sits naturally on the ground
    this.y = y + 75;
  }

  /**
   * Renders the item and its glowing particles.
   * @override
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   */
  draw(ctx) {
    this.handleParticles(ctx);
    super.draw(ctx);
  }
}
