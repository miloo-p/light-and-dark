/**
 * Represents a collectable coin with a spinning animation.
 * @class
 * @extends MovableObject
 */
class Coin extends MovableObject {
  /** @type {number} */
  height = 80;

  /** @type {number} */
  width = 80;

  /** @type {string[]} */
  imagesAnimation = ["img/coin/coin_1.png", "img/coin/coin_2.png"];

  /**
   * Initializes a new coin and starts its animation loop.
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

  /** Starts the visual animation loop. */
  animate() {
    this.setStoppableInterval(() => {
      this.displayAnimation(this.imagesAnimation);
    }, 300);
  }
}
