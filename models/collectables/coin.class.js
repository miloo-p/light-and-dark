/**
 * Represents a collectable coin placed within the level.
 * Features a simple, continuously looping spinning animation.
 * @class
 * @extends MovableObject
 */
class Coin extends MovableObject {
  /**
   * The height of the coin in pixels.
   * @type {number}
   */
  height = 80;

  /**
   * The width of the coin in pixels.
   * @type {number}
   */
  width = 80;

  /**
   * Array of image paths comprising the coin's spinning animation sequence.
   * @type {string[]}
   */
  imagesAnimation = ["img/coin/coin_1.png", "img/coin/coin_2.png"];

  /**
   * Initializes a new coin at the specified coordinates, loads its animation frames
   * into the cache, and starts the animation loop.
   * @param {number} x - The horizontal spawn coordinate.
   * @param {number} y - The vertical spawn coordinate.
   */
  constructor(x, y) {
    super().loadImage("img/coin/coin_1.png");
    this.loadAnimationImages(this.imagesAnimation);
    this.x = x;
    this.y = y;
    this.animate();
  }

  /**
   * Starts the visual animation loop.
   * Cycles through the spinning frames every 300 milliseconds.
   */
  animate() {
    this.setStoppableInterval(() => {
      this.displayAnimation(this.imagesAnimation);
    }, 300);
  }
}
