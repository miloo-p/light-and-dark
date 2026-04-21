class MovableObject {
  x;
  y;
  img;
  width;
  height;

  loadimage(src) {
    this.img = new Image();
    this.img.src = src;
  }

  moveRight() {}
  moveLeft() {}
  moveJump() {}

  idleState() {}
  longIdleState() {}
  animDie() {}
}
