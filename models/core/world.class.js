class World {
  // ==========================================
  // 1. PROPERTIES & STATE
  // ==========================================

  shadowCharacter = new ShadowCharacter();
  characterStatusBar = new StatusBar();
  characterEnergyStatusBar = new EnergyBar();
  characterCoinBar = new CoinBar();
  bossStatusBar = new BossStatusBar();
  lightCharacter = new LightCharacter();

  shadowProjectile = [];
  meleeAttacks = [];
  enemyProjectiles = [];

  bossTriggered = false;
  lastAttackTime = 0;
  attackCooldown = 500;

  level = level1;
  isGamePaused = false;

  canvas;
  ctx;
  keyboard;
  world;
  camera_x = 0;

  // ==========================================
  // 2. SETUP & LIFECYCLE
  // ==========================================

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.detectCollision();
    this.run();
  }

  setWorld() {
    this.shadowCharacter.world = this;
  }

  run() {
    setInterval(() => {
      if (this.isGamePaused) return;

      this.detectCollision();
      this.cleanupEnemyProjectiles();
      this.shootProjectile();
      this.performMeleeAttack();
      this.checkBossTrigger();

      this.meleeAttacks = this.meleeAttacks.filter((slash) => !slash.isFinished);
    }, 1000 / 60);
  }

  // ==========================================
  // 3. GAME LOGIC & ACTIONS
  // ==========================================

  shootProjectile() {
    if (this.keyboard.keySpell) {
      if (this.isCooldownOver() && this.shadowCharacter.energyPoints >= 20) {
        let isFacingLeft = this.shadowCharacter.changeDirection;
        let singleProjectile = new ProjectileObject(
          this.shadowCharacter.x,
          this.shadowCharacter.y,
          isFacingLeft,
        );

        this.shadowProjectile.push(singleProjectile);

        this.resetCooldown();

        this.shadowCharacter.energyPoints -= 20;
        this.characterEnergyStatusBar.setEnergyPercentage(this.shadowCharacter.energyPoints);
      }
    }
  }

  performMeleeAttack() {
    if (this.keyboard.keyAttack) {
      if (this.isCooldownOver()) {
        let slash = new MeleeSlashObject(this.shadowCharacter);
        this.meleeAttacks.push(slash);

        this.resetCooldown();
      }
    }
  }

  isCooldownOver() {
    let timePassed = new Date().getTime() - this.lastAttackTime;
    return timePassed > this.attackCooldown;
  }

  resetCooldown() {
    this.lastAttackTime = new Date().getTime();
  }

  checkBossTrigger() {
    if (this.shadowCharacter.x > 2222 && !this.bossTriggered) {
      this.bossTriggered = true;
      this.level.level_start_x = 2222;

      this.level.enemyEndboss.forEach((boss) => (boss.isTriggered = true));
      console.log("Boss Kampf gestartet!");
    }
  }

  // ==========================================
  // 4. COLLISION ORCHESTRATORS
  // ==========================================

  detectCollision() {
    this.checkStompCollisions();
    this.checkPlantCollisions();
    this.checkItemCollisions();
    this.checkBossCollisions();
    this.checkCoinCollisions();
    this.checkProjectileCollisions();
    this.checkMeleeCollisions();
    this.checkEnemyProjectileCollisions();
  }

  checkProjectileCollisions() {
    for (let pIndex = this.shadowProjectile.length - 1; pIndex >= 0; pIndex--) {
      let projectile = this.shadowProjectile[pIndex];

      let hitStomp = this.checkStompHit(projectile, null);
      let hitBoss = this.checkBossHit(projectile, null);
      let hitPlant = this.checkPlantHit(projectile, null);

      let projectileHit = hitStomp || hitBoss || hitPlant;

      if (projectileHit || projectile.y > 600 || projectile.x > this.shadowCharacter.x + 800) {
        projectile.destroy?.();
        this.shadowProjectile.splice(pIndex, 1);
      }
    }
  }

  checkMeleeCollisions() {
    for (let mIndex = this.meleeAttacks.length - 1; mIndex >= 0; mIndex--) {
      let slash = this.meleeAttacks[mIndex];

      this.checkStompHit(null, slash);
      this.checkBossHit(null, slash);
      this.checkPlantHit(null, slash);
    }
  }

  // ==========================================
  // 5. COLLISION HELPERS (CHARACTER)
  // ==========================================

  checkStompCollisions() {
    this.level.enemyStomps.forEach((enemy, index) => {
      if (this.shadowCharacter.isColliding(enemy)) {
        if (this.isJumpingOn(enemy)) {
          this.level.enemyStomps.splice(index, 1);
          this.shadowCharacter.speedY = 2;
        } else {
          this.handleCharacterTakingDamage();
        }
      }
    });
  }

  checkPlantCollisions() {
    if (!this.level.enemyPlant) return;

    this.level.enemyPlant.forEach((plant) => {
      if (this.shadowCharacter.isColliding(plant) && !plant.isDead()) {
        if (this.isJumpingOn(plant)) {
          plant.hit();
          this.shadowCharacter.speedY = 2;

          setTimeout(() => {
            let index = this.level.enemyPlant.indexOf(plant);
            if (index > -1) {
              this.level.enemyPlant.splice(index, 1);
            }
          }, 1000);
        } else {
          this.handleCharacterTakingDamage();
        }
      }
    });
  }

  checkBossCollisions() {
    if (!this.level.enemyEndboss) return;

    this.level.enemyEndboss.forEach((boss) => {
      if (this.shadowCharacter.isColliding(boss) && !boss.isDead()) {
        this.handleCharacterTakingDamage();
      }
    });
  }

  checkEnemyProjectileCollisions() {
    this.enemyProjectiles.forEach((projectile, index) => {
      if (this.shadowCharacter.isColliding(projectile)) {
        if (!this.shadowCharacter.isHurt()) {
          this.shadowCharacter.hit();
          this.characterStatusBar.setLifePercentage(this.shadowCharacter.healthPoints);
        }
        projectile.destroy?.();
        this.enemyProjectiles.splice(index, 1);
      }
    });
  }

  cleanupEnemyProjectiles() {
    let leftCameraEdge = -this.camera_x;

    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      let projectile = this.enemyProjectiles[i];
      let projectileRightSide = projectile.x + projectile.width;

      if (projectileRightSide < leftCameraEdge) {
        projectile.destroy?.();
        this.enemyProjectiles.splice(i, 1);
      }
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

  // ==========================================
  // 6. COLLISION HELPERS (PROJECTILES & SHARED)
  // ==========================================

  checkStompHit(projectile, meleeSlash) {
    let hasHit = false;

    this.level.enemyStomps.forEach((enemy, index) => {
      let projectileHit = projectile && projectile.isColliding(enemy);
      let meleeHit = meleeSlash && !meleeSlash.hasDealtDamage && meleeSlash.isColliding(enemy);

      if (projectileHit || meleeHit) {
        if (meleeHit) {
          meleeSlash.hasDealtDamage = true;
        }
        this.level.enemyStomps.splice(index, 1);
        hasHit = true;
      }
    });
    return hasHit;
  }

  checkBossHit(projectile, meleeSlash) {
    let hasHit = false;
    this.level.enemyEndboss.forEach((boss) => {
      let projectileHit = projectile && projectile.isColliding(boss);
      let meleeHit = meleeSlash && !meleeSlash.hasDealtDamage && meleeSlash.isColliding(boss);

      if ((projectileHit || meleeHit) && !boss.isDead()) {
        if (meleeHit) {
          meleeSlash.hasDealtDamage = true;
        }
        boss.hit();

        if (boss.isDead()) {
          this.executeLevelEndCut();
        }

        this.bossStatusBar.setPercentage(boss.healthPoints);
        hasHit = true;
      }
    });
    return hasHit;
  }

  checkPlantHit(projectile, meleeSlash) {
    let hasHit = false;
    this.level.enemyPlant.forEach((plant) => {
      let projectileHit = projectile && projectile.isColliding(plant);
      let meleeHit = meleeSlash && !meleeSlash.hasDealtDamage && meleeSlash.isColliding(plant);

      if ((projectileHit || meleeHit) && !plant.isDead()) {
        if (meleeHit) {
          meleeSlash.hasDealtDamage = true;
        }
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

  isJumpingOn(enemy) {
    let charBottom =
      this.shadowCharacter.y + this.shadowCharacter.height - this.shadowCharacter.hitboxOffset.bottom;
    let enemyTop = enemy.y + enemy.hitboxOffset.top;

    return this.shadowCharacter.speedY < 0 && charBottom < enemyTop + 50;
  }

  handleCharacterTakingDamage() {
    if (!this.shadowCharacter.isHurt()) {
      this.shadowCharacter.hit();
      this.characterStatusBar.setLifePercentage(this.shadowCharacter.healthPoints);
      console.log("Charakter getroffen! Leben:", this.shadowCharacter.healthPoints);
    }
  }

  // ==========================================
  // 7. RENDERING & DRAWING
  // ==========================================

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawWorldSpace();
    this.drawScreenSpace();

    requestAnimationFrame(() => this.draw());
  }

  drawWorldSpace() {
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjectsRear);

    this.addToMap(this.shadowCharacter);

    this.addObjectsToMap(this.level.enemyStomps);
    this.addObjectsToMap(this.level.enemyPlant);
    this.addObjectsToMap(this.level.enemyEndboss);
    this.addObjectsToMap(this.shadowProjectile);
    this.addObjectsToMap(this.enemyProjectiles);
    this.addObjectsToMap(this.meleeAttacks);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.shadowEnergy);

    this.addObjectsToMap(this.level.backgroundObjectsFront);

    this.ctx.translate(-this.camera_x, 0);
  }

  drawScreenSpace() {
    this.addToMap(this.characterStatusBar);
    this.addToMap(this.characterEnergyStatusBar);
    this.addToMap(this.characterCoinBar);

    if (this.bossTriggered) {
      this.addToMap(this.bossStatusBar);
    }
  }

  addObjectsToMap(objects) {
    if (!objects) return;

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

  executeLevelEndCut() {
    this.isGamePaused = true;
    this.keyboard.keyLeft = false;
    this.keyboard.keyRight = false;
    this.keyboard.keyJump = false;
    this.keyboard.keySpell = false;
    this.keyboard.keyAttack = false;

    this.level.backgroundObjectsRear = this.level.backgroundObjectsRearEndgame;
    this.level.backgroundObjectsFront = this.level.backgroundObjectsFrontEndgame;

    console.log("Boss is dead! Starting 5-second cinematic delay...");

    setTimeout(() => {
      MovableObject.stopAllIntervals();
      console.log("Level finished: Environment transformed and time stopped!");
    }, 5000);
  }
}
