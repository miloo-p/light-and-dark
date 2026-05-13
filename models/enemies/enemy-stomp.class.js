/**
 * Represents a basic, ground-based enemy (the "Stomp").
 * @class
 * @extends MovableObject
 */
class EnemyStomp extends MovableObject {
  /** @type {number} */
  speed = 0.15 + Math.random() * 0.25;

  /** @type {number} */
  healthPoints = 20;

  /** @type {boolean} */
  isWalkingSoundPlaying = false;

  /** @type {string} */
  walkLayerId = `stomp_walk_${Math.random()}`;

  /** @type {boolean} */
  hasPlayedDeathSound = false;

  /** @type {{top: number, bottom: number, left: number, right: number}} */
  hitboxOffset = {
    top: 0,
    bottom: 0,
    left: 15,
    right: 20,
  };

  /** @type {string[]} */
  static imagesIdle = [
    `img/enemies/enemy_stomp/idle/1_i.png`,
    `img/enemies/enemy_stomp/idle/2_i.png`,
    `img/enemies/enemy_stomp/idle/3_i.png`,
    `img/enemies/enemy_stomp/idle/4_i.png`,
    `img/enemies/enemy_stomp/idle/5_i.png`,
    `img/enemies/enemy_stomp/idle/6_i.png`,
    `img/enemies/enemy_stomp/idle/7_i.png`,
  ];

  /** @type {string[]} */
  static imagesWalk = [
    `img/enemies/enemy_stomp/walking/1_w.png`,
    `img/enemies/enemy_stomp/walking/2_w.png`,
    `img/enemies/enemy_stomp/walking/3_w.png`,
    `img/enemies/enemy_stomp/walking/4_w.png`,
    `img/enemies/enemy_stomp/walking/5_w.png`,
  ];

  /** @type {string[]} */
  static imagesAttack = [
    `img/enemies/enemy_stomp/attack/1_a.png`,
    `img/enemies/enemy_stomp/attack/2_a.png`,
    `img/enemies/enemy_stomp/attack/3_a.png`,
    `img/enemies/enemy_stomp/attack/4_a.png`,
    `img/enemies/enemy_stomp/attack/5_a.png`,
  ];

  /** @type {string[]} */
  static imagesDead = [`img/enemies/enemy_stomp/death/6_d.png`, `img/enemies/enemy_stomp/death/7_d.png`];

  /**
   * Initializes the enemy and sets its spawn position.
   * @param {number} x - The base x-coordinate for spawning.
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

  /** The main animation loop. Switches between walking and death animations. */
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

  /** Starts playing the walking sound on this instance's unique audio layer. */
  playWalkingSound() {
    if (!this.isWalkingSoundPlaying) {
      AudioManager.playLayer("stomp_walking", this.walkLayerId);
      this.isWalkingSoundPlaying = true;
    }
  }

  /** Stops the walking sound on this instance's unique audio layer. */
  stopWalkingSound() {
    if (this.isWalkingSoundPlaying) {
      AudioManager.stopLayer(this.walkLayerId);
      this.isWalkingSoundPlaying = false;
    }
  }

  /** Evaluates if the enemy has just died and triggers death sounds exactly once. */
  checkStompIsDead() {
    if (this.isDead() && !this.hasPlayedDeathSound) {
      this.stopWalkingSound();
      AudioManager.playSFX("stomp_dead_crate");
      AudioManager.playSFX("stomp_dead_pain");
      this.hasPlayedDeathSound = true;
    }
  }
}
