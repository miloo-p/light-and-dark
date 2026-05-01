class DrawableObject {
  x;
  y;
  width;
  height;

  img;
  imageCache = {};
  currentImage = 0;

  loadImage(src) {
    this.img = new Image();
    this.img.src = src;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  loadAnimationImages(arr) {
    arr.forEach((ImageSrc) => {
      let img = new Image();
      img.src = ImageSrc;
      this.imageCache[ImageSrc] = img;
    });
  }

  // #region collision-toggle-debug
  drawFrame(ctx) {
    if (globalThis.showCollisionBoxes && this instanceof MovableObject) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "red";
      ctx.rect(
        this.x + this.hitboxOffset.left,
        this.y + this.hitboxOffset.top,
        this.width - this.hitboxOffset.left - this.hitboxOffset.right,
        this.height - this.hitboxOffset.top - this.hitboxOffset.bottom,
      );
      ctx.stroke();
    }
  }
  // #endregion collision-toggle-debug
}
