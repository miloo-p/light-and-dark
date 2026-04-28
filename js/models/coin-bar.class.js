class CoinBar extends DrawableObject {
  collectedCoins = 0;

  constructor() {
    super();
    this.loadImage("img/coin/coin_1.png");
    this.x = 130;
    this.y = -5;
    this.width = 60;
    this.height = 60;
  }

  setCoins(coins) {
    this.collectedCoins = coins;
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`${this.collectedCoins} / 10`, this.x + 50, this.y + 34);
  }
}
