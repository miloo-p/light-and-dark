/**
 * Base class for all objects that can be drawn on the canvas.
 * Manages position, dimensions, and image rendering.
 * @class
 */
class DrawableObject {
  /**
   * The x-coordinate of the object on the canvas.
   * @type {number}
   */
  x;

  /**
   * The y-coordinate of the object on the canvas.
   * @type {number}
   */
  y;

  /**
   * The width of the object in pixels.
   * @type {number}
   */
  width;

  /**
   * The height of the object in pixels.
   * @type {number}
   */
  height;

  /**
   * The current image element assigned to the object.
   * @type {HTMLImageElement}
   */
  img;

  /**
   * Global static cache for all loaded images.
   * Prevents redundant memory allocation by reusing identical image instances.
   * @static
   * @type {Object.<string, HTMLImageElement>} A dictionary mapping image paths to HTMLImageElements.
   */
  static imageCache = {};

  /**
   * Index tracker used for calculating the current frame in an animation sequence.
   * @type {number}
   */
  currentImage = 0;

  /**
   * Getter for the static image cache.
   * Allows instances to access the global cache conveniently.
   * @returns {Object.<string, HTMLImageElement>} The global image cache.
   */
  get imageCache() {
    return DrawableObject.imageCache;
  }

  /**
   * Loads a single image and sets it as the current image (`this.img`) for the object.
   * @param {string} src - The relative file path to the image resource.
   */
  loadImage(src) {
    this.img = this.getCachedImage(src);
  }

  /**
   * Retrieves an image from the cache. If it doesn't exist, it creates a new Image instance,
   * sets its source, and stores it in the cache.
   * @param {string} src - The file path of the image to retrieve or load.
   * @returns {HTMLImageElement} The cached or newly created image element.
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
   * Renders the current image onto the provided canvas rendering context.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the main canvas.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Preloads an array of image paths into the static image cache.
   * Typically used to cache all frames of an animation beforehand.
   * @param {string[]} arr - An array of string paths pointing to image resources.
   */
  loadAnimationImages(arr) {
    arr.forEach((imageSrc) => {
      this.getCachedImage(imageSrc);
    });
  }
}
