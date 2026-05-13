/**
 * Base class for all objects that can be drawn on the canvas.
 * @class
 */
class DrawableObject {
  /** @type {number} */
  x;

  /** @type {number} */
  y;

  /** @type {number} */
  width;

  /** @type {number} */
  height;

  /** @type {HTMLImageElement} */
  img;

  /** @type {Object.<string, HTMLImageElement>} */
  static imageCache = {};

  /** @type {number} */
  currentImage = 0;

  /**
   * @returns {Object.<string, HTMLImageElement>} The global image cache.
   */
  get imageCache() {
    return DrawableObject.imageCache;
  }

  /**
   * Loads a single image and sets it as the current image.
   * @param {string} src - The relative file path to the image resource.
   */
  loadImage(src) {
    this.img = this.getCachedImage(src);
  }

  /**
   * Retrieves an image from the cache or creates a new one.
   * @param {string} src - The file path of the image.
   * @returns {HTMLImageElement} The cached or newly created image.
   */
  getCachedImage(src) {
    if (!DrawableObject.imageCache[src]) {
      let img = new Image();
      img.src = src;
      DrawableObject.imageCache[src] = img;
    }

    return DrawableObject.imageCache[src];
  }

  /**
   * Renders the current image onto the provided canvas.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Preloads an array of image paths into the cache.
   * @param {string[]} arr - Array of image resource paths.
   */
  loadAnimationImages(arr) {
    arr.forEach((imageSrc) => {
      this.getCachedImage(imageSrc);
    });
  }
}
