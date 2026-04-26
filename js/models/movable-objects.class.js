class MovableObject extends DrawableObject {
  speed;
  changeDirection = false;

  speedY = 0;
  acceleration = 0.5;

  healthPoints;
  lastHit = 0;

  hitboxOffset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  fastFallEnabled = false;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        d;
        if (this.speedY < 0 && this.fastFallEnabled) {
          this.speedY -= this.acceleration * 1.5;
        } else {
          this.speedY -= this.acceleration;
        }
      }
    }, 1000 / 60);
  }

  isAboveGround() {
    return this.y < 240;
  }

  drawFrame(ctx) {
    if (this instanceof ShadowCharacter || this instanceof EnemyStomp) {
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

  displayAnimation(arr) {
    let i = this.currentImage % arr.length;
    let path = arr[i];
    this.img = this.imageChache[path];
    this.currentImage++;
  }

  cameraBehavior() {
    setInterval(() => {
      if (this.world.keyboard.keyRight && this.x < this.world.level.level_end_x && !this.isDead()) {
        this.x += this.speed;
        this.changeDirection = false;
      }
      if (this.world.keyboard.keyLeft && this.x > 0 && !this.isDead()) {
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
    let leftSide = this.x + this.hitboxOffset.left;
    let rightSide = this.x + this.width - this.hitboxOffset.right;
    let topSide = this.y + this.hitboxOffset.top;
    let bottomSide = this.y + this.height - this.hitboxOffset.bottom;

    let objLeftSide = MovableObject.x + MovableObject.hitboxOffset.left;
    let objRightSide = MovableObject.x + MovableObject.width - MovableObject.hitboxOffset.right;
    let objTopSide = MovableObject.y + MovableObject.hitboxOffset.top;
    let objBottomSide = MovableObject.y + MovableObject.hitboxOffset.bottom;

    return (
      rightSide > objLeftSide && bottomSide > objTopSide && leftSide < objRightSide && topSide < objBottomSide
    );
  }

  hit() {
    this.healthPoints -= 1;
    if (this.healthPoints < 0) {
      this.healthPoints = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timePassed = (new Date().getTime() - this.lastHit) / 1000;
    return timePassed < 0.5;
  }

  isDead() {
    return this.healthPoints == 0;
  }

  moveRight() {}
  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
