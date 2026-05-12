/**
 * Represents a stationary enemy that periodically shoots projectiles at the player.
 * @class
 * @extends MovableObject
 */
class EnemyPlant extends MovableObject {
  /**
   * The movement speed of the plant.
   * Note: While defined here, the plant is currently designed as a stationary enemy,
   * so this value may not actively alter its X-position in the current implementation.
   * @type {number}
   */
  speed = 0.15 + Math.random() * 0.25;

  /**
   * Custom bounding box for collision detection.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  hitboxOffset = {
    top: 15,
    bottom: 0,
    left: 30,
    right: 30,
  };

  /**
   * Initial health points of the plant enemy.
   * @type {number}
   */
  healthPoints = 20;

  /**
   * Flag indicating whether the death sound effects have already been played.
   * Prevents the sounds from looping indefinitely while the death animation plays.
   * @type {boolean}
   */
  hasPlayedDeathSound = false;

  /** @static @type {string[]} Array of image paths for the attacking/shooting animation sequence. */
  static imagesAttack = [
    `img/enemies/enemy_plant/shoot/1_s.png`,
    `img/enemies/enemy_plant/shoot/2_s.png`,
    `img/enemies/enemy_plant/shoot/3_s.png`,
    `img/enemies/enemy_plant/shoot/4_s.png`,
    `img/enemies/enemy_plant/shoot/5_s.png`,
  ];

  /** @static @type {string[]} Array of image paths for the taking damage (hurt) animation sequence. */
  static imagesHurt = [
    `img/enemies/enemy_plant/hit/1_h.png`,
    `img/enemies/enemy_plant/hit/2_h.png`,
    `img/enemies/enemy_plant/hit/3_h.png`,
    `img/enemies/enemy_plant/hit/4_h.png`,
  ];

  /** @static @type {string[]} Array of image paths for the death animation sequence. */
  static imagesDead = [
    `img/enemies/enemy_plant/dies/4_d.png`,
    `img/enemies/enemy_plant/dies/5_d.png`,
    `img/enemies/enemy_plant/dies/6_d.png`,
  ];

  /**
   * Initializes the plant enemy and starts its animation and combat behavior.
   * @param {number} x - The specific horizontal spawn coordinate.
   */
  constructor(x) {
    super();
    this.loadImage(`img/enemies/enemy_plant/walking/1_w.png`);
    this.x = x;
    this.y = 265;
    this.width = 124;
    this.height = 110;

    this.animate();
  }

  /**
   * Main behavior loop for the plant, running at roughly 2.5 FPS (400ms).
   * Evaluates the current state (dead, hurt, or attacking) and triggers the shoot action
   * on a specific frame of the attack animation.
   */
  animate() {
    this.setStoppableInterval(() => {
      // Ensure the global world context exists before executing logic
      if (typeof world === "undefined" || !world) return;

      if (this.isDead()) {
        this.displayAnimation(EnemyPlant.imagesDead);
        this.checkIsDead();
      } else if (this.isHurt()) {
        this.displayAnimation(EnemyPlant.imagesHurt);
      } else {
        // Calculate the current frame index relative to the attack animation array
        let i = this.currentImage % EnemyPlant.imagesAttack.length;

        // Trigger the projectile spawn exactly when the plant visually shoots (frame 3)
        if (i === 3) {
          this.shoot();
        }

        this.displayAnimation(EnemyPlant.imagesAttack);
      }
    }, 400);
  }

  /**
   * Spawns a projectile directed towards the player.
   * Registers the new projectile in the global `world.enemyProjectiles` array and plays a sound effect.
   */
  shoot() {
    let bossProjectile = new EnemyPlantProjectileObject(this.x - 20, this.y + 30);
    world.enemyProjectiles.push(bossProjectile);
    AudioManager.playSFX("plant_attack");
  }

  /**
   * Checks if the plant is dead and ensures death sounds are only played once.
   */
  checkIsDead() {
    if (this.isDead() && !this.hasPlayedDeathSound) {
      AudioManager.playSFX("plant_dies");
      AudioManager.playSFX("plant_dies-2");
      this.hasPlayedDeathSound = true;
    }
  }
}
