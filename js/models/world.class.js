class World {
  shadowCharacter = new ShadowCharacter();
  characterStatusBar = new StatusBar();
  characterEnergyStatusBar = new EnergyBar();
  characterCoinBar = new CoinBar();
  bossStatusBar = new BossStatusBar();
  lightCharacter = new LightCharacter();
  shadowProjectile = [];
  enemyProjectiles = [];
  bossTriggered = false;
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
      this.checkCoinCollisions();
      this.checkProjectileCollisions();
      this.checkBossTrigger();
      this.checkEnemyProjectileCollisions();
    }, 1000 / 60);
  }

  checkEnemyProjectileCollisions() {
    this.enemyProjectiles.forEach((projectile, index) => {
      if (this.shadowCharacter.isColliding(projectile)) {
        if (!this.shadowCharacter.isHurt()) {
          this.shadowCharacter.hit();
          this.characterStatusBar.setLifePercentage(this.shadowCharacter.healthPoints);
        }
        this.enemyProjectiles.splice(index, 1);
      }
    });
  }

  checkBossTrigger() {
    if (this.shadowCharacter.x > 2222 && !this.bossTriggered) {
      this.bossTriggered = true;
      this.level.level_start_x = 2222;

      this.level.enemyEndboss.forEach((boss) => (boss.isTriggered = true));
      console.log("Boss Kampf gestartet!");
    }
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

  checkProjectileCollisions() {
    for (let pIndex = this.shadowProjectile.length - 1; pIndex >= 0; pIndex--) {
      let projectile = this.shadowProjectile[pIndex];

      let hitStomp = this.checkStompHit(projectile);
      let hitBoss = this.checkBossHit(projectile);
      let hitPlant = this.checkPlantHit(projectile);

      let projectileHit = hitStomp || hitBoss || hitPlant;

      if (projectileHit || projectile.y > 600 || projectile.x > this.shadowCharacter.x + 800) {
        this.shadowProjectile.splice(pIndex, 1);
      }
    }
  }

  checkStompHit(projectile) {
    let hasHit = false;
    this.level.enemyStomps.forEach((enemy, index) => {
      if (projectile.isColliding(enemy)) {
        this.level.enemyStomps.splice(index, 1);
        hasHit = true;
      }
    });
    return hasHit;
  }

  checkBossHit(projectile) {
    let hasHit = false;
    this.level.enemyEndboss.forEach((boss) => {
      if (projectile.isColliding(boss) && !boss.isDead()) {
        boss.hit();

        if (!this.bossTriggered) {
          this.bossTriggered = true;
          boss.isTriggered = true;
          console.log("Boss Kampf durch Fernangriff gestartet!");
        }

        this.bossStatusBar.setPercentage(boss.healthPoints);
        console.log("BOOOOM! Treffer! Boss HP:", boss.healthPoints);
        hasHit = true;
      }
    });
    return hasHit;
  }

  checkPlantHit(projectile) {
    let hasHit = false;
    this.level.enemyPlant.forEach((plant) => {
      if (projectile.isColliding(plant) && !plant.isDead()) {
        plant.hit();
        hasHit = true;

        setTimeout(() => {
          let index = this.level.enemyPlant.indexOf(plant);
          if (index > -1) {
            this.level.enemyPlant.splice(index, 1);
          }
        }, 1000);
      }
    });
    return hasHit;
  }

  detectCollision() {
    this.level.enemyStomps.forEach((enemy, index) => {
      if (this.shadowCharacter.isColliding(enemy)) {
        let charBottom =
          this.shadowCharacter.y + this.shadowCharacter.height - this.shadowCharacter.hitboxOffset.bottom;
        let enemyTop = enemy.y + enemy.hitboxOffset.top;

        if (this.shadowCharacter.speedY < 0 && charBottom < enemyTop + 50) {
          this.level.enemyStomps.splice(index, 1);
          this.shadowCharacter.speedY = 2;
        } else {
          if (!this.shadowCharacter.isHurt()) {
            this.shadowCharacter.hit();
            this.characterStatusBar.setLifePercentage(this.shadowCharacter.healthPoints);
            console.log("Treffer von Stomp! Leben:", this.shadowCharacter.healthPoints);
          }
        }
      }
    });

    if (this.level.enemyPlant) {
      this.level.enemyPlant.forEach((plant) => {
        if (this.shadowCharacter.isColliding(plant) && !plant.isDead()) {
          let charBottom =
            this.shadowCharacter.y + this.shadowCharacter.height - this.shadowCharacter.hitboxOffset.bottom;
          let plantTop = plant.y + plant.hitboxOffset.top;

          if (this.shadowCharacter.speedY < 0 && charBottom < plantTop + 50) {
            plant.hit();
            this.shadowCharacter.speedY = 2;

            setTimeout(() => {
              let index = this.level.enemyPlant.indexOf(plant);
              if (index > -1) {
                this.level.enemyPlant.splice(index, 1);
              }
            }, 1000);
          } else {
            if (!this.shadowCharacter.isHurt()) {
              this.shadowCharacter.hit();
              this.characterStatusBar.setLifePercentage(this.shadowCharacter.healthPoints);
              console.log("Pflanze berührt! Leben:", this.shadowCharacter.healthPoints);
            }
          }
        }
      });
    }
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

  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.shadowCharacter.isColliding(coin)) {
        this.level.coins.splice(index, 1);

        this.shadowCharacter.collectedCoins += 1;

        if (this.shadowCharacter.collectedCoins > 10) {
          this.shadowCharacter.collectedCoins = 10;
        }

        this.characterCoinBar.setCoins(this.shadowCharacter.collectedCoins);
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
    this.addObjectsToMap(this.level.backgroundObjectsRear);

    this.shadowCharacter.handleParticles(
      this.ctx,
      this.shadowCharacter.width / 2,
      this.shadowCharacter.height / 2 + 20,
      0.05,
    );
    this.addToMap(this.shadowCharacter);

    this.addObjectsToMap(this.level.enemyStomps);
    this.addObjectsToMap(this.level.enemyPlant);
    this.addObjectsToMap(this.level.enemyEndboss);
    this.addObjectsToMap(this.shadowProjectile);
    this.addObjectsToMap(this.enemyProjectiles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.shadowEnergy);

    this.addObjectsToMap(this.level.backgroundObjectsFront);
    this.ctx.translate(-this.camera_x, 0);
    // --- WORLD SPACE ENDET ---
    // --- SCREEN SPACE / UI BEGINNT ---
    this.addToMap(this.characterStatusBar);
    this.addToMap(this.characterEnergyStatusBar);
    this.addToMap(this.characterCoinBar);
    if (this.bossTriggered) {
      this.addToMap(this.bossStatusBar);
    }
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
