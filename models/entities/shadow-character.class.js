/**
 * The main playable character in the game.
 * Handles player input, character-specific animations, audio, and game-over logic.
 * @class
 * @extends MovableObject
 */
class ShadowCharacter extends MovableObject {
  /**
   * Horizontal movement speed of the character.
   * @type {number}
   */
  speed = 3;

  /**
   * Array storing active particles emitted by the character.
   * @type {Particle[]}
   */
  particles = [];

  /**
   * Custom bounding box for accurate collision detection.
   * Insets the visual sprite boundaries to match the character's physical shape.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  hitboxOffset = {
    top: 20,
    bottom: 5,
    left: 60,
    right: 40,
  };

  /**
   * Current health points of the character.
   * @type {number}
   */
  healthPoints = 100;

  /**
   * Current shadow energy points, used for special attacks (e.g., projectiles).
   * @type {number}
   */
  energyPoints = 40;

  /**
   * Counter for the total amount of coins collected by the player.
   * @type {number}
   */
  collectedCoins = 0;

  /**
   * Flag to prevent overlapping or redundant playback of the walking audio layers.
   * @type {boolean}
   */
  isWalkingSoundPlaying = false;

  /**
   * Flag to ensure the game-over transition sequence is only triggered once upon death.
   * @type {boolean}
   */
  gameOverProcessed = false;

  /** @static @type {string[]} Array of image paths for the idle animation. */
  static imagesIdle = [
    `img/characters/shadow/01_idle/i1-1.png`,
    `img/characters/shadow/01_idle/i1-2.png`,
    `img/characters/shadow/01_idle/i1-3.png`,
    `img/characters/shadow/01_idle/i1-4.png`,
    `img/characters/shadow/01_idle/i1-5.png`,
    `img/characters/shadow/01_idle/i1-6.png`,
    `img/characters/shadow/01_idle/i1-7.png`,
    `img/characters/shadow/01_idle/i1-8.png`,
    `img/characters/shadow/01_idle/i1-9.png`,
    `img/characters/shadow/01_idle/i1-10.png`,
    `img/characters/shadow/01_idle/i1-11.png`,
    `img/characters/shadow/01_idle/i1-12.png`,
    `img/characters/shadow/01_idle/i1-13.png`,
  ];

  /** @static @type {string[]} Array of image paths for the walking animation. */
  static imagesWalk = [
    `img/characters/shadow/02_walk/w1-1.png`,
    `img/characters/shadow/02_walk/w1-2.png`,
    `img/characters/shadow/02_walk/w1-3.png`,
    `img/characters/shadow/02_walk/w1-4.png`,
    `img/characters/shadow/02_walk/w1-5.png`,
    `img/characters/shadow/02_walk/w1-6.png`,
    `img/characters/shadow/02_walk/w1-7.png`,
    `img/characters/shadow/02_walk/w1-8.png`,
    `img/characters/shadow/02_walk/w1-9.png`,
    `img/characters/shadow/02_walk/w1-10.png`,
    `img/characters/shadow/02_walk/w1-11.png`,
    `img/characters/shadow/02_walk/w1-12.png`,
    `img/characters/shadow/02_walk/w1-13.png`,
  ];

  /** @static @type {string[]} Array of image paths for the jumping/falling animation. */
  static imagesJump = [
    `img/characters/shadow/03_jump/j1-1.png`,
    `img/characters/shadow/03_jump/j1-2.png`,
    `img/characters/shadow/03_jump/j1-3.png`,
    `img/characters/shadow/03_jump/j1-4.png`,
    `img/characters/shadow/03_jump/j1-5.png`,
    `img/characters/shadow/03_jump/j1-6.png`,
    `img/characters/shadow/03_jump/j1-7.png`,
    `img/characters/shadow/03_jump/j1-8.png`,
    `img/characters/shadow/03_jump/j1-9.png`,
    `img/characters/shadow/03_jump/j1-10.png`,
    `img/characters/shadow/03_jump/j1-11.png`,
    `img/characters/shadow/03_jump/j1-12.png`,
  ];

  /** @static @type {string[]} Array of image paths for the taking damage (hurt) animation. */
  static imagesHurt = [
    `img/characters/shadow/04_hurt/h1-1.png`,
    `img/characters/shadow/04_hurt/h1-2.png`,
    `img/characters/shadow/04_hurt/h1-3.png`,
    `img/characters/shadow/04_hurt/h1-4.png`,
    `img/characters/shadow/04_hurt/h1-5.png`,
  ];

