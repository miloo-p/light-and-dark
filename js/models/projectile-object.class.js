class ProjectileObject extends MovableObject {
  hitboxOffset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  constructor(characterX, characterY, isFacingLeft) {
    super();
    this.loadImage("img/characters/shadow/projectile/shadow_projectile.png");
    this.height = 45;
    this.width = 45;

    this.changeDirection = isFacingLeft;

    if (this.changeDirection) {
      this.x = characterX;
    } else {
      this.x = characterX + 80;
    }
    this.y = characterY;

    this.shootProjectile();
  }

  shootProjectile() {
    this.speedY = 10;
    this.applyGravity();

    this.moveInterval = setInterval(() => {
      if (this.changeDirection) {
        this.x -= 6;
      } else {
        this.x += 6;
      }
    }, 1000 / 60);
  }

  destroy() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }

    if (this.gravityInterval) {
      clearInterval(this.gravityInterval);
      this.gravityInterval = null;
    }
  }
}
