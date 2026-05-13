/**
 * The central game engine and orchestrator.
 * Manages the game loop, rendering, entity management, collision detection, and level state.
 * @class
 */
class World {
  // ==========================================
  // 1. PROPERTIES & STATE
  // ==========================================

  /** @type {ShadowCharacter} The main player character. */
  shadowCharacter = new ShadowCharacter();

  /** @type {StatusBar} UI element displaying the player's health. */
  characterStatusBar = new StatusBar();

  /** @type {EnergyBar} UI element displaying the player's shadow energy. */
  characterEnergyStatusBar = new EnergyBar();

  /** @type {CoinBar} UI element displaying the collected coins. */
  characterCoinBar = new CoinBar();

  /** @type {BossStatusBar} UI element displaying the end boss's health. */
  bossStatusBar = new BossStatusBar();

  /** @type {ProjectileObject[]} Active projectiles fired by the player. */
  shadowProjectile = [];

  /** @type {MeleeSlashObject[]} Active melee attacks performed by the player. */
  meleeAttacks = [];

  /** @type {Object[]} Active projectiles fired by enemies. */
  enemyProjectiles = [];

  /** @type {boolean} Flag indicating whether the boss fight has started. */
  bossTriggered = false;

  /** @type {number} Timestamp of the player's last attack (projectile or melee). */
  lastAttackTime = 0;

  /** @type {number} Global cooldown for player attacks in milliseconds. */
  attackCooldown = 500;

  /** @type {Level} The current level instance containing all environment data and enemies. */
  level = level1;

  /** @type {boolean} Flag to pause game logic (e.g., during cutscenes). */
  isGamePaused = false;

  /** @type {number} Opacity value (0.0 to 1.0) for the screen-wide flash effect. */
  flashAlpha = 0;

  /** @type {HTMLCanvasElement} The HTML canvas element. */
  canvas;

  /** @type {CanvasRenderingContext2D} The 2D rendering context for the canvas. */
  ctx;

  /** @type {Keyboard} Reference to the global keyboard input manager. */
  keyboard;

  /** @type {number} The current x-translation of the game camera. */
  camera_x = 0;

  /** @type {number} Offset to keep the character centered in the camera view. */
  cameraOffset = 500;

  /** @type {number} ID for the main game interval to allow stopping it. */
  runIntervalId;

  /** @type {number} ID for the animation frame to allow stopping the render loop. */
  drawRequestId;

  // ==========================================
  // 2. SETUP & LIFECYCLE
  // ==========================================