  /** @static @type {string[]} Array of image paths for the death sequence animation. */
  static imagesDead = [
    `img/characters/shadow/05_dead/d1-1.png`,
    `img/characters/shadow/05_dead/d1-2.png`,
    `img/characters/shadow/05_dead/d1-3.png`,
    `img/characters/shadow/05_dead/d1-4.png`,
    `img/characters/shadow/05_dead/d1-5.png`,
    `img/characters/shadow/05_dead/d1-6.png`,
    `img/characters/shadow/05_dead/d1-7.png`,
    `img/characters/shadow/05_dead/d1-8.png`,
    `img/characters/shadow/05_dead/d1-9.png`,
    `img/characters/shadow/05_dead/d1-10.png`,
    `img/characters/shadow/05_dead/d1-11.png`,
    `img/characters/shadow/05_dead/d1-12.png`,
    `img/characters/shadow/05_dead/d1-13.png`,
  ];

  /**
   * Initializes the ShadowCharacter, setting its initial position, physics properties,
   * and starting its core intervals (camera, gravity, animation).
   */
  constructor() {
    super();
    this.loadImage(ShadowCharacter.imagesIdle[0]);

    this.x = 20;
    this.y = 240;
    this.width = 138;
    this.height = 150;

    // Gives jumps a heavier, snappier feel
    this.fastFallEnabled = true;

    this.cameraBehavior();
    this.applyGravity();
    this.animate();
  }

  /**
   * Renders the character and its associated particles onto the canvas.
   * @override
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the main canvas.
   */
  draw(ctx) {
    this.handleParticles(ctx);
    super.draw(ctx);
  }

  /**
   * Core state machine and animation loop running at ~8 FPS.
   * Evaluates the character's current state (dead, hurt, jumping, walking, idle)
   * and plays the corresponding animations and sounds.
   */
  animate() {
    this.setStoppableInterval(() => {
      if (!this.world || !this.world.keyboard) return;

      if (this.isDead()) {
        this.displayAnimationOnce(ShadowCharacter.imagesDead);
        this.stopWalkingSound();
        this.triggerGameOver();
      } else if (this.isHurt()) {
        this.displayAnimation(ShadowCharacter.imagesHurt);
        this.stopWalkingSound();
      } else if (this.isAboveGround()) {
        this.displayAnimation(ShadowCharacter.imagesJump);
        this.stopWalkingSound();
      } else {
        if (this.world.keyboard.keyRight || this.world.keyboard.keyLeft) {
          this.displayAnimation(ShadowCharacter.imagesWalk);
          this.playWalkingSound();
        } else {
          this.displayAnimation(ShadowCharacter.imagesIdle);
          this.stopWalkingSound();
        }
      }

      // Handle jump input
      if (this.world.keyboard.keyJump && !this.isAboveGround() && !this.isDead()) {
        this.jump();
      }
    }, 1000 / 8);
  }

  /**
   * Initiates a jump by applying an upward vertical velocity.
   */
  jump() {
    this.speedY = 15;
  }

  /**
   * Handles the death sequence logic.
   * Sets the internal lock to prevent multiple triggers and delays the UI transition
   * to let the death animation finish.
   * @fires UIManager#showGameOver
   */
  triggerGameOver() {
    if (!this.gameOverProcessed) {
      this.gameOverProcessed = true;

      setTimeout(() => {
        if (typeof uiManager !== "undefined") {
          uiManager.showGameOver();
        }
      }, 1500);
    }
  }

  /**
   * Starts playing the atmospheric walking sound layers if they are not already active.
   * @see AudioManager
   */
  playWalkingSound() {
    if (!this.isWalkingSoundPlaying) {
      AudioManager.playLayer("walking_forest", "player_walk_layer");
      AudioManager.playLayer("whispering_spells", "player_walk_layer-2");
      this.isWalkingSoundPlaying = true;
    }
  }

  /**
   * Stops the walking sound layers.
   * @see AudioManager
   */
  stopWalkingSound() {
    if (this.isWalkingSoundPlaying) {
      AudioManager.stopLayer("player_walk_layer");
      AudioManager.stopLayer("player_walk_layer-2");
      this.isWalkingSoundPlaying = false;
    }
  }
}
