/**
 * Represents the visual and physical manifestation of the player's melee attack.
 * Temporarily attaches itself to the character, plays a short animation, and then flags itself for removal.
 * @class
 * @extends MovableObject
 */
class MeleeSlashObject extends MovableObject {
  /**
   * The width of the melee slash visual in pixels.
   * @type {number}
   */
  width = 136;

  /**
   * The height of the melee slash visual in pixels.
   * @type {number}
   */
  height = 120;

  /**
   * Flag indicating whether the slash animation has completed.
   * Monitored by the World class to remove the object from the active attacks array.
   * @type {boolean}
   */
  isFinished = false;

  /**
   * Prevents the slash from dealing damage on every single frame during its lifetime.
   * Once an enemy is hit, this is set to true by the collision detector.
   * @type {boolean}
   */
  hasDealtDamage = false;

  /**
   * Array of image paths comprising the quick slash animation sequence.
   * @static
   * @type {string[]}
   */
  static imagesSlash = [
    "img/characters/shadow/06_slash/1_slash.png",
    "img/characters/shadow/06_slash/2_slash.png",
  ];

  /**
   * Initializes the melee attack, binds it to the casting character, and starts its lifecycle.
   * @param {ShadowCharacter} character - Reference to the character performing the attack, used for position tracking.
   */
  constructor(character) {
    super();
    this.loadImage(MeleeSlashObject.imagesSlash[0]);

    /**
     * Internal reference to the parent character.
     * @type {ShadowCharacter}
     */
    this.character = character;

    this.updatePosition();
    this.followCharacter();
    this.animate();
  }

  /**
   * Snaps the slash object to the character's current position.
   * Adjusts the horizontal offset based on which direction the character is facing.
   */
  updatePosition() {
    this.changeDirection = this.character.changeDirection;

    if (this.changeDirection) {
      this.x = this.character.x - 30; // Attack hits to the left
    } else {
      this.x = this.character.x + 30; // Attack hits to the right
    }

    this.y = this.character.y;
  }

  /**
   * Starts a 60 FPS loop that continuously aligns the slash with the moving character.
   * Ensures the attack doesn't stay behind if the player is running.
   */
  followCharacter() {
    /**
     * Interval ID for the position tracking loop.
     * @type {number}
     */
    this.followInterval = this.setStoppableInterval(() => {
      this.updatePosition();
    }, 1000 / 60);
  }

  /**
   * Plays the two-frame animation and the corresponding sound effect.
   * Once the final frame is reached, it automatically clears its intervals and marks itself as finished.
   */
  animate() {
    /**
     * Interval ID for the animation frame loop.
     * @type {number}
     */
    this.animationInterval = this.setStoppableInterval(() => {
      if (this.currentImage < MeleeSlashObject.imagesSlash.length) {
        let path = MeleeSlashObject.imagesSlash[this.currentImage];
        this.img = this.imageCache[path];
        AudioManager.playSFX("melee_swoosh");
        this.currentImage++;
      } else {
        // Animation complete: flag for deletion and stop all internal logic
        this.isFinished = true;
        clearInterval(this.followInterval);
        clearInterval(this.animationInterval);
      }
    }, 100);
  }
}
