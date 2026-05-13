/**
 * Represents the massive poison projectile fired by the final boss.
 * @class
 * @extends MovableObject
 */
class EnemyBossProjectileObject extends MovableObject {
  /** @type {string[]} */
  static imagesFly = [
    `img/enemies/enemy_boss/3_poison-spell/1_poisenj.png`,
    `img/enemies/enemy_boss/3_poison-spell/2_poisenj.png`,
    `img/enemies/enemy_boss/3_poison-spell/3_poisenj.png`,
  ];

  /** @type {{top: number, bottom: number, left: number, right: number}} */
  hitboxOffset = {
    top: 25,
    bottom: 25,
    left: 20,
    right: 20,
  };

  /**
   * Initializes the boss projectile at the specified coordinates.
   * @param {number} startX - The initial x-coordinate.
   * @param {number} startY - The initial y-coordinate.
   */
  constructor(startX, startY) {
    super();
    this.loadImage(EnemyBossProjectileObject.imagesFly[0]);

    this.x = startX;
    this.y = startY;

    // The boss projectile is significantly larger than the plant's projectile
    this.height = 123;
    this.width = 170;

    this.animate();
    this.shootProjectile();
  }

  /** Starts the horizontal movement loop. */
  shootProjectile() {
    /** @type {number} */
    this.moveInterval = this.setStoppableInterval(() => {
      this.x -= 5;
    }, 1000 / 60);
  }

  /** Starts the visual animation loop. */
  animate() {
    /** @type {number} */
    this.animationInterval = this.setStoppableInterval(() => {
      this.displayAnimation(EnemyBossProjectileObject.imagesFly);
    }, 150);
  }

  /** Safely halts all intervals associated with this projectile. */
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
