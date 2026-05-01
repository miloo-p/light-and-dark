class MovableObject extends DrawableObject {
  static stoppableIntervalIds = [];
  speed;
  changeDirection = false;

  speedY = 0;
  acceleration = 0.6;

  healthPoints;
  lastHit = 0;

  hitboxOffset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  fastFallEnabled = false;

  setStoppableInterval(taskFunction, timeInMs) {
    let id = setInterval(taskFunction, timeInMs);
    MovableObject.stoppableIntervalIds.push(id);
    return id;
  }
  static stopAllIntervals() {
    MovableObject.stoppableIntervalIds.forEach(clearInterval);
    MovableObject.stoppableIntervalIds = [];
  }

  applyGravity() {
    this.setStoppableInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        if (this.speedY < 0 && this.fastFallEnabled) {
          this.speedY -= this.acceleration * 1.5;
        } else {
          this.speedY -= this.acceleration;
        }
      }
    }, 1000 / 60);
  }

  isAboveGround() {
    if (this instanceof ProjectileObject) {
      return true;
    } else {
      return this.y < 240;
    }
  }

  displayAnimation(arr) {
    let i = this.currentImage % arr.length;
    let path = arr[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  displayAnimationOnce(arr) {
    let i = this.currentImage;
    if (i >= arr.length) {
      i = arr.length - 1;
    } else {
      this.currentImage++;
    }

    let path = arr[i];
    this.img = this.imageCache[path];
  }

  cameraBehavior() {
    this.setStoppableInterval(() => {
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
    let objBottomSide = MovableObject.y + MovableObject.height - MovableObject.hitboxOffset.bottom;

    return (
      rightSide > objLeftSide && bottomSide > objTopSide && leftSide < objRightSide && topSide < objBottomSide
    );
  }

  hit() {
    if (this.isDead()) return;

    this.healthPoints -= 20;

    if (this.healthPoints <= 0) {
      this.healthPoints = 0;
      this.currentImage = 0;
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
    this.setStoppableInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }

  handleParticles(ctx) {
    if (Math.random() < 0.05) {
      let centerX = this.x + this.width / 2;
      let centerY = this.y + this.height / 2 + 20;
      this.particles.push(new Particle(centerX, centerY));
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.update();

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      } else {
        p.draw(ctx);
      }
    }
  }
}
