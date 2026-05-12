/**
 * Base class for all dynamic and interactive objects in the game (characters, enemies, projectiles).
 * Extends `DrawableObject` with physics, movement, health, collision detection, and animation logic.
 * @class
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /**
   * Global registry of active intervals created by movable objects.
   * Allows the game to cleanly pause or reset by clearing all logic loops.
   * @static
   * @type {number[]} Array of interval IDs.
   */
  static stoppableIntervalIds = [];

  /**
   * The movement speed of the object on the x-axis.
   * @type {number}
   */
  speed;

  /**
   * Indicates whether the object is facing left (`true`) or right (`false`).
   * Used to flip the image horizontally during rendering.
   * @type {boolean}
   */
  changeDirection = false;

  /**
   * The vertical velocity of the object (used for jumping and falling).
   * Positive values move the object upwards, negative values pull it down.
   * @type {number}
   */
  speedY = 0;

  /**
   * The force of gravity constantly reducing `speedY` when the object is airborne.
   * @type {number}
   */
  acceleration = 0.6;

  /**
   * The horizontal offset applied to the world camera to keep the character centered.
   * @type {number}
   */
  cameraOffset = 25;

  /**
   * Current health points of the object.
   * @type {number}
   */
  healthPoints;

  /**
   * Timestamp (in milliseconds) of the last time the object took damage.
   * Used to calculate the invulnerability/hurt frames.
   * @type {number}
   */
  lastHit = 0;

  /**
   * Fine-tunes the physical boundaries of the object for collision detection.
   * Insets the visual bounding box (`width`/`height`) to create a more accurate hitbox.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  hitboxOffset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * If enabled, gravity accelerates 1.5x faster when the object starts falling downward (`speedY < 0`).
   * Gives jumps a "snappier" or heavier feel.
   * @type {boolean}
   */
  fastFallEnabled = false;

  /**
   * Creates an interval and registers its ID in the global `stoppableIntervalIds` array.
   * @param {Function} taskFunction - The callback function to execute.
   * @param {number} timeInMs - Delay in milliseconds between executions.
   * @returns {number} The ID of the created interval.
   */
  setStoppableInterval(taskFunction, timeInMs) {
    let id = setInterval(taskFunction, timeInMs);
    MovableObject.stoppableIntervalIds.push(id);
    return id;
  }

  /**
   * Clears all registered intervals across all MovableObjects.
   * Essential for resetting the game state or pausing.
   * @static
   */
  static stopAllIntervals() {
    MovableObject.stoppableIntervalIds.forEach(clearInterval);
    MovableObject.stoppableIntervalIds = [];
  }

  /**
   * Applies continuous vertical velocity (`speedY`) and gravity (`acceleration`) to the object.
   * Runs at 60 FPS.
   */
  applyGravity() {
    this.setStoppableInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;

        // Apply heavier gravity if the object is falling and fastFall is enabled
        if (this.speedY < 0 && this.fastFallEnabled) {
          this.speedY -= this.acceleration * 1.5;
        } else {
          this.speedY -= this.acceleration;
        }
      }
    }, 1000 / 60);
  }

  /**
   * Determines if the object is currently airborne.
   * Projectiles are always considered airborne.
   * @returns {boolean} True if the object is above the ground level (y < 240).
   */
  isAboveGround() {
    if (this instanceof ProjectileObject) {
      return true;
    } else {
      return this.y < 240;
    }
  }

  /**
   * Cycles through an array of image paths endlessly to create a looping animation.
   * @param {string[]} arr - Array of image paths representing animation frames.
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
   * Plays an animation sequence exactly once and stops at the final frame.
   * Used for actions like dying or attacking.
   * @param {string[]} arr - Array of image paths representing animation frames.
   */
  displayAnimationOnce(arr) {
    let i = this.currentImage;
    if (i >= arr.length) {
      i = arr.length - 1; // Clamp to the last frame
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

  /**
   * Initializes the camera tracking logic, running at 60 FPS.
   */
  cameraBehavior() {
    this.setStoppableInterval(() => {
      this.cameraInputs();
      this.cameraSmoothing();
    }, 1000 / 60);
  }

  /**
   * Processes player input to move the object horizontally and updates its facing direction.
   * Constrains movement to the level boundaries.
   */
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

  /**
   * Smoothly interpolates the world's camera position (`camera_x`) to follow this object.
   * Uses lerping (linear interpolation) to prevent abrupt screen jumps.
   */
  cameraSmoothing() {
    if (!this.world) return;

    let targetCameraX = -this.x + this.cameraOffset;

    // Constrain camera scrolling to the left and right level boundaries
    targetCameraX = Math.min(targetCameraX, 0);
    let maxScrollRight = -(2800 - 700); // Level width minus canvas width
    targetCameraX = Math.max(targetCameraX, maxScrollRight);

    // Apply smoothing (lerp factor 0.05)
    this.world.camera_x += (targetCameraX - this.world.camera_x) * 0.05;
  }

  /**
   * Checks for an Axis-Aligned Bounding Box (AABB) intersection between this object and another.
   * Accounts for the custom `hitboxOffset` of both objects.
   * @param {MovableObject} MovableObject - The target object to check collision against.
   * @returns {boolean} True if the hitboxes overlap, otherwise false.
   */
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

  /**
   * Reduces the object's health points.
   * If health drops to or below 0, it triggers the death state by resetting the animation frame.
   */
  hit() {
    if (this.isDead()) return;

    this.healthPoints -= 20;

    if (this.healthPoints <= 0) {
      this.healthPoints = 0;
      this.currentImage = 0; // Reset animation to play death sequence from the start
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Determines if the object is currently in a "hurt" state based on the last hit timestamp.
   * @returns {boolean} True if less than 0.5 seconds have passed since the last hit.
   */
  isHurt() {
    let timePassed = (new Date().getTime() - this.lastHit) / 1000;
    return timePassed < 0.5;
  }

  /**
   * Checks if the object's health has reached 0.
   * @returns {boolean} True if dead, false otherwise.
   */
  isDead() {
    return this.healthPoints == 0;
  }

  /**
   * Initiates an interval that continuously moves the object to the left.
   * Runs at 60 FPS.
   */
  moveLeft() {
    this.setStoppableInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }

  /**
   * Spawns new particles probabilistically and updates/renders existing ones.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw particles onto.
   */
  handleParticles(ctx) {
    // 5% chance per frame to spawn a new particle at the center base of the object
    if (Math.random() < 0.05) {
      let centerX = this.x + this.width / 2;
      let centerY = this.y + this.height / 2 + 20;
      this.particles.push(new Particle(centerX, centerY));
    }

    // Update and draw particles, iterate backwards to safely remove dead particles
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
