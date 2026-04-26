class ProjectileObject extends MovableObject {
  constructor(startX, startY) {
    super();
    this.loadimage("img/characters/shadow/projectile/shaowy_projectile.png");
    this.x = startX;
    this.y = startY;
    this.height = 45;
    this.width = 45;
    this.shootProjectile(startX, startY);
  }

  shootProjectile(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = 10;
    this.applyGravity();

    setInterval(() => {
      this.x += 6;
    }, 1000 / 60);
  }
}
