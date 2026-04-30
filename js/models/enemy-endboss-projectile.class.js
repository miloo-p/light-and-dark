class EnemyBossProjectileObject extends MovableObject {
  imagesFly = [
    `img/enemies/enemy_boss/3_poison-spell/1_poisenj.png`,
    `img/enemies/enemy_boss/3_poison-spell/2_poisenj.png`,
    `img/enemies/enemy_boss/3_poison-spell/3_poisenj.png`,
  ];

  hitboxOffset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  constructor(startX, startY) {
    super();
    this.loadImage(this.imagesFly[0]);
    this.loadAnimationImages(this.imagesFly);

    this.x = startX;
    this.y = startY;
    this.height = 145;
    this.width = 200;

    this.animate();
    this.shootProjectile();
  }

  shootProjectile() {
    setInterval(() => {
      this.x -= 6;
    }, 1000 / 60);
  }

  animate() {
    setInterval(() => {
      this.displayAnimation(this.imagesFly);
    }, 150);
  }
}
