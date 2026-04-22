class MovableObject {
  x;
  y;
  img;
  width;
  height;
  imageChache = {};
  speed;
  changeDirection = false;

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
  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
  moveJump() {}

  idleState() {}
  longIdleState() {}
  animDie() {}
}
