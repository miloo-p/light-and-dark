class EnemyBossProjectileObject extends MovableObject {
  imagesFly = [
    `img/enemies/enemy_boss/3_poison-spell/1_poisenj.png`,
    `img/enemies/enemy_boss/3_poison-spell/2_poisenj.png`,
    `img/enemies/enemy_boss/3_poison-spell/3_poisenj.png`,
  ];

  hitboxOffset = {
    top: 25,
    bottom: 25,
    left: 20,
    right: 20,
  };

  constructor(startX, startY) {
    super();
    this.loadImage(this.imagesFly[0]);
    this.loadAnimationImages(this.imagesFly);

    this.x = startX;
    this.y = startY;
    this.height = 123;
    this.width = 170;

    this.animate();
    this.shootProjectile();
  }

  shootProjectile() {
    this.moveInterval = this.setStoppableInterval(() => {
      this.x -= 6;
    }, 1000 / 60);
  }

  animate() {
    this.animationInterval = this.setStoppableInterval(() => {
      this.displayAnimation(this.imagesFly);
    }, 150);
  }

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
