class EnemyPlantProjectileObject extends MovableObject {
  imagesFly = [`img/enemies/enemy_plant/projectile/1_p.png`, `img/enemies/enemy_plant/projectile/2_p.png`];

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
    this.height = 45;
    this.width = 45;

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
