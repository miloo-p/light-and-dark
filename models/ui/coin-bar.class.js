/**
 * UI element displaying the number of collected coins as an icon and text.
 * @class
 * @extends DrawableObject
 */
class CoinBar extends DrawableObject {
  /** @type {number} */
  collectedCoins = 0;

  /** Initializes the coin bar and sets its screen position. */
  constructor() {
    super();
    this.loadImage("img/coin/coin_1.png");
    this.x = 70;
    this.y = 0;
    this.width = 60;
    this.height = 60;
  }

  /**
   * Updates the internal coin counter.
   * @param {number} coins - The current number of coins.
   */
  setCoins(coins) {
    this.collectedCoins = coins;
  }

  /**
   * Renders the coin icon and the progress text (x / 10).
   * @override
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   */
  draw(ctx) {
    super.draw(ctx);
    ctx.font = "16px Arial"; // Mentor-Hinweis: Mindestens 16px
    ctx.fillStyle = "white";
    ctx.fillText(`${this.collectedCoins} / 10`, this.x + 50, this.y + 35);
  }
}
