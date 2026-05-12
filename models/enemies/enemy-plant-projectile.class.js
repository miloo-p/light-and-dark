/**
 * Represents a dangerous projectile fired by the EnemyPlant.
 * Travels in a straight horizontal line to the left and continuously plays a spinning/flying animation.
 * @class
 * @extends MovableObject
 */
class EnemyPlantProjectileObject extends MovableObject {
  /** * Array of image paths comprising the projectile's flying animation sequence.
   * @static
   * @type {string[]}
   */
  static imagesFly = [
    `img/enemies/enemy_plant/projectile/1_p.png`,
    `img/enemies/enemy_plant/projectile/2_p.png`,
  ];

  /**
   * Custom bounding box for accurate collision detection.
   * Insets the physical hit area slightly to make dodging feel fair to the player.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  hitboxOffset = {
    top: 8,
    bottom: 8,
    left: 8,
    right: 5,
  };

  /**
   * Initializes the projectile, sets its spawn location, and starts its movement and animation loops.
   * @param {number} startX - The initial x-coordinate, usually offset from the plant that fired it.
   * @param {number} startY - The initial y-coordinate, usually aligned with the plant's mouth/shooter.
   */
  constructor(startX, startY) {
    super();
    this.loadImage(EnemyPlantProjectileObject.imagesFly[0]);
    this.x = startX;
    this.y = startY;
    this.height = 45;
    this.width = 45;

    this.animate();
    this.shootProjectile();
  }

  /**
   * Initiates the projectile's horizontal flight path.
   * Moves the object 6 pixels to the left roughly 60 times per second.
   */
  shootProjectile() {
    /**
     * Internal reference to the movement interval.
     * @type {number}
     */
    this.moveInterval = this.setStoppableInterval(() => {
      this.x -= 6;
    }, 1000 / 60);
  }

  /**
   * Starts the visual animation loop, cycling through the flying frames every 150ms.
   */
  animate() {
    /**
     * Internal reference to the animation interval.
     * @type {number}
     */
    this.animationInterval = this.setStoppableInterval(() => {
      this.displayAnimation(EnemyPlantProjectileObject.imagesFly);
    }, 150);
  }

  /**
   * Safely halts all intervals associated with this projectile.
   * Must be called before splicing the object from the active projectiles array
   * to prevent memory leaks and background processing.
   */
  destroy() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }

    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }
}
