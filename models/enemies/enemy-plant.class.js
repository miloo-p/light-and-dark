/**
 * Represents a stationary enemy that periodically shoots projectiles at the player.
 * @class
 * @extends MovableObject
 */
class EnemyPlant extends MovableObject {
  /** @type {number} */
  speed = 0.15 + Math.random() * 0.25;

  /** @type {{top: number, bottom: number, left: number, right: number}} */
  hitboxOffset = {
    top: 15,
    bottom: 0,
    left: 30,
    right: 30,
  };

  /** @type {number} */
  healthPoints = 20;

  /** @type {boolean} */
  hasPlayedDeathSound = false;

  /** @type {string[]} */
  static imagesAttack = [
    `img/enemies/enemy_plant/shoot/1_s.png`,
    `img/enemies/enemy_plant/shoot/2_s.png`,
    `img/enemies/enemy_plant/shoot/3_s.png`,
    `img/enemies/enemy_plant/shoot/4_s.png`,
    `img/enemies/enemy_plant/shoot/5_s.png`,
  ];

  /** @type {string[]} */
  static imagesHurt = [
    `img/enemies/enemy_plant/hit/1_h.png`,
    `img/enemies/enemy_plant/hit/2_h.png`,
    `img/enemies/enemy_plant/hit/3_h.png`,
    `img/enemies/enemy_plant/hit/4_h.png`,
  ];

  /** @type {string[]} */
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

  /** Main behavior loop handling animations and shooting based on player proximity. */
  animate() {
    this.setStoppableInterval(() => {
      if (typeof world === "undefined" || !world || !world.shadowCharacter) return;
      let distanceToPlayer = Math.abs(this.x - world.shadowCharacter.x);

      if (distanceToPlayer > 600 && !this.isDead() && !this.isHurt()) {
        return;
      }

      if (this.isDead()) {
        this.displayAnimation(EnemyPlant.imagesDead);
        this.checkIsDead();
      } else if (this.isHurt()) {
        this.displayAnimation(EnemyPlant.imagesHurt);
      } else {
        let i = this.currentImage % EnemyPlant.imagesAttack.length;

        if (i === 3) {
          this.shoot();
        }

        this.displayAnimation(EnemyPlant.imagesAttack);
      }
    }, 400);
  }

  /** Spawns a projectile directed towards the player. */
  shoot() {
    let bossProjectile = new EnemyPlantProjectileObject(this.x - 20, this.y + 30);
    world.enemyProjectiles.push(bossProjectile);
    AudioManager.playSFX("plant_attack");
  }

  /** Checks if the plant is dead and ensures death sounds are only played once. */
  checkIsDead() {
    if (this.isDead() && !this.hasPlayedDeathSound) {
      AudioManager.playSFX("plant_dies");
      AudioManager.playSFX("plant_dies-2");
      this.hasPlayedDeathSound = true;
    }
  }
}
