/**
 * Represents the visual and physical manifestation of the player's melee attack.
 * @class
 * @extends MovableObject
 */
class MeleeSlashObject extends MovableObject {
  /** @type {number} */
  width = 136;

  /** @type {number} */
  height = 120;

  /** @type {boolean} */
  isFinished = false;

  /** @type {boolean} */
  hasDealtDamage = false;

  /** @type {string[]} */
  static imagesSlash = [
    "img/characters/shadow/06_slash/1_slash.png",
    "img/characters/shadow/06_slash/2_slash.png",
  ];

  /**
   * Initializes the melee attack and binds it to the casting character.
   * @param {ShadowCharacter} character - Reference to the character performing the attack.
   */
  constructor(character) {
    super();
    this.loadImage(MeleeSlashObject.imagesSlash[0]);

    /** @type {ShadowCharacter} */
    this.character = character;

    this.updatePosition();
    this.followCharacter();
    this.animate();
  }

  /** Snaps the slash object to the character's current position and direction. */
  updatePosition() {
    this.changeDirection = this.character.changeDirection;

    if (this.changeDirection) {
      this.x = this.character.x - 30; // Attack hits to the left
    } else {
      this.x = this.character.x + 30; // Attack hits to the right
    }

    this.y = this.character.y;
  }

  /** Starts a tracking loop that aligns the slash with the moving character. */
  followCharacter() {
    /** @type {number} */
    this.followInterval = this.setStoppableInterval(() => {
      this.updatePosition();
    }, 1000 / 60);
  }

  /** Plays the animation/sound and flags the object for deletion when finished. */
  animate() {
    /** @type {number} */
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
