class ShadowCharacter extends MovableObject {
  speed = 3;
  particles = [];

  hitboxOffset = {
    top: 20,
    bottom: 5,
    left: 60,
    right: 40,
  };

  healthPoints = 100;
  energyPoints = 40;
  collectedCoins = 0;

  isWalkingSoundPlaying = false;
  gameOverProcessed = false;

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

  static imagesHurt = [
    `img/characters/shadow/04_hurt/h1-1.png`,
    `img/characters/shadow/04_hurt/h1-2.png`,
    `img/characters/shadow/04_hurt/h1-3.png`,
    `img/characters/shadow/04_hurt/h1-4.png`,
    `img/characters/shadow/04_hurt/h1-5.png`,
  ];

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

  draw(ctx) {
    this.handleParticles(ctx);
    super.draw(ctx);
  }

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

  jump() {
    this.speedY = 15;
  }

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

  playWalkingSound() {
    if (!this.isWalkingSoundPlaying) {
      AudioManager.playLayer("walking_forest", "player_walk_layer");
      AudioManager.playLayer("whispering_spells", "player_walk_layer-2");
      this.isWalkingSoundPlaying = true;
    }
  }

  stopWalkingSound() {
    if (this.isWalkingSoundPlaying) {
      AudioManager.stopLayer("player_walk_layer");
      AudioManager.stopLayer("player_walk_layer-2");
      this.isWalkingSoundPlaying = false;
    }
  }
}
