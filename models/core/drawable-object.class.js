class DrawableObject {
  x;
  y;
  width;
  height;

  img;
  static imageCache = {};
  currentImage = 0;

  get imageCache() {
    return DrawableObject.imageCache;
  }

  loadImage(src) {
    this.img = this.getCachedImage(src);
  }

  getCachedImage(src) {
    if (!DrawableObject.imageCache[src]) {
      let img = new Image();
      img.src = src;
      DrawableObject.imageCache[src] = img;
    }

    return DrawableObject.imageCache[src];
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  loadAnimationImages(arr) {
    arr.forEach((imageSrc) => {
      this.getCachedImage(imageSrc);
    });
  }
}
