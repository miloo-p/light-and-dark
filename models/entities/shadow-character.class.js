/**
 * The main playable character in the game.
 * @class
 * @extends MovableObject
 */
class ShadowCharacter extends MovableObject {
  /** @type {number} */
  speed = 4;

  /** @type {Particle[]} */
  particles = [];

  /** @type {{top: number, bottom: number, left: number, right: number}} */
  hitboxOffset = {
    top: 20,
    bottom: 5,
    left: 60,
    right: 40,
  };

  /** @type {number} */
  healthPoints = 100;

  /** @type {number} */
  energyPoints = 40;

  /** @type {number} */
  collectedCoins = 0;

  /** @type {boolean} */
  isWalkingSoundPlaying = false;

  /** @type {boolean} */
  gameOverProcessed = false;

  /** @type {string[]} */
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

  /** @type {string[]} */
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

  /** @type {string[]} */
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

  /** @type {string[]} */
  static imagesHurt = [
    `img/characters/shadow/04_hurt/h1-1.png`,
    `img/characters/shadow/04_hurt/h1-2.png`,
    `img/characters/shadow/04_hurt/h1-3.png`,
    `img/characters/shadow/04_hurt/h1-4.png`,
    `img/characters/shadow/04_hurt/h1-5.png`,
  ];

  /** @type {string[]} */
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

  /** Initializes the ShadowCharacter with its properties and physics. */
  constructor() {
    super();
    this.loadImage(ShadowCharacter.imagesIdle[0]);

    this.x = 20;
    this.y = 240;
    this.width = 138;
    this.height = 150;
    this.fastFallEnabled = true;

    this.cameraBehavior();
    this.applyGravity();
    this.animate();
  }

  /**
   * Renders the character and its associated particles.
   * @override
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    this.handleParticles(ctx);
    super.draw(ctx);
  }

  /** Core state machine and animation loop running at ~8 FPS. */
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

      if (this.world.keyboard.keyJump && !this.isAboveGround() && !this.isDead()) {
        this.jump();
      }
    }, 1000 / 8);
  }

  /** Initiates a jump by applying vertical velocity. */
  jump() {
    this.speedY = 15;
  }

  /** Handles the death sequence and UI transition. */
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

  /** Starts playing the walking sound layers. */
  playWalkingSound() {
    if (!this.isWalkingSoundPlaying) {
      AudioManager.playLayer("walking_forest", "player_walk_layer");
      AudioManager.playLayer("whispering_spells", "player_walk_layer-2");
      this.isWalkingSoundPlaying = true;
    }
  }

  /** Stops the walking sound layers. */
  stopWalkingSound() {
    if (this.isWalkingSoundPlaying) {
      AudioManager.stopLayer("player_walk_layer");
      AudioManager.stopLayer("player_walk_layer-2");
      this.isWalkingSoundPlaying = false;
    }
  }
}
