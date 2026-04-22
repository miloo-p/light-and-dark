class World {
  shadowCharacter = new ShadowCharacter();
  lightCharacter = new LightCharacter();
  enemyStomps = [new EnemyStomp(), new EnemyStomp(), new EnemyStomp()];
  backgroudObjectsRear = [
    new BackgroundObject("img/background/dead/bg_d_1.png", 0, 0),
    new BackgroundObject("img/background/dead/bg_d_2.png", 0, 0),
    new BackgroundObject("img/background/dead/bg_d_3.png", 0, 0),
    new BackgroundObject("img/background/dead/bg_d_4.png", 0, 0),
  ];

  backgroudObjectsFront = [
    new BackgroundObject("img/background/dead/bg_d_5.png", 0, 0),
    new BackgroundObject("img/background/dead/bg_d_6.png", 0, 0),
  ];

  canvas;
  ctx;
  keyboard;
  world;

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.shadowCharacter.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.addObjectsToMap(this.backgroudObjectsRear);

    this.shadowCharacter.handleParticles(this.ctx);
    this.addToMap(this.shadowCharacter);

    this.addObjectsToMap(this.enemyStomps);

    this.addObjectsToMap(this.backgroudObjectsFront);

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
    if (MovableObject.changeDirection) {
      this.ctx.save();
      this.ctx.translate(MovableObject.width, 0);
      this.ctx.scale(-1, 1);
      MovableObject.x = MovableObject.x * -1;
    }
    this.ctx.drawImage(
      MovableObject.img,
      MovableObject.x,
      MovableObject.y,
      MovableObject.width,
      MovableObject.height,
    );
    if (MovableObject.changeDirection) {
      this.ctx.restore();
      MovableObject.x = MovableObject.x * -1;
    }
  }
}
