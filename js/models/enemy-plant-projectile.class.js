class EnemyPlantProjectileObject extends MovableObject {
  imagesFly = [`img/enemies/enemy_plant/projectile/1_p.png`, `img/enemies/enemy_plant/projectile/2_p.png`];

  hitboxOffset = {
    top: 8,
    bottom: 8,
    left: 8,
    right: 5,
  };

  constructor(startX, startY) {
    super();
    this.loadImage(this.imagesFly[0]);
    this.loadAnimationImages(this.imagesFly);

    this.x = startX;
    this.y = startY;
    this.height = 45;
    this.width = 45;

    this.animate();
    this.shootProjectile();
  }

  shootProjectile() {
    this.moveInterval = setInterval(() => {
      this.x -= 6;
    }, 1000 / 60);
  }

  animate() {
    this.animationInterval = setInterval(() => {
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
