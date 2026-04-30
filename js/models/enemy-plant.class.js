class EnemyPlant extends MovableObject {
  speed = 0.15 + Math.random() * 0.25;

  hitboxOffset = {
    top: 15,
    bottom: 0,
    left: 30,
    right: 30,
  };

  healthPoints = 20;

  imagesAttack = [
    `img/enemies/enemy_plant/shoot/1_s.png`,
    `img/enemies/enemy_plant/shoot/2_s.png`,
    `img/enemies/enemy_plant/shoot/3_s.png`,
    `img/enemies/enemy_plant/shoot/4_s.png`,
    `img/enemies/enemy_plant/shoot/5_s.png`,
  ];

  imagesHurt = [
    `img/enemies/enemy_plant/hit/1_h.png`,
    `img/enemies/enemy_plant/hit/2_h.png`,
    `img/enemies/enemy_plant/hit/3_h.png`,
    `img/enemies/enemy_plant/hit/4_h.png`,
  ];

  imagesDead = [
    `img/enemies/enemy_plant/dies/1_d.png`,
    `img/enemies/enemy_plant/dies/2_d.png`,
    `img/enemies/enemy_plant/dies/3_d.png`,
    `img/enemies/enemy_plant/dies/4_d.png`,
    `img/enemies/enemy_plant/dies/5_d.png`,
    `img/enemies/enemy_plant/dies/6_d.png`,
  ];

  currentImage = 0;

  constructor() {
    super().loadImage(`img/enemies/enemy_plant/walking/1_w.png`);
    this.x = 600;
    this.y = 265;
    this.width = 124;
    this.height = 110;

    this.loadAnimationImages(this.imagesAttack);
    this.loadAnimationImages(this.imagesHurt);
    this.loadAnimationImages(this.imagesDead);

    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.isDead()) {
        this.displayAnimation(this.imagesDead);
      } else if (this.isHurt()) {
        this.displayAnimation(this.imagesHurt);
      } else {
        let i = this.currentImage % this.imagesAttack.length;

        if (i === 3) {
          this.shoot();
        }
        this.displayAnimation(this.imagesAttack);
      }
    }, 400);
  }

  shoot() {
    let bossProjectile = new EnemyPlantProjectileObject(this.x - 20, this.y + 30);
    world.enemyProjectiles.push(bossProjectile);
  }
}
