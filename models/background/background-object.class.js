/**
 * Represents a static background layer in the game world.
 * Used to construct the environment and create scrolling backgrounds.
 * @class
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  /**
   * Initializes a new background image segment at the specified coordinates.
   * Applies fixed dimensions designed to tile correctly across the level.
   * @param {string} ImageSrc - The file path to the background image graphic.
   * @param {number} x - The horizontal starting coordinate.
   * @param {number} y - The vertical starting coordinate.
   */
  constructor(ImageSrc, x, y) {
    super().loadImage(ImageSrc);
    this.x = x;
    this.y = y;

    // Fixed dimensions to ensure background pieces align seamlessly
    this.width = 1140;
    this.height = 405;
  }
}
