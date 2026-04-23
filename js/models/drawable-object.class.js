class DrawableObject {
  x;
  y;
  width;
  height;

  img;
  imageChache = {};
  currentImage = 0;

  loadimage(src) {
    this.img = new Image();
    this.img.src = src;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  loadAimationImages(arr) {
    arr.forEach((ImageSrc) => {
      let img = new Image();
      img.src = ImageSrc;
      this.imageChache[ImageSrc] = img;
    });
  }
}
