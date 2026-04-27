class World {
  shadowCharacter = new ShadowCharacter();
  characterStatusBar = new StatusBar();
  characterEnergyStatusBar = new EnergyBar();
  lightCharacter = new LightCharacter();
  shadowProjectile = [];

  lastProjectileFired = 0;

  level = level1;

  canvas;
  ctx;
  keyboard;
  world;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.detectCollision();
    this.run();
  }

  run() {
    setInterval(() => {
      this.detectCollision();
      this.shootProjectile();
      this.checkItemCollisions();
    }, 200);
  }

  shootProjectile() {
    if (this.keyboard.keyAttack) {
      let timePassed = new Date().getTime() - this.lastProjectileFired;

      if (timePassed > 500 && this.shadowCharacter.energyPoints >= 20) {
        let singleProjectile = new ProjectileObject(this.shadowCharacter.x + 80, this.shadowCharacter.y);
        this.shadowProjectile.push(singleProjectile);

        this.lastProjectileFired = new Date().getTime();

        this.shadowCharacter.energyPoints -= 20;
        this.characterEnergyStatusBar.setEnergyPercentage(this.shadowCharacter.energyPoints);
      }
    }
  }

  detectCollision() {
    this.level.enemyStomps.forEach((enemy) => {
      if (this.shadowCharacter.isColliding(enemy)) this.shadowCharacter.hit();
      this.characterStatusBar.setLifePercentage(this.shadowCharacter.healthPoints);
      console.log(this.shadowCharacter.healthPoints);
    });
  }

  checkItemCollisions() {
    this.level.shadowEnergy.forEach((bottle, index) => {
      if (this.shadowCharacter.isColliding(bottle)) {
        this.level.shadowEnergy.splice(index, 1);

        this.shadowCharacter.energyPoints += 20;
        if (this.shadowCharacter.energyPoints > 100) {
          this.shadowCharacter.energyPoints = 100;
        }

        this.characterEnergyStatusBar.setEnergyPercentage(this.shadowCharacter.energyPoints);
      }
    });
  }

  setWorld() {
    this.shadowCharacter.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // --- WORLD SPACE BEGINNT ---
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroudObjectsRear);

    this.shadowCharacter.handleParticles(
      this.ctx,
      this.shadowCharacter.width / 2,
      this.shadowCharacter.height / 2 + 20,
      0.05,
    );
    this.addToMap(this.shadowCharacter);

    this.addObjectsToMap(this.level.enemyStomps);
    this.addObjectsToMap(this.level.enemyEndboss);
    this.addObjectsToMap(this.shadowProjectile);

    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.shadowEnergy);

    this.addObjectsToMap(this.level.backgroudObjectsFront);
    this.ctx.translate(-this.camera_x, 0);
    // --- WORLD SPACE ENDET ---
    // --- SCREEN SPACE / UI BEGINNT ---
    this.addToMap(this.characterStatusBar);
    this.addToMap(this.characterEnergyStatusBar);
    // --- SCREEN SPACE / UI ENDET ---

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
      this.flipImage(MovableObject);
    }
    MovableObject.drawFrame(this.ctx);
    MovableObject.draw(this.ctx);
    if (MovableObject.changeDirection) {
      this.flipImageBack(MovableObject);
    }
  }

  flipImage(MovableObject) {
    this.ctx.save();
    this.ctx.translate(MovableObject.width, 0);
    this.ctx.scale(-1, 1);
    MovableObject.x = MovableObject.x * -1;
  }

  flipImageBack(MovableObject) {
    this.ctx.restore();
    MovableObject.x = MovableObject.x * -1;
  }
}
