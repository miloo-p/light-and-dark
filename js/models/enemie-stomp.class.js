class EnemyStomp extends MovableObject {
  speed = 0.15 + Math.random() * 0.25;

  hitboxOffset = {
    top: 0,
    bottom: 0,
    left: 15,
    right: 20,
  };

  imagesIdle = [
    `img/enemies/enemie_stomp/idle/1_i.png`,
    `img/enemies/enemie_stomp/idle/2_i.png`,
    `img/enemies/enemie_stomp/idle/3_i.png`,
    `img/enemies/enemie_stomp/idle/4_i.png`,
    `img/enemies/enemie_stomp/idle/5_i.png`,
    `img/enemies/enemie_stomp/idle/6_i.png`,
    `img/enemies/enemie_stomp/idle/7_i.png`,
  ];

  imagesWalk = [
    `img/enemies/enemie_stomp/walking/1_w.png`,
    `img/enemies/enemie_stomp/walking/2_w.png`,
    `img/enemies/enemie_stomp/walking/3_w.png`,
    `img/enemies/enemie_stomp/walking/4_w.png`,
    `img/enemies/enemie_stomp/walking/5_w.png`,
  ];

  imagesAttack = [
    `img/enemies/enemie_stomp/attack/1_a.png`,
    `img/enemies/enemie_stomp/attack/2_a.png`,
    `img/enemies/enemie_stomp/attack/3_a.png`,
    `img/enemies/enemie_stomp/attack/4_a.png`,
    `img/enemies/enemie_stomp/attack/5_a.png`,
  ];

  imagesHurt = [];

  imagesDead = [
    `img/characters/shadow/05_dead/d1-1.png`,
    `img/characters/shadow/05_dead/d1-2.png`,
    `img/characters/shadow/05_dead/d1-3.png`,
    `img/characters/shadow/05_dead/d1-4.png`,
    `img/characters/shadow/05_dead/d1-5.png`,
    `img/characters/shadow/05_dead/d1-6.png`,
  ];

  currentImage = 0;
  constructor() {
    super().loadImage(`img/enemies/enemie_stomp/idle/1_i.png`);

    this.x = 250 + Math.random() * 500;
    this.y = 300;
    this.width = 71;
    this.height = 70;

    this.loadAnimationImages(this.imagesWalk);
    this.animate();
    this.moveLeft();
  }

  animate() {
    setInterval(() => {
      let i = this.currentImage % this.imagesWalk.length;
      let path = this.imagesWalk[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 250);
  }
}
