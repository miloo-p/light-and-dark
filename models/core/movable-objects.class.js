/**
 * Base class for all dynamic and interactive objects (characters, enemies, projectiles).
 * @class
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /** @type {number[]} List of active interval IDs for global clearing. */
  static stoppableIntervalIds = [];

  /** @type {number} */
  speed;

  /** @type {boolean} */
  changeDirection = false;

  /** @type {number} */
  speedY = 0;

  /** @type {number} */
  acceleration = 0.6;

  /** @type {number} */
  cameraOffset = 25;

  /** @type {number} */
  healthPoints;

  /** @type {number} */
  lastHit = 0;

  /** @type {{top: number, bottom: number, left: number, right: number}} */
  hitboxOffset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /** @type {boolean} */
  fastFallEnabled = false;

  /**
   * Creates an interval and registers its ID globally.
   * @param {Function} taskFunction - The callback function.
   * @param {number} timeInMs - Delay between executions.
   * @returns {number} The created interval ID.
   */
  setStoppableInterval(taskFunction, timeInMs) {
    let id = setInterval(taskFunction, timeInMs);
    MovableObject.stoppableIntervalIds.push(id);
    return id;
  }

  /** Clears all registered intervals across all objects. */
  static stopAllIntervals() {
    MovableObject.stoppableIntervalIds.forEach(clearInterval);
    MovableObject.stoppableIntervalIds = [];
  }

  /** Applies vertical velocity and gravity logic at 60 FPS. */
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

  /**
   * Checks if the object is currently airborne.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ProjectileObject) {
      return true;
    } else {
      return this.y < 240;
    }
  }

  /**
   * Cycles through animation frames.
   * @param {string[]} arr - Array of image paths.
   */
  displayAnimation(arr) {
    let i = this.currentImage % arr.length;
    let path = arr[i];
    if (DrawableObject.imageCache[path]) {
      this.img = DrawableObject.imageCache[path];
    } else {
      this.loadImage(path);
    }
    this.currentImage++;
  }

  /**
   * Plays an animation sequence once and stays on the last frame.
   * @param {string[]} arr - Array of image paths.
   */
  displayAnimationOnce(arr) {
    let i = this.currentImage;
    if (i >= arr.length) {
      i = arr.length - 1;
    } else {
      this.currentImage++;
    }

    let path = arr[i];
    if (DrawableObject.imageCache[path]) {
      this.img = DrawableObject.imageCache[path];
    } else {
      this.loadImage(path);
    }
  }

  /** Starts the camera tracking and smoothing logic. */
  cameraBehavior() {
    this.setStoppableInterval(() => {
      this.cameraInputs();
      this.cameraSmoothing();
    }, 1000 / 60);
  }

  /** Processes horizontal movement based on keyboard input. */
  cameraInputs() {
    if (!this.world || !this.world.keyboard || !this.world.level) return;

    if (this.world.keyboard.keyRight && this.x < this.world.level.level_end_x && !this.isDead()) {
      this.x += this.speed;
      this.changeDirection = false;
    }
    if (this.world.keyboard.keyLeft && this.x > 0 && !this.isDead()) {
      this.x -= this.speed;
      this.changeDirection = true;
    }
  }

  /** Smoothly interpolates the world camera to follow the object. */
  cameraSmoothing() {
    if (!this.world) return;

    let targetCameraX = -this.x + this.cameraOffset;
    targetCameraX = Math.min(targetCameraX, 0);
    let maxScrollRight = -(2800 - 700);
    targetCameraX = Math.max(targetCameraX, maxScrollRight);

    this.world.camera_x += (targetCameraX - this.world.camera_x) * 0.05;
  }

  /**
   * AABB collision detection including hitbox offsets.
   * @param {MovableObject} obj - The target object.
   * @returns {boolean}
   */
  isColliding(obj) {
    let leftSide = this.x + this.hitboxOffset.left;
    let rightSide = this.x + this.width - this.hitboxOffset.right;
    let topSide = this.y + this.hitboxOffset.top;
    let bottomSide = this.y + this.height - this.hitboxOffset.bottom;

    let objLeftSide = obj.x + obj.hitboxOffset.left;
    let objRightSide = obj.x + obj.width - obj.hitboxOffset.right;
    let objTopSide = obj.y + obj.hitboxOffset.top;
    let objBottomSide = obj.y + obj.height - obj.hitboxOffset.bottom;

    return (
      rightSide > objLeftSide && bottomSide > objTopSide && leftSide < objRightSide && topSide < objBottomSide
    );
  }

  /** Reduces health and triggers death state if HP <= 0. */
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

  /** @returns {boolean} True if in invulnerability frames. */
  isHurt() {
    let timePassed = (new Date().getTime() - this.lastHit) / 1000;
    return timePassed < 0.5;
  }

  /** @returns {boolean} */
  isDead() {
    return this.healthPoints == 0;
  }

  /** Constantly moves the object to the left at 60 FPS. */
  moveLeft() {
    this.setStoppableInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }

  /**
   * Spawns, updates, and renders magic particles.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
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
