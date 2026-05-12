/**
 * Represents a collectable shadow energy bottle placed within the level.
 * When collected by the player, it restores shadow energy used for casting spells.
 * @class
 * @extends MovableObject
 */
class ShadowEnergy extends MovableObject {
  /**
   * The height of the energy bottle in pixels.
   * @type {number}
   */
  height = 60;

  /**
   * The width of the energy bottle in pixels.
   * @type {number}
   */
  width = 60;

  /**
   * Array storing active magical particles emitted by this item.
   * @type {Particle[]}
   */
  particles = [];

  /**
   * Array of image paths representing different visual variations of the energy bottle.
   * @type {string[]}
   */
  images = [
    "img/shadow-energy/1_energy_bottle_on_ground.png",
    "img/shadow-energy/2_energy_bottle_on_ground.png",
  ];

  /**
   * Initializes a new shadow energy collectable at the specified coordinates.
   * Randomly selects one of the visual variations to make the environment look more organic.
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
   * Renders the item and its magical glowing particles onto the canvas.
   * @override
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the main canvas.
   */
  draw(ctx) {
    this.handleParticles(ctx);
    super.draw(ctx);
  }
}
