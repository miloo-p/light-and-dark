/**
 * Represents a magic projectile fired by the player character.
 * @class
 * @extends MovableObject
 */
class ProjectileObject extends MovableObject {
  /** @type {{top: number, bottom: number, left: number, right: number}} */
  hitboxOffset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * Initializes a new projectile instance and starts its flight path.
   * @param {number} characterX - The current x-coordinate of the character.
   * @param {number} characterY - The current y-coordinate of the character.
   * @param {boolean} isFacingLeft - Indicates if the projectile is facing left.
   */
  constructor(characterX, characterY, isFacingLeft) {
    super();
    this.loadImage("img/characters/shadow/projectile/shadow_projectile.png");
    this.height = 45;
    this.width = 45;

    this.changeDirection = isFacingLeft;

    // Adjust spawn position based on the direction the character is facing
    if (this.changeDirection) {
      this.x = characterX;
    } else {
      this.x = characterX + 80;
    }
    this.y = characterY;

    this.shootProjectile();
  }

  /** Initiates the projectile's movement, gravity arc, and sound effect. */
  shootProjectile() {
    this.speedY = 10;
    this.applyGravity();
    AudioManager.playSFX("spell_shoot");

    /** @type {number} */
    this.moveInterval = this.setStoppableInterval(() => {
      if (this.changeDirection) {
        this.x -= 6;
      } else {
        this.x += 6;
      }
    }, 1000 / 60);
  }

  /** Safely stops all intervals associated with this projectile. */
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
