class EnemyEndboss extends MovableObject {
  speed = 0.15 + Math.random() * 0.25;

  imagesIdle = [`img/characters/light/01_boom/light-b1-7.png`];

  imagesWalk = [];

  imagesAttack = [];

  imagesHurt = [];

  imagesDead = [];

  currentImage = 0;
  constructor() {
    super().loadimage(`img/characters/light/01_boom/light-b1-7.png`);

    this.x = 2400;
    this.y = 0;
    this.width = 500;
    this.height = 500;

    this.loadAimationImages(this.imagesIdle);
    this.animate();
  }

  animate() {
    setInterval(() => {
      let i = this.currentImage % this.imagesIdle.length;
      let path = this.imagesIdle[i];
      this.img = this.imageChache[path];
      this.currentImage++;
    }, 250);
  }
}
