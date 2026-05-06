class EnemyEndboss extends MovableObject {
  height = 500;
  width = 547;
  y = -25;
  x = 2700;
  targetX = 2400;

  hitboxOffset = {
    top: 60,
    bottom: 20,
    left: 40,
    right: 40,
  };

  healthPoints = 100;

  isTriggered = false;
  isShooting = false;
  hasFiredProjectile = false;
  isNextPoisonHigh = false;
  attackLoopStarted = false;
  hasPlayedDeathSound = false;

  imagesIdle = [
    `img/enemies/enemy_boss/6_idle/1_i.png`,
    `img/enemies/enemy_boss/6_idle/2_i.png`,
    `img/enemies/enemy_boss/6_idle/3_i.png`,
    `img/enemies/enemy_boss/6_idle/4_i.png`,
    `img/enemies/enemy_boss/6_idle/5_i.png`,
    `img/enemies/enemy_boss/6_idle/6_i.png`,
  ];
  imagesWalk = [
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
  imagesDead = [
    `img/enemies/enemy_boss/5_dead/1_d.png`,
    `img/enemies/enemy_boss/5_dead/2_d.png`,
    `img/enemies/enemy_boss/5_dead/3_d.png`,
    `img/enemies/enemy_boss/5_dead/4_d.png`,
    `img/enemies/enemy_boss/5_dead/5_d.png`,
  ];
  imagesHurt = [
    `img/enemies/enemy_boss/4_hurt/1_h.png`,
    `img/enemies/enemy_boss/4_hurt/2_h.png`,
    `img/enemies/enemy_boss/4_hurt/3_h.png`,
    `img/enemies/enemy_boss/4_hurt/4_h.png`,
    `img/enemies/enemy_boss/4_hurt/5_h.png`,
    `img/enemies/enemy_boss/4_hurt/6_h.png`,
  ];
  imagesShoot = [
    `img/enemies/enemy_boss/2_shoot-spell/1_s.png`,
    `img/enemies/enemy_boss/2_shoot-spell/2_s.png`,
    `img/enemies/enemy_boss/2_shoot-spell/3_s.png`,
    `img/enemies/enemy_boss/2_shoot-spell/4_s.png`,
    `img/enemies/enemy_boss/2_shoot-spell/5_s.png`,
    `img/enemies/enemy_boss/2_shoot-spell/6_s.png`,
  ];

  constructor() {
    super().loadImage(this.imagesIdle[0]);
    this.loadAnimationImages(this.imagesIdle);
    this.loadAnimationImages(this.imagesWalk);
    this.loadAnimationImages(this.imagesHurt);
    this.loadAnimationImages(this.imagesShoot);
    this.loadAnimationImages(this.imagesDead);
    this.animate();
  }

  animate() {
    this.setStoppableInterval(() => {
      if (this.isDead()) {
        this.displayAnimationOnce(this.imagesDead);
        this.checkIsDead();
      } else if (this.isShooting) {
        this.handleShootingState();
      } else if (this.isHurt()) {
        this.displayAnimation(this.imagesHurt);
        this.checkIsHurt();
      } else if (this.isTriggered) {
        this.handleMovementAnimation();
      } else {
        this.displayAnimation(this.imagesIdle);
      }
    }, 200);

    this.setStoppableInterval(() => {
      if (this.isTriggered && !this.isDead() && !this.isHurt() && !this.isShooting) {
        if (this.x > this.targetX) {
          this.x -= 2.5;
        } else if (!this.attackLoopStarted) {
          this.x = this.targetX;
          this.attackLoopStarted = true;
          this.startAttackDecisionLoop();
        }
      }
    }, 1000 / 60);
  }

  handleMovementAnimation() {
    if (this.x > this.targetX) {
      this.displayAnimation(this.imagesWalk);
    } else {
      this.displayAnimation(this.imagesIdle);
    }
  }

  handleShootingState() {
    this.displayAnimation(this.imagesShoot);
    let currentFrameIndex = this.currentImage % this.imagesShoot.length;

    if (currentFrameIndex === 3 && !this.hasFiredProjectile) {
      this.shootPoison();
      this.hasFiredProjectile = true;
    }

    if (currentFrameIndex === this.imagesShoot.length - 1) {
      this.isShooting = false;
    }
  }

  startAttackDecisionLoop() {
    this.setStoppableInterval(() => {
      if (this.isTriggered && !this.isDead() && !this.isShooting) {
        this.isShooting = true;
        this.hasFiredProjectile = false;
        this.currentImage = 0;
      }
    }, 2000);
  }

  shootPoison() {
    let spawnX = this.x - 20;
    let spawnY = this.isNextPoisonHigh ? this.y + 100 : this.y + 300;

    let poisonProjectile = new EnemyBossProjectileObject(spawnX, spawnY);
    world.enemyProjectiles.push(poisonProjectile);
    AudioManager.playSFX("boss_serpent_spell");
    this.isNextPoisonHigh = !this.isNextPoisonHigh;
  }

  checkIsDead() {
    if (this.isDead() && !this.hasPlayedDeathSound) {
      AudioManager.playSFX("boss_dies");
      this.hasPlayedDeathSound = true;
    }
  }

  checkIsHurt() {
    if (this.isHurt()) {
      let soundToPlay = Math.random() < 0.5 ? "boss_hurt_1" : "boss_hurt_2";
      AudioManager.playSFX(soundToPlay);
    }
  }
}
