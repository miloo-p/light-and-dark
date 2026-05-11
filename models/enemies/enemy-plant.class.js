class EnemyPlant extends MovableObject {
  speed = 0.15 + Math.random() * 0.25;

  hitboxOffset = {
    top: 15,
    bottom: 0,
    left: 30,
    right: 30,
  };

  healthPoints = 20;

  hasPlayedDeathSound = false;

  static imagesAttack = [
    `img/enemies/enemy_plant/shoot/1_s.png`,
    `img/enemies/enemy_plant/shoot/2_s.png`,
    `img/enemies/enemy_plant/shoot/3_s.png`,
    `img/enemies/enemy_plant/shoot/4_s.png`,
    `img/enemies/enemy_plant/shoot/5_s.png`,
  ];

  static imagesHurt = [
    `img/enemies/enemy_plant/hit/1_h.png`,
    `img/enemies/enemy_plant/hit/2_h.png`,
    `img/enemies/enemy_plant/hit/3_h.png`,
    `img/enemies/enemy_plant/hit/4_h.png`,
  ];

  static imagesDead = [
    `img/enemies/enemy_plant/dies/4_d.png`,
    `img/enemies/enemy_plant/dies/5_d.png`,
    `img/enemies/enemy_plant/dies/6_d.png`,
  ];

  constructor(x) {
    super();
    this.loadImage(`img/enemies/enemy_plant/walking/1_w.png`);
    this.x = x;
    this.y = 265;
    this.width = 124;
    this.height = 110;

    this.animate();
  }

  animate() {
    this.setStoppableInterval(() => {
      if (typeof world === "undefined" || !world) return;
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

  shoot() {
    let bossProjectile = new EnemyPlantProjectileObject(this.x - 20, this.y + 30);
    world.enemyProjectiles.push(bossProjectile);
    AudioManager.playSFX("plant_attack");
  }

  checkIsDead() {
    if (this.isDead() && !this.hasPlayedDeathSound) {
      AudioManager.playSFX("plant_dies");
      AudioManager.playSFX("plant_dies-2");
      this.hasPlayedDeathSound = true;
    }
  }
}
