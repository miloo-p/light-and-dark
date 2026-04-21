class World {
  shadowCharacter = new ShadowCharacter();
  lightCharacter = new LightCharacter();
  enemyStomps = [new EnemyStomp(), new EnemyStomp(), new EnemyStomp()];

  canvas;
  ctx;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.addToMap(this.shadowCharacter);

    this.addObjectsToMap(this.enemyStomps);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }
  addObjectsToMap(objects) {
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }
  addToMap(MovableObject) {
    this.ctx.drawImage(
      MovableObject.img,
      MovableObject.x,
      MovableObject.y,
      MovableObject.width,
      MovableObject.height,
    );
  }
}
