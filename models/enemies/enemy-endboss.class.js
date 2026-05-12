/**
 * Represents the final boss enemy of the game.
 * Features a multi-phase behavior: waits off-screen, walks in when triggered,
 * and then executes a continuous, alternating attack loop.
 * @class
 * @extends MovableObject
 */
class EnemyEndboss extends MovableObject {
  /** @type {number} The height of the boss in pixels. */
  height = 500;

  /** @type {number} The width of the boss in pixels. */
  width = 547;

  /** @type {number} The vertical position of the boss. */
  y = -25;

  /** @type {number} The initial off-screen horizontal position. */
  x = 2700;

  /** @type {number} The horizontal coordinate the boss walks to before starting its attacks. */
  targetX = 2400;

  /**
   * Custom bounding box for collision detection.
   * Significantly inset to make the giant sprite's hit area feel fair to the player.
   * @type {{top: number, bottom: number, left: number, right: number}}
   */
  hitboxOffset = {
    top: 60,
    bottom: 20,
    left: 40,
    right: 40,
  };

  /** @type {number} Total health points of the boss. Requires 10 hits (20 dmg each) to defeat. */
  healthPoints = 200;

  /** @type {boolean} Flag indicating if the player has crossed the trigger line to start the fight. */
  isTriggered = false;

  /** @type {boolean} State flag indicating if the boss is currently locked in its shooting animation. */
  isShooting = false;

  /** @type {boolean} Prevents the boss from firing multiple projectiles in a single animation cycle. */
  hasFiredProjectile = false;

  /** * Toggles the spawn height of the poison projectile.
   * Forces the player to alternate between jumping and ducking/standing.
   * @type {boolean}
   */
  isNextPoisonHigh = false;

  /** @type {boolean} Ensures the attack interval is only started once after the boss reaches its target position. */
  attackLoopStarted = false;

  /** @type {boolean} Ensures the death sound plays exactly once. */
  hasPlayedDeathSound = false;

  /** @type {boolean} Ensures the giant footstep sound plays exactly once upon entering the arena. */
  hasPlayedWalkingSound = false;

  /** @static @type {string[]} Array of image paths for the idle animation. */
  static imagesIdle = [
    `img/enemies/enemy_boss/6_idle/1_i.png`,
    `img/enemies/enemy_boss/6_idle/2_i.png`,
    `img/enemies/enemy_boss/6_idle/3_i.png`,
    `img/enemies/enemy_boss/6_idle/4_i.png`,
    `img/enemies/enemy_boss/6_idle/5_i.png`,
    `img/enemies/enemy_boss/6_idle/6_i.png`,
  ];

  /** @static @type {string[]} Array of image paths for the walking (entering arena) animation. */
  static imagesWalk = [
    `img/enemies/enemy_boss/1_walk/1_w.png`,
    `img/enemies/enemy_boss/1_walk/2_w.png`,
    `img/enemies/enemy_boss/1_walk/3_w.png`,
    `img/enemies/enemy_boss/1_walk/4_w.png`,
    `img/enemies/enemy_boss/1_walk/5_w.png`,
    `img/enemies/enemy_boss/1_walk/6_w.png`,
    `img/enemies/enemy_boss/1_walk/7_w.png`,
    `img/enemies/enemy_boss/1_walk/8_w.png`,
    `img/enemies/enemy_boss/1_walk/9_w.png`,
    `img/enemies/enemy_boss/1_walk/10_w.png`,
  ];

  /** @static @type {string[]} Array of image paths for the death sequence. */
  static imagesDead = [
    `img/enemies/enemy_boss/5_dead/1_d.png`,
    `img/enemies/enemy_boss/5_dead/2_d.png`,
    `img/enemies/enemy_boss/5_dead/3_d.png`,
    `img/enemies/enemy_boss/5_dead/4_d.png`,
    `img/enemies/enemy_boss/5_dead/5_d.png`,
  ];

  /** @static @type {string[]} Array of image paths for taking damage. */
  static imagesHurt = [
    `img/enemies/enemy_boss/4_hurt/1_h.png`,
    `img/enemies/enemy_boss/4_hurt/2_h.png`,
    `img/enemies/enemy_boss/4_hurt/3_h.png`,
    `img/enemies/enemy_boss/4_hurt/4_h.png`,
    `img/enemies/enemy_boss/4_hurt/5_h.png`,
    `img/enemies/enemy_boss/4_hurt/6_h.png`,
  ];

  /** @static @type {string[]} Array of image paths for the projectile firing animation. */
  static imagesShoot = [
    `img/enemies/enemy_boss/2_shoot-spell/1_s.png`,
    `img/enemies/enemy_boss/2_shoot-spell/2_s.png`,
    `img/enemies/enemy_boss/2_shoot-spell/3_s.png`,
    `img/enemies/enemy_boss/2_shoot-spell/4_s.png`,
    `img/enemies/enemy_boss/2_shoot-spell/5_s.png`,
    `img/enemies/enemy_boss/2_shoot-spell/6_s.png`,
  ];

