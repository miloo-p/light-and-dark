/**
 * Represents the massive poison projectile fired by the final boss.
 * Travels horizontally to the left and requires the player to jump over or duck under it.
 * @class
 * @extends MovableObject
 */
class EnemyBossProjectileObject extends MovableObject {
  /**
   * Array of image paths comprising the projectile's spinning/flying animation sequence.
   * @static
   * @type {string[]}
   */
  static imagesFly = [
    `img/enemies/enemy_boss/3_poison-spell/1_poisenj.png`,
    `img/enemies/enemy_boss/3_poison-spell/2_poisenj.png`,
    `img/enemies/enemy_boss/3_poison-spell/3_poisenj.png`,
  ];

  /**
   * Custom bounding box for collision detection.
   * Heavily inset to ensure the player only takes damage if the core of the poison hits them,
   * making dodging feel tight and fair.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  hitboxOffset = {
    top: 25,
    bottom: 25,
    left: 20,
    right: 20,
  };

  /**
   * Initializes the boss projectile, setting its spawn position and starting its core loops.
   * @param {number} startX - The initial x-coordinate, aligned with the boss's position.
   * @param {number} startY - The initial y-coordinate, determined dynamically by the boss (high or low).
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

  /**
   * Starts the horizontal movement loop.
   * Moves the projectile 6 pixels to the left at roughly 60 FPS.
   */
  shootProjectile() {
    /**
     * Internal reference to the physical movement interval.
     * @type {number}
     */
    this.moveInterval = this.setStoppableInterval(() => {
      this.x -= 5;
    }, 1000 / 60);
  }

  /**
   * Starts the visual animation loop, cycling through the flying frames every 150ms.
   */
  animate() {
    /**
     * Internal reference to the visual animation interval.
     * @type {number}
     */
    this.animationInterval = this.setStoppableInterval(() => {
      this.displayAnimation(EnemyBossProjectileObject.imagesFly);
    }, 150);
  }

  /**
   * Safely halts all intervals associated with this projectile.
   * This is critically called by the World class when the projectile hits the player
   * or flies completely off-screen to prevent memory leaks.
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
