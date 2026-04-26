class ShadowCharacter extends MovableObject {
  speed = 3;
  particles = [];

  hitboxOffset = {
    top: 20,
    bottom: 5,
    left: 60,
    right: 40,
  };

  healthPoints = 25;

  imagesIdle = [
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

  imagesWalk = [
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

  imagesJump = [
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

  imagesHurt = [
    `img/characters/shadow/04_hurt/h1-1.png`,
    `img/characters/shadow/04_hurt/h1-2.png`,
    `img/characters/shadow/04_hurt/h1-3.png`,
    `img/characters/shadow/04_hurt/h1-4.png`,
    `img/characters/shadow/04_hurt/h1-5.png`,
  ];

  imagesDead = [
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
  ];

  constructor() {
    super().loadimage(`img/characters/shadow/01_idle/i1-1.png`);

    this.x = 20;
    this.y = 240;
    this.width = 138;
    this.height = 150;

    this.fastFallEnabled = true;

    this.loadAimationImages(this.imagesWalk);
    this.loadAimationImages(this.imagesIdle);
    this.loadAimationImages(this.imagesJump);
    this.loadAimationImages(this.imagesHurt);
    this.loadAimationImages(this.imagesDead);
    this.cameraBehavior();
    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.isDead()) {
        this.displayAnimation(this.imagesDead);
      } else if (this.isHurt()) {
        this.displayAnimation(this.imagesHurt);
      } else if (this.isAboveGround()) {
        this.displayAnimation(this.imagesJump);
      } else {
        if (this.world.keyboard.keyRight || this.world.keyboard.keyLeft) {
          this.displayAnimation(this.imagesWalk);
        }
      }
      if (this.world.keyboard.keyJump && !this.isAboveGround() && !this.isDead()) {
        this.jump();
      }
    }, 1000 / 8);
  }

  handleParticles(ctx) {
    if (Math.random() < 0.05) {
      let centerX = this.x + this.width / 2;
      let centerY = this.y + this.height / 2 + 20;
      this.particles.push(new Particle(centerX, centerY));
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.update();

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      } else {
        p.draw(ctx);
      }
    }
  }

  jump() {
    this.speedY = 15;
  }
}
