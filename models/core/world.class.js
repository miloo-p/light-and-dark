/**
 * The central game engine and orchestrator.
 * Manages the game loop, rendering, entity management, collision detection, and level state.
 * @class
 */
class World {
  // ==========================================
  // 1. PROPERTIES & STATE
  // ==========================================

  shadowCharacter = new ShadowCharacter();
  characterStatusBar = new StatusBar();
  characterEnergyStatusBar = new EnergyBar();
  characterCoinBar = new CoinBar();
  bossStatusBar = new BossStatusBar();

  shadowProjectile = [];
  meleeAttacks = [];
  enemyProjectiles = [];

  bossTriggered = false;
  lastAttackTime = 0;
  attackCooldown = 500;
  level = level1;
  isGamePaused = false;
  flashAlpha = 0;

  canvas;
  ctx;
  keyboard;

  camera_x = 0;
  cameraOffset = 500;

  /** @type {number} ID of the main logic interval (for cleanup). */
  runIntervalId;
  /** @type {number} ID of the current animation frame request (for cleanup). */
  drawRequestId;

  // ==========================================
  // 2. SETUP & LIFECYCLE
  // ==========================================

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;

    this.setWorld();
    this.draw(); // Startet den Render-Loop
    this.run(); // Startet den Logik-Loop
  }

  /** Links the world instance to the character. */
  setWorld() {
    this.shadowCharacter.world = this;
  }

  /**
   * The main logic loop running at roughly 60 FPS.
   * Fixed: Stores the interval ID to prevent memory leaks.
   */
  run() {
    this.runIntervalId = setInterval(() => {
      if (this.isGamePaused) return;

      this.detectCollision();
      this.cleanupEnemyProjectiles();
      this.shootProjectile();
      this.performMeleeAttack();
      this.checkBossTrigger();

      this.meleeAttacks = this.meleeAttacks.filter((slash) => !slash.isFinished);
    }, 1000 / 60);
  }

  /**
   * Cleans up all intervals and animation loops.
   * Call this before creating a new World instance!
   */
  clearWorld() {
    clearInterval(this.runIntervalId);
    cancelAnimationFrame(this.drawRequestId);
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
    if (this.keyboard.keyAttack && this.isCooldownOver()) {
      let slash = new MeleeSlashObject(this.shadowCharacter);
      this.meleeAttacks.push(slash);
      this.resetCooldown();
    }
  }

  isCooldownOver() {
    return new Date().getTime() - this.lastAttackTime > this.attackCooldown;
  }

  resetCooldown() {
    this.lastAttackTime = new Date().getTime();
  }

  checkBossTrigger() {
    if (this.shadowCharacter.x > 2222 && !this.bossTriggered) {
      this.bossTriggered = true;
      AudioManager.stopLayer("ambience_layer");
      AudioManager.stopLayer("music_layer");
      AudioManager.playLayer("fight_the_devil", "music_layer");
      this.level.enemyEndboss.forEach((boss) => (boss.isTriggered = true));
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

      if (
        hitStomp ||
        hitBoss ||
        hitPlant ||
        projectile.y > 600 ||
        projectile.x > this.shadowCharacter.x + 800
      ) {
        projectile.destroy?.();
        this.shadowProjectile.splice(pIndex, 1);
      }
    }
  }

  checkMeleeCollisions() {
    this.meleeAttacks.forEach((slash) => {
      this.checkStompHit(null, slash);
      this.checkBossHit(null, slash);
      this.checkPlantHit(null, slash);
    });
  }

  // ==========================================
  // 5. COLLISION HELPERS
  // ==========================================

  checkStompCollisions() {
    if (!this.level.enemyStomps) return;
    this.level.enemyStomps.forEach((stomp) => {
      if (this.shadowCharacter.isColliding(stomp) && !stomp.isDead()) {
        if (this.isJumpingOn(stomp)) {
          stomp.hit();
          this.shadowCharacter.speedY = 2;
          setTimeout(() => {
            let index = this.level.enemyStomps.indexOf(stomp);
            if (index > -1) this.level.enemyStomps.splice(index, 1);
          }, 1000);
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
            if (index > -1) this.level.enemyPlant.splice(index, 1);
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
      let isBossEntering = boss.isTriggered && boss.x > boss.targetX;
      if (this.shadowCharacter.isColliding(boss) && !boss.isDead() && !isBossEntering) {
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
      if (this.enemyProjectiles[i].x + this.enemyProjectiles[i].width < leftCameraEdge) {
        this.enemyProjectiles[i].destroy?.();
        this.enemyProjectiles.splice(i, 1);
      }
    }
  }

  checkItemCollisions() {
    this.level.shadowEnergy.forEach((bottle, index) => {
      if (this.shadowCharacter.isColliding(bottle)) {
        this.level.shadowEnergy.splice(index, 1);
        this.shadowCharacter.energyPoints = Math.min(this.shadowCharacter.energyPoints + 20, 100);
        this.characterEnergyStatusBar.setEnergyPercentage(this.shadowCharacter.energyPoints);
      }
    });
  }

  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.shadowCharacter.isColliding(coin)) {
        this.level.coins.splice(index, 1);
        this.shadowCharacter.collectedCoins = Math.min(this.shadowCharacter.collectedCoins + 1, 10);
        this.characterCoinBar.setCoins(this.shadowCharacter.collectedCoins);
      }
    });
  }

  // ==========================================
  // 6. ATTACK HELPERS
  // ==========================================

  checkStompHit(projectile, meleeSlash) {
    let hasHit = false;
    this.level.enemyStomps.forEach((stomp) => {
      let projectileHit = projectile && projectile.isColliding(stomp);
      let meleeHit = meleeSlash && !meleeSlash.hasDealtDamage && meleeSlash.isColliding(stomp);
      if ((projectileHit || meleeHit) && !stomp.isDead()) {
        if (meleeHit) meleeSlash.hasDealtDamage = true;
        stomp.hit();
        hasHit = true;
        setTimeout(() => {
          let idx = this.level.enemyStomps.indexOf(stomp);
          if (idx > -1) this.level.enemyStomps.splice(idx, 1);
        }, 1000);
      }
    });
    return hasHit;
  }

  checkBossHit(projectile, meleeSlash) {
    let hasHit = false;
    this.level.enemyEndboss.forEach((boss) => {
      let isBossEntering = boss.isTriggered && boss.x > boss.targetX;
      let projectileHit = projectile && projectile.isColliding(boss);
      let meleeHit = meleeSlash && !meleeSlash.hasDealtDamage && meleeSlash.isColliding(boss);
      if ((projectileHit || meleeHit) && !boss.isDead() && !isBossEntering) {
        if (meleeHit) meleeSlash.hasDealtDamage = true;
        boss.hit();
        if (boss.isDead()) this.executeLevelEndCut();
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
        if (meleeHit) meleeSlash.hasDealtDamage = true;
        plant.hit();
        hasHit = true;
        setTimeout(() => {
          let idx = this.level.enemyPlant.indexOf(plant);
          if (idx > -1) this.level.enemyPlant.splice(idx, 1);
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
    }
  }

  // ==========================================
  // 7. RENDERING
  // ==========================================

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawWorldSpace();
    this.drawScreenSpace();
    // Fixed: Store request ID for cleanup
    this.drawRequestId = requestAnimationFrame(() => this.draw());
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
    if (this.bossTriggered) this.addToMap(this.bossStatusBar);
    this.executeLevelEndFLash();
  }

  addObjectsToMap(objects) {
    if (objects) objects.forEach((obj) => this.addToMap(obj));
  }

  addToMap(mo) {
    if (mo.changeDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.changeDirection) this.flipImageBack(mo);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    this.ctx.restore();
    mo.x = mo.x * -1;
  }

  // ==========================================
  // 8. CINEMATICS
  // ==========================================

  executeLevelEndFLash() {
    if (this.flashAlpha > 0) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${this.flashAlpha})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.flashAlpha -= 0.02;
    }
  }

  executeLevelEndCut() {
    this.startCutsceneLockdown();
    setTimeout(() => this.triggerWorldTransformation(), 1000);
    setTimeout(() => this.startAutomatedWalk(), 2000);
    setTimeout(() => this.showFinalScreen(), 10000);
  }

  startCutsceneLockdown() {
    this.isGamePaused = true;
    this.keyboard.lockAndReset();
    if (typeof uiManager !== "undefined") uiManager.hideMobileControls();
    AudioManager.stopLayer("music_layer");
    AudioManager.playLayer("piano_theme", "music_layer");
  }

  triggerWorldTransformation() {
    this.flashAlpha = 1.0;
    this.level.backgroundObjectsRear = this.level.backgroundObjectsRearEndgame;
    this.level.backgroundObjectsFront = this.level.backgroundObjectsFrontEndgame;
    AudioManager.playSFX("transformation_woosh");
  }

  startAutomatedWalk() {
    this.shadowCharacter.cameraOffset = 600;
    this.bossTriggered = false;
    this.keyboard.keyLeft = true;
  }

  showFinalScreen() {
    if (typeof uiManager !== "undefined") uiManager.showEndScreen();
  }
}