  /**
   * Initializes the boss, sets its first image, and starts its behavior loops.
   */
  constructor() {
    super();
    this.loadImage(EnemyEndboss.imagesIdle[0]);
    this.animate();
  }

  /**
   * Main behavior orchestrator containing two distinct loops.
   * 1. The animation loop (200ms): Handles visual state transitions.
   * 2. The movement loop (60 FPS): Handles the cinematic arena entrance.
   */
  animate() {
    // Loop 1: Animation and State Rendering
    this.setStoppableInterval(() => {
      if (this.isDead()) {
        this.displayAnimationOnce(EnemyEndboss.imagesDead);
        this.checkIsDead();
      } else if (this.isShooting) {
        this.handleShootingState();
      } else if (this.isHurt()) {
        this.displayAnimation(EnemyEndboss.imagesHurt);
        this.checkIsHurt();
      } else if (this.isTriggered) {
        this.handleMovementAnimation();
        this.checkIsWalking();
      } else {
        this.displayAnimation(EnemyEndboss.imagesIdle);
      }
    }, 200);

    // Loop 2: Physical Movement and Phase Triggers
    this.setStoppableInterval(() => {
      if (this.isTriggered && !this.isDead() && !this.isHurt() && !this.isShooting) {
        // Phase 1: Walk into the arena
        if (this.x > this.targetX) {
          this.x -= 2.5;
        }
        // Phase 2: Reach position and begin combat
        else if (!this.attackLoopStarted) {
          this.x = this.targetX;
          this.attackLoopStarted = true;
          this.startAttackDecisionLoop();
        }
      }
    }, 1000 / 60);
  }

  /**
   * Determines whether to show the walking or idle animation based on the boss's current position.
   */
  handleMovementAnimation() {
    if (this.x > this.targetX) {
      this.displayAnimation(EnemyEndboss.imagesWalk);
    } else {
      this.displayAnimation(EnemyEndboss.imagesIdle);
    }
  }

  /**
   * Processes the shooting animation cycle.
   * Triggers the actual projectile spawn exactly on the 4th frame (index 3).
   * Unlocks the state machine once the animation finishes.
   */
  handleShootingState() {
    this.displayAnimation(EnemyEndboss.imagesShoot);
    let currentFrameIndex = this.currentImage % EnemyEndboss.imagesShoot.length;

    // Spawn projectile mid-animation
    if (currentFrameIndex === 3 && !this.hasFiredProjectile) {
      this.shootPoison();
      this.hasFiredProjectile = true;
    }

    // End shooting state on the last frame
    if (currentFrameIndex === EnemyEndboss.imagesShoot.length - 1) {
      this.isShooting = false;
    }
  }

  /**
   * Starts a timer that periodically triggers the boss to attack.
   * Runs every 2 seconds once the boss is in position.
   */
  startAttackDecisionLoop() {
    this.setStoppableInterval(() => {
      if (this.isTriggered && !this.isDead() && !this.isShooting) {
        this.isShooting = true;
        this.hasFiredProjectile = false; // Reset the safety lock
        this.currentImage = 0; // Ensure animation starts from frame 1
      }
    }, 2000);
  }

  /**
   * Spawns a poison projectile and alternates its vertical spawn position.
   * High projectiles must be ducked under, low ones must be jumped over.
   */
  shootPoison() {
    let spawnX = this.x - 20;
    let spawnY = this.isNextPoisonHigh ? this.y + 100 : this.y + 300;

    let poisonProjectile = new EnemyBossProjectileObject(spawnX, spawnY);
    world.enemyProjectiles.push(poisonProjectile);
    AudioManager.playSFX("boss_serpent_spell");

    // Toggle height for the next attack
    this.isNextPoisonHigh = !this.isNextPoisonHigh;
  }

  /**
   * Plays the boss death sound exactly once when health reaches zero.
   */
  checkIsDead() {
    if (this.isDead() && !this.hasPlayedDeathSound) {
      AudioManager.playSFX("boss_dies");
      this.hasPlayedDeathSound = true;
    }
  }

  /**
   * Plays the cinematic heavy footstep sound exactly once when the boss enters the screen.
   */
  checkIsWalking() {
    if (this.isTriggered && !this.hasPlayedWalkingSound) {
      AudioManager.playSFX("boss_walk_giant");
      this.hasPlayedWalkingSound = true;
    }
  }

  /**
   * Randomly selects and plays one of two pain sounds when the boss takes damage.
   */
  checkIsHurt() {
    if (this.isHurt()) {
      let soundToPlay = Math.random() < 0.5 ? "boss_hurt_1" : "boss_hurt_2";
      AudioManager.playSFX(soundToPlay);
    }
  }
}
