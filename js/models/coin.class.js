class Coin extends MovableObject {
  height = 80;
  width = 80;

  imagesAnimation = ["img/coin/coin_1.png", "img/coin/coin_2.png"];

  constructor(x, y) {
    super().loadimage("img/coin/coin_1.png");
    this.loadAimationImages(this.imagesAnimation);
    this.x = x;
    this.y = y;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.displayAnimation(this.imagesAnimation);
    }, 300);
  }
}