  /**
   * Initializes the game world, binds the canvas context, and starts the game loops.
   * @param {HTMLCanvasElement} canvas - The canvas element to render on.
   * @param {Keyboard} keyboard - The global input tracker.
   */
  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.detectCollision();
    this.run();
  }

  /**
   * Links the world instance to the main character to allow the character to access global state.
   */
  setWorld() {
    this.shadowCharacter.world = this;
  }

  /**
   * The main logic loop running at roughly 60 FPS.
   * Handles collisions, entity cleanup, attacks, and triggers.
   */
  run() {
    this.runIntervalId = setInterval(() => {
      if (this.isGamePaused) return;

      this.detectCollision();
      this.cleanupEnemyProjectiles();
      this.shootProjectile();
      this.performMeleeAttack();
      this.checkBossTrigger();

      // Remove melee attacks that have finished their animation
      this.meleeAttacks = this.meleeAttacks.filter((slash) => !slash.isFinished);
    }, 1000 / 60);
  }

  /**
   * Completely stops the world's processing and rendering.
   * MUST be called before creating a new World instance to prevent memory leaks!
   */
  stop() {
    clearInterval(this.runIntervalId);
    cancelAnimationFrame(this.drawRequestId);
  }

  // ==========================================
  // 3. GAME LOGIC & ACTIONS
  // ==========================================

  /**
   * Spawns a shadow projectile if the player presses the spell key,
   * has enough energy, and the cooldown is over.
   */
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

  /**
   * Spawns a melee slash object if the player presses the attack key and the cooldown is over.
   */
  performMeleeAttack() {
    if (this.keyboard.keyAttack) {
      if (this.isCooldownOver()) {
        let slash = new MeleeSlashObject(this.shadowCharacter);
        this.meleeAttacks.push(slash);
        this.resetCooldown();
      }
    }
  }

  /**
   * Checks if enough time has passed since the last attack.
   * @returns {boolean} True if the player can attack again.
   */
  isCooldownOver() {
    let timePassed = new Date().getTime() - this.lastAttackTime;
    return timePassed > this.attackCooldown;
  }

  /**
   * Updates the attack timestamp to the current time, initiating a new cooldown phase.
   */
  resetCooldown() {
    this.lastAttackTime = new Date().getTime();
  }

  /**
   * Checks if the player has advanced far enough to trigger the boss fight.
   * Changes the background music and awakens the boss.
   */
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

  /**
   * Central orchestrator function that triggers all specific collision routines.
   */
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

  /**
   * Iterates through player projectiles and checks for collisions with enemies or level bounds.
   * Destroys the projectile upon impact or when flying out of bounds.
   */
  checkProjectileCollisions() {
    for (let pIndex = this.shadowProjectile.length - 1; pIndex >= 0; pIndex--) {
      let projectile = this.shadowProjectile[pIndex];

      let hitStomp = this.checkStompHit(projectile, null);
      let hitBoss = this.checkBossHit(projectile, null);
      let hitPlant = this.checkPlantHit(projectile, null);

      let projectileHit = hitStomp || hitBoss || hitPlant;

      // Remove projectile if it hit something, fell below the map, or flew too far
      if (projectileHit || projectile.y > 600 || projectile.x > this.shadowCharacter.x + 800) {
        projectile.destroy?.();
        this.shadowProjectile.splice(pIndex, 1);
      }
    }
  }

  /**
   * Iterates through active melee attacks and checks for collisions with enemies.
   */
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

  /**
   * Checks interactions between the player and Stomp enemies.
   * Handles jumping on enemies (Goomba-style) vs taking damage.
   */
  checkStompCollisions() {
    if (!this.level.enemyStomps) return;

    this.level.enemyStomps.forEach((stomp) => {
      if (this.shadowCharacter.isColliding(stomp) && !stomp.isDead()) {
        if (this.isJumpingOn(stomp)) {
          stomp.hit();
          this.shadowCharacter.speedY = 2; // Small bounce effect

          setTimeout(() => {
            let index = this.level.enemyStomps.indexOf(stomp);
            if (index > -1) {
              this.level.enemyStomps.splice(index, 1);
            }
          }, 1000);
        } else {
          this.handleCharacterTakingDamage();
        }
      }
    });
  }

  /**
   * Checks interactions between the player and Plant enemies.
   */
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

  /**
   * Checks interactions between the player and the End Boss.
   * Prevents taking damage while the boss is still in its entering animation.
   */
  checkBossCollisions() {
    if (!this.level.enemyEndboss) return;

    this.level.enemyEndboss.forEach((boss) => {
      let isBossEntering = boss.isTriggered && boss.x > boss.targetX;

      if (this.shadowCharacter.isColliding(boss) && !boss.isDead() && !isBossEntering) {
        this.handleCharacterTakingDamage();
      }
    });
  }

  /**
   * Checks if enemy projectiles have hit the player.
   */
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

  /**
   * Removes enemy projectiles that have flown out of the left side of the camera view.
   */
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

  /**
   * Checks if the player collects shadow energy bottles.
   * Updates energy points and the UI up to a maximum of 100.
   */
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

  /**
   * Checks if the player collects coins.
   * Updates coin count and the UI up to a maximum of 10.
   */
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

  /**
   * Helper to check if a specific attack hit a Stomp enemy.
   * @param {ProjectileObject} [projectile] - The projectile to check (optional).
   * @param {MeleeSlashObject} [meleeSlash] - The melee attack to check (optional).
   * @returns {boolean} True if a hit was registered.
   */
  checkStompHit(projectile, meleeSlash) {
    let hasHit = false;

    this.level.enemyStomps.forEach((stomp, index) => {
      let projectileHit = projectile && projectile.isColliding(stomp);
      let meleeHit = meleeSlash && !meleeSlash.hasDealtDamage && meleeSlash.isColliding(stomp);

      if ((projectileHit || meleeHit) && !stomp.isDead()) {
        if (meleeHit) {
          meleeSlash.hasDealtDamage = true;
        }
        stomp.hit();
        hasHit = true;

        setTimeout(() => {
          let index = this.level.enemyStomps.indexOf(stomp);
          if (index > -1) {
            this.level.enemyStomps.splice(index, 1);
          }
        }, 1000);
      }
    });
    return hasHit;
  }

  /**
   * Helper to check if a specific attack hit the Boss enemy.
   * @param {ProjectileObject} [projectile] - The projectile to check (optional).
   * @param {MeleeSlashObject} [meleeSlash] - The melee attack to check (optional).
   * @returns {boolean} True if a hit was registered.
   */
  checkBossHit(projectile, meleeSlash) {
    let hasHit = false;
    this.level.enemyEndboss.forEach((boss) => {
      let isBossEntering = boss.isTriggered && boss.x > boss.targetX;
      let projectileHit = projectile && projectile.isColliding(boss);
      let meleeHit = meleeSlash && !meleeSlash.hasDealtDamage && meleeSlash.isColliding(boss);

      if ((projectileHit || meleeHit) && !boss.isDead() && !isBossEntering) {
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

  /**
   * Helper to check if a specific attack hit a Plant enemy.
   * @param {ProjectileObject} [projectile] - The projectile to check (optional).
   * @param {MeleeSlashObject} [meleeSlash] - The melee attack to check (optional).
   * @returns {boolean} True if a hit was registered.
   */
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

  /**
   * Evaluates whether the player character is physically landing on top of an enemy.
   * @param {MovableObject} enemy - The enemy object to evaluate against.
   * @returns {boolean} True if the player is moving downwards and above the enemy's hitbox.
   */
  isJumpingOn(enemy) {
    let charBottom =
      this.shadowCharacter.y + this.shadowCharacter.height - this.shadowCharacter.hitboxOffset.bottom;
    let enemyTop = enemy.y + enemy.hitboxOffset.top;

    return this.shadowCharacter.speedY < 0 && charBottom < enemyTop + 50;
  }

  /**
   * Centralized method to apply damage to the player and update the health UI.
   */
  handleCharacterTakingDamage() {
    if (!this.shadowCharacter.isHurt()) {
      this.shadowCharacter.hit();
      this.characterStatusBar.setLifePercentage(this.shadowCharacter.healthPoints);
    }
  }

  // ==========================================
  // 7. RENDERING & DRAWING
  // ==========================================

  /**
   * The core rendering loop synchronized with the browser's refresh rate.
   * Clears the canvas, delegates drawing to world and screen spaces, and recursively requests the next frame.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawWorldSpace();
    this.drawScreenSpace();

    this.drawRequestId = requestAnimationFrame(() => this.draw());
  }

  /**
   * Renders all game entities that exist within the level geometry.
   * Applies camera translation (`camera_x`) to create a scrolling effect.
   */
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

  /**
   * Renders static HUD/UI elements overlaying the game world.
   * Unaffected by camera translation.
   */
  drawScreenSpace() {
    this.addToMap(this.characterStatusBar);
    this.addToMap(this.characterEnergyStatusBar);
    this.addToMap(this.characterCoinBar);

    if (this.bossTriggered) {
      this.addToMap(this.bossStatusBar);
    }
    this.executeLevelEndFLash();
  }

  /**
   * Utility to render an entire array of objects onto the canvas.
   * @param {MovableObject[]} objects - Array of entities to draw.
   */
  addObjectsToMap(objects) {
    if (!objects) return;
    objects.forEach((obj) => {
      this.addToMap(obj);
    });
  }

  /**
   * Handles the rendering of a single object.
   * Automatically flips the canvas context if the object is facing left.
   * @param {MovableObject} MovableObject - The object to draw.
   */
  addToMap(MovableObject) {
    if (MovableObject.changeDirection) {
      this.flipImage(MovableObject);
    }
    MovableObject.draw(this.ctx);
    if (MovableObject.changeDirection) {
      this.flipImageBack(MovableObject);
    }
  }

  /**
   * Flips the rendering context horizontally for an object facing left.
   * @param {MovableObject} MovableObject - The object causing the flip.
   */
  flipImage(MovableObject) {
    this.ctx.save();
    this.ctx.translate(MovableObject.width, 0);
    this.ctx.scale(-1, 1);
    MovableObject.x = MovableObject.x * -1;
  }

  /**
   * Restores the original rendering context after a flipped object was drawn.
   * @param {MovableObject} MovableObject - The object that was flipped.
   */
  flipImageBack(MovableObject) {
    this.ctx.restore();
    MovableObject.x = MovableObject.x * -1;
  }

  /**
   * Renders a fading white screen flash overlay, typically used for cinematic transitions.
   */
  executeLevelEndFLash() {
    if (this.flashAlpha > 0) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${this.flashAlpha})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.flashAlpha -= 0.02;

      if (this.flashAlpha < 0) {
        this.flashAlpha = 0;
      }
    }
  }

  // ==========================================
  // 8. CUTSCENE ORCHESTRATION
  // ==========================================

  /**
   * Orchestrates the cinematic sequence triggered upon defeating the end boss.
   * Acts as a timeline manager, calling specific events at specific times.
   */
  executeLevelEndCut() {
    this.startCutsceneLockdown();

    setTimeout(() => this.triggerWorldTransformation(), 1000);
    setTimeout(() => this.startAutomatedWalk(), 2000);
    setTimeout(() => this.showFinalScreen(), 10000);
  }

  /**
   * Step 1: Pauses gameplay, locks input, hides mobile controls, and switches to the end theme.
   */
  startCutsceneLockdown() {
    this.isGamePaused = true;
    this.keyboard.lockAndReset();

    if (typeof uiManager !== "undefined") {
      uiManager.hideMobileControls();
    }

    AudioManager.stopLayer("music_layer");
    AudioManager.playLayer("piano_theme", "music_layer");
  }

  /**
   * Step 2: Triggers the bright flash, swaps the background layers, and plays the transition sound.
   */
  triggerWorldTransformation() {
    this.flashAlpha = 1.0;
    this.level.backgroundObjectsRear = this.level.backgroundObjectsRearEndgame;
    this.level.backgroundObjectsFront = this.level.backgroundObjectsFrontEndgame;

    AudioManager.playSFX("transformation_woosh");
  }

  /**
   * Step 3: Forces the character to automatically walk to the left into the new environment.
   */
  startAutomatedWalk() {
    this.shadowCharacter.cameraOffset = 600;
    this.bossTriggered = false;
    this.keyboard.keyLeft = true;
  }

  /**
   * Step 4: Brings up the final end screen.
   */
  showFinalScreen() {
    if (typeof uiManager !== "undefined") {
      uiManager.showEndScreen();
    }
  }
}
