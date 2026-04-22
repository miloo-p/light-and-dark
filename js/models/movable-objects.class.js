class MovableObject {
  x;
  y;
  img;
  width;
  height;
  imageChache = {};

  loadimage(src) {
    this.img = new Image();
    this.img.src = src;
  }

  loadAimationImages(arr) {
    arr.forEach((ImageSrc) => {
      let img = new Image();
      img.src = ImageSrc;
      this.imageChache[ImageSrc] = img;
    });
  }

  moveRight() {}
  moveLeft() {}
  moveJump() {}

  idleState() {}
  longIdleState() {}
  animDie() {}
}
