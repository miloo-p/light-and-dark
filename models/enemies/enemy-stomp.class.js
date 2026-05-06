class EnemyStomp extends MovableObject {
  speed = 0.15 + Math.random() * 0.25;

  healthPoints = 20;

  isWalkingSoundPlaying = false;
  walkLayerId = `stomp_walk_${Math.random()}`;
  hasPlayedDeathSound = false;

  hitboxOffset = {
    top: 0,
    bottom: 0,
    left: 15,
    right: 20,
  };

  imagesIdle = [
    `img/enemies/enemy_stomp/idle/1_i.png`,
    `img/enemies/enemy_stomp/idle/2_i.png`,
    `img/enemies/enemy_stomp/idle/3_i.png`,
    `img/enemies/enemy_stomp/idle/4_i.png`,
    `img/enemies/enemy_stomp/idle/5_i.png`,
    `img/enemies/enemy_stomp/idle/6_i.png`,
    `img/enemies/enemy_stomp/idle/7_i.png`,
  ];

  imagesWalk = [
    `img/enemies/enemy_stomp/walking/1_w.png`,
    `img/enemies/enemy_stomp/walking/2_w.png`,
    `img/enemies/enemy_stomp/walking/3_w.png`,
    `img/enemies/enemy_stomp/walking/4_w.png`,
    `img/enemies/enemy_stomp/walking/5_w.png`,
  ];

  imagesAttack = [
    `img/enemies/enemy_stomp/attack/1_a.png`,
    `img/enemies/enemy_stomp/attack/2_a.png`,
    `img/enemies/enemy_stomp/attack/3_a.png`,
    `img/enemies/enemy_stomp/attack/4_a.png`,
    `img/enemies/enemy_stomp/attack/5_a.png`,
  ];

  imagesDead = [`img/enemies/enemy_stomp/death/6_d.png`, `img/enemies/enemy_stomp/death/7_d.png`];

  constructor(x) {
    super().loadImage(`img/enemies/enemy_stomp/idle/1_i.png`);

    this.x = x + Math.random() * 500;
    this.y = 300;
    this.width = 71;
    this.height = 70;

    this.loadAnimationImages(this.imagesWalk);
    this.loadAnimationImages(this.imagesDead);
    this.animate();
    this.moveLeft();
  }

  animate() {
    this.setStoppableInterval(() => {
      if (this.isDead()) {
        this.displayAnimation(this.imagesDead);
        this.checkStompIsDead();
      } else {
        let i = this.currentImage % this.imagesWalk.length;
        let path = this.imagesWalk[i];
        this.img = this.imageCache[path];
        this.currentImage++;
      }
    }, 250);
  }

  playWalkingSound() {
    if (!this.isWalkingSoundPlaying) {
      AudioManager.playLayer("stomp_walking", this.walkLayerId);
      this.isWalkingSoundPlaying = true;
    }
  }

  stopWalkingSound() {
    if (this.isWalkingSoundPlaying) {
      AudioManager.stopLayer(this.walkLayerId);
      this.isWalkingSoundPlaying = false;
    }
  }

  checkStompIsDead() {
    if (this.isDead() && !this.hasPlayedDeathSound) {
      this.stopWalkingSound();
      AudioManager.playSFX("stomp_dead_crate");
      AudioManager.playSFX("stomp_dead_pain");
      this.hasPlayedDeathSound = true;
    }
  }
}
