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
  isDeadState = false;

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
    setInterval(() => {
      if (this.isDead()) {
        this.displayAnimation(this.imagesDead);
      } else if (this.isHurt()) {
        this.displayAnimation(this.imagesHurt);
      } else if (this.isTriggered) {
        if (this.x > this.targetX) {
          this.displayAnimation(this.imagesWalk);
        } else {
          this.displayAnimation(this.imagesIdle);
        }
      } else {
        this.displayAnimation(this.imagesIdle);
      }
    }, 200);

    setInterval(() => {
      if (this.isTriggered && !this.isDead() && !this.isHurt() && this.x > this.targetX) {
        this.x -= 2.5;
      }
    }, 1000 / 60);
  }

  moveLeft() {
    this.x -= 0.5;
  }
}
