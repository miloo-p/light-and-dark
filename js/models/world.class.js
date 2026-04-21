class World {
  shadowCharacter = new ShadowCharacter();
  lightCharacter = new LightCharacter();
  enemies = [new EnemyStomp(), new EnemyPlant()];

  canvas;
  ctx;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.draw();
  }

  draw() {
    this.ctx.drawImage(
      this.shadowCharacter.img,
      this.shadowCharacter.x,
      this.shadowCharacter.y,
      this.shadowCharacter.width,
      this.shadowCharacter.height,
    );
    this.ctx.drawImage(
      this.enemies[0].img,
      this.enemies[0].x,
      this.enemies[0].y,
      this.enemies[0].width,
      this.enemies[0].height,
    );
    this.ctx.drawImage(
      this.enemies[1].img,
      this.enemies[1].x,
      this.enemies[1].y,
      this.enemies[1].width,
      this.enemies[1].height,
    );
    console.log("Die Welt wurde gezeichnet!");
  }
}
