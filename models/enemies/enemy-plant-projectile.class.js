/**
 * Represents a dangerous projectile fired by the EnemyPlant.
 * @class
 * @extends MovableObject
 */
class EnemyPlantProjectileObject extends MovableObject {
  /** @type {string[]} */
  static imagesFly = [
    `img/enemies/enemy_plant/projectile/1_p.png`,
    `img/enemies/enemy_plant/projectile/2_p.png`,
  ];

  /** @type {{top: number, bottom: number, left: number, right: number}} */
  hitboxOffset = {
    top: 8,
    bottom: 8,
    left: 8,
    right: 5,
  };

  /**
   * Initializes the projectile at the specified spawn coordinates.
   * @param {number} startX - The initial x-coordinate.
   * @param {number} startY - The initial y-coordinate.
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

  /** Initiates the projectile's horizontal flight path. */
  shootProjectile() {
    /** @type {number} */
    this.moveInterval = this.setStoppableInterval(() => {
      this.x -= 6;
    }, 1000 / 60);
  }

  /** Starts the visual animation loop. */
  animate() {
    /** @type {number} */
    this.animationInterval = this.setStoppableInterval(() => {
      this.displayAnimation(EnemyPlantProjectileObject.imagesFly);
    }, 150);
  }

  /** Safely halts all intervals associated with this projectile to prevent memory leaks. */
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
