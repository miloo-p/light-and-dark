class MovableObject {
  x;
  y;
  img;
  width;
  height;
  imageChache = {};
  speed;
  changeDirection = false;

  speedY = 0;
  acceleration = 0.5;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 60);
  }

  isAboveGround() {
    return this.y < 240;
  }

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

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof ShadowCharacter || this instanceof EnemyStomp) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  displayAnimation(arr) {
    let i = this.currentImage % arr.length;
    let path = arr[i];
    this.img = this.imageChache[path];
    this.currentImage++;
  }

  cameraBehavior() {
    setInterval(() => {
      if (this.world.keyboard.keyRight && this.x < this.world.level.level_end_x) {
        this.x += this.speed;
        this.changeDirection = false;
      }
      if (this.world.keyboard.keyLeft && this.x > 0) {
        this.x -= this.speed;
        this.changeDirection = true;
      }

      //Smooth Camera + Max Distance set
      let targetCameraX = -this.x + 25;
      targetCameraX = Math.min(targetCameraX, 0);
      let maxScrollRight = -(2800 - 700);
      targetCameraX = Math.max(targetCameraX, maxScrollRight);
      this.world.camera_x += (targetCameraX - this.world.camera_x) * 0.05;
    }, 1000 / 60);
  }

  isColliding(MovableObject) {
    return (
      this.x + this.width > MovableObject.x &&
      this.y + this.height > MovableObject.y &&
      this.x < MovableObject.x &&
      this.y < MovableObject.y + MovableObject.height
    );
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
