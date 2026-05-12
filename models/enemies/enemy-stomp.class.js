/**
 * Represents a basic, ground-based enemy (the "Stomp").
 * It moves continuously to the left and handles its own walking and death audio.
 * @class
 * @extends MovableObject
 */
class EnemyStomp extends MovableObject {
  /**
   * The horizontal movement speed.
   * Randomized slightly so multiple instances don't walk in perfect synchronization.
   * @type {number}
   */
  speed = 0.15 + Math.random() * 0.25;

  /**
   * Health points of the enemy. Set to 20, usually meaning it dies in one hit.
   * @type {number}
   */
  healthPoints = 20;

  /**
   * Flag to track if the walking audio loop is currently active.
   * @type {boolean}
   */
  isWalkingSoundPlaying = false;

  /**
   * A unique identifier for this specific instance's audio layer.
   * Prevents multiple Stomp enemies from interfering with each other's audio channels.
   * @type {string}
   */
  walkLayerId = `stomp_walk_${Math.random()}`;

  /**
   * Flag to ensure the death sound effects are only triggered exactly once.
   * @type {boolean}
   */
  hasPlayedDeathSound = false;

  /**
   * Custom bounding box to tighten the collision area around the visual sprite.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  hitboxOffset = {
    top: 0,
    bottom: 0,
    left: 15,
    right: 20,
  };

  /** @static @type {string[]} Array of image paths for the idle animation. */
  static imagesIdle = [
    `img/enemies/enemy_stomp/idle/1_i.png`,
    `img/enemies/enemy_stomp/idle/2_i.png`,
    `img/enemies/enemy_stomp/idle/3_i.png`,
    `img/enemies/enemy_stomp/idle/4_i.png`,
    `img/enemies/enemy_stomp/idle/5_i.png`,
    `img/enemies/enemy_stomp/idle/6_i.png`,
    `img/enemies/enemy_stomp/idle/7_i.png`,
  ];

  /** @static @type {string[]} Array of image paths for the walking animation. */
  static imagesWalk = [
    `img/enemies/enemy_stomp/walking/1_w.png`,
    `img/enemies/enemy_stomp/walking/2_w.png`,
    `img/enemies/enemy_stomp/walking/3_w.png`,
    `img/enemies/enemy_stomp/walking/4_w.png`,
    `img/enemies/enemy_stomp/walking/5_w.png`,
  ];

  /** @static @type {string[]} Array of image paths for the attack animation. */
  static imagesAttack = [
    `img/enemies/enemy_stomp/attack/1_a.png`,
    `img/enemies/enemy_stomp/attack/2_a.png`,
    `img/enemies/enemy_stomp/attack/3_a.png`,
    `img/enemies/enemy_stomp/attack/4_a.png`,
    `img/enemies/enemy_stomp/attack/5_a.png`,
  ];

  /** @static @type {string[]} Array of image paths for the death animation. */
  static imagesDead = [`img/enemies/enemy_stomp/death/6_d.png`, `img/enemies/enemy_stomp/death/7_d.png`];

  /**
   * Initializes the enemy, sets its spawn position, and starts its behavior loops.
   * @param {number} x - The base x-coordinate for spawning. A random offset is added to this.
   */
  constructor(x) {
    super();
    this.loadImage(EnemyStomp.imagesIdle[0]);

    // Add a random offset so clumped spawns are spread out naturally
    this.x = x + Math.random() * 500;
    this.y = 300;
    this.width = 71;
    this.height = 70;

    this.animate();
    this.moveLeft(); // Inherited from MovableObject
  }

  /**
   * The main animation loop running at roughly 4 FPS (250ms).
   * Switches between walking and death animations based on health status.
   */
  animate() {
    this.setStoppableInterval(() => {
      if (this.isDead()) {
        this.displayAnimation(EnemyStomp.imagesDead);
        this.checkStompIsDead();
      } else {
        this.displayAnimation(EnemyStomp.imagesWalk);
      }
    }, 250);
  }

  /**
   * Starts playing the walking sound on this instance's unique audio layer.
   * @see AudioManager
   */
  playWalkingSound() {
    if (!this.isWalkingSoundPlaying) {
      AudioManager.playLayer("stomp_walking", this.walkLayerId);
      this.isWalkingSoundPlaying = true;
    }
  }

  /**
   * Stops the walking sound on this instance's unique audio layer.
   * @see AudioManager
   */
  stopWalkingSound() {
    if (this.isWalkingSoundPlaying) {
      AudioManager.stopLayer(this.walkLayerId);
      this.isWalkingSoundPlaying = false;
    }
  }

  /**
   * Evaluates if the enemy has just died.
   * If so, it halts the walking sound and triggers the death SFX exactly once.
   */
  checkStompIsDead() {
    if (this.isDead() && !this.hasPlayedDeathSound) {
      this.stopWalkingSound();
      AudioManager.playSFX("stomp_dead_crate");
      AudioManager.playSFX("stomp_dead_pain");
      this.hasPlayedDeathSound = true;
    }
  }
}
