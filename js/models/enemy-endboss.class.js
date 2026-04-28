class EnemyEndboss extends MovableObject {
  speed = 0.15 + Math.random() * 0.25;

  imagesIdle = [`img/enemies/enemy_boss/1_walk/1_w.png`];

  imagesWalk = [];

  imagesAttack = [];

  imagesHurt = [];

  imagesDead = [];

  currentImage = 0;
  constructor() {
    super().loadImage(`img/enemies/enemy_boss/1_walk/1_w.png`);

    this.x = 2400;
    this.y = -25;
    this.width = 547;
    this.height = 500;

    this.loadAnimationImages(this.imagesIdle);
    this.animate();
  }

  animate() {
    setInterval(() => {
      let i = this.currentImage % this.imagesIdle.length;
      let path = this.imagesIdle[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 250);
  }
}
