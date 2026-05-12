/**
 * Represents a magic projectile fired by the player character.
 * Handles its own horizontal movement, gravity arc, and cleanup.
 * @class
 * @extends MovableObject
 */
class ProjectileObject extends MovableObject {
  /**
   * Custom bounding box for accurate collision detection.
   * For the projectile, it matches the exact width and height of the image.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  hitboxOffset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * Initializes a new projectile instance and automatically starts its flight path.
   * @param {number} characterX - The current x-coordinate of the character firing the projectile.
   * @param {number} characterY - The current y-coordinate of the character firing the projectile.
   * @param {boolean} isFacingLeft - Indicates if the character (and thus the projectile) is facing left.
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

  /**
   * Initiates the projectile's movement.
   * Applies an initial upward velocity (`speedY`), starts gravity for an arcing trajectory,
   * plays the cast sound effect, and sets the horizontal flight interval.
   */
  shootProjectile() {
    this.speedY = 10;
    this.applyGravity();
    AudioManager.playSFX("spell_shoot");

    /**
     * Internal reference to the horizontal movement interval.
     * @type {number}
     */
    this.moveInterval = this.setStoppableInterval(() => {
      if (this.changeDirection) {
        this.x -= 6;
      } else {
        this.x += 6;
      }
    }, 1000 / 60);
  }

  /**
   * Safely stops all intervals associated with this projectile.
   * Called by the World class when the projectile hits a target or flies out of bounds
   * to prevent memory leaks and ghost collisions.
   */
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
