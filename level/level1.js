/**
 * The global instance for the first level of the game.
 * @type {Level}
 */
let level1;

/**
 * Initializes the first level by instantiating the Level class.
 * This function serves as the level designer, where all background layers,
 * enemies, and collectables are manually placed at specific coordinates.
 * * It sets up:
 * - Tiled background layers with parallax potential (standard and endgame/vibrant versions).
 * - Enemy placements (Stomps and Plants).
 * - The Endboss position.
 * - Collectables (Coins and Shadow Energy).
 */
function initLevel() {
  level1 = new Level(
    // 1. EnemyStomps: Basic ground enemies placed at intervals
    [
      new EnemyStomp(500),
      new EnemyStomp(500),
      new EnemyStomp(1000),
      new EnemyStomp(1000),
      new EnemyStomp(1500),
      new EnemyStomp(1500),
      new EnemyStomp(2100),
    ],

    // 2. backgroundObjectsRear: Distant background layers (Dead Forest)
    [
      new BackgroundObject("img/background/dead/bg_d_1.png", -1139, 0),
      new BackgroundObject("img/background/dead/bg_d_2.png", -1139, 0),
      new BackgroundObject("img/background/dead/bg_d_3.png", -1139, 0),
      new BackgroundObject("img/background/dead/bg_d_4.png", -1139, 0),

      new BackgroundObject("img/background/dead/bg_d_1.png", 0, 0),
      new BackgroundObject("img/background/dead/bg_d_2.png", 0, 0),
      new BackgroundObject("img/background/dead/bg_d_3.png", 0, 0),
      new BackgroundObject("img/background/dead/bg_d_4.png", 0, 0),

      new BackgroundObject("img/background/dead/bg_d_1.png", 1139, 0),
      new BackgroundObject("img/background/dead/bg_d_2.png", 1139, 0),
      new BackgroundObject("img/background/dead/bg_d_3.png", 1139, 0),
      new BackgroundObject("img/background/dead/bg_d_4.png", 1139, 0),

      new BackgroundObject("img/background/dead/bg_d_1.png", 1139 * 2, 0),
      new BackgroundObject("img/background/dead/bg_d_2.png", 1139 * 2, 0),
      new BackgroundObject("img/background/dead/bg_d_3.png", 1139 * 2, 0),
      new BackgroundObject("img/background/dead/bg_d_4.png", 1139 * 2, 0),
    ],

    // 3. backgroundObjectsFront: Closer background layers (Dead Forest)
    [
      new BackgroundObject("img/background/dead/bg_d_5.png", -1139, 0),
      new BackgroundObject("img/background/dead/bg_d_6.png", -1139, 0),

      new BackgroundObject("img/background/dead/bg_d_5.png", 0, 0),
      new BackgroundObject("img/background/dead/bg_d_6.png", 0, 0),

      new BackgroundObject("img/background/dead/bg_d_5.png", 1139, 0),
      new BackgroundObject("img/background/dead/bg_d_6.png", 1139, 0),

      new BackgroundObject("img/background/dead/bg_d_5.png", 1139 * 2, 0),
      new BackgroundObject("img/background/dead/bg_d_6.png", 1139 * 2, 0),
    ],

    // 4. backgroundObjectsRearEndgame: Distant background layers for the "Vibrant" transition
    [
      new BackgroundObject("img/background/vibrant/bg_v_1.png", -1139, 0),
      new BackgroundObject("img/background/vibrant/bg_v_2.png", -1139, 0),
      new BackgroundObject("img/background/vibrant/bg_v_3.png", -1139, 0),
      new BackgroundObject("img/background/vibrant/bg_v_4.png", -1139, 0),

      new BackgroundObject("img/background/vibrant/bg_v_1.png", 0, 0),
      new BackgroundObject("img/background/vibrant/bg_v_2.png", 0, 0),
      new BackgroundObject("img/background/vibrant/bg_v_3.png", 0, 0),
      new BackgroundObject("img/background/vibrant/bg_v_4.png", 0, 0),

      new BackgroundObject("img/background/vibrant/bg_v_1.png", 1139, 0),
      new BackgroundObject("img/background/vibrant/bg_v_2.png", 1139, 0),
      new BackgroundObject("img/background/vibrant/bg_v_3.png", 1139, 0),
      new BackgroundObject("img/background/vibrant/bg_v_4.png", 1139, 0),

      new BackgroundObject("img/background/vibrant/bg_v_1.png", 1139 * 2, 0),
      new BackgroundObject("img/background/vibrant/bg_v_2.png", 1139 * 2, 0),
      new BackgroundObject("img/background/vibrant/bg_v_3.png", 1139 * 2, 0),
      new BackgroundObject("img/background/vibrant/bg_v_4.png", 1139 * 2, 0),
    ],

    // 5. backgroundObjectsFrontEndgame: Closer background layers for the "Vibrant" transition
    [
      new BackgroundObject("img/background/vibrant/bg_v_5.png", -1139, 0),
      new BackgroundObject("img/background/vibrant/bg_v_6.png", -1139, 0),

      new BackgroundObject("img/background/vibrant/bg_v_5.png", 0, 0),
      new BackgroundObject("img/background/vibrant/bg_v_6.png", 0, 0),

      new BackgroundObject("img/background/vibrant/bg_v_5.png", 1139, 0),
      new BackgroundObject("img/background/vibrant/bg_v_6.png", 1139, 0),

      new BackgroundObject("img/background/vibrant/bg_v_5.png", 1139 * 2, 0),
      new BackgroundObject("img/background/vibrant/bg_v_6.png", 1139 * 2, 0),
    ],

    // 6. enemyEndboss: The final encounter of the level
    [new EnemyEndboss()],

    // 7. coins: Collectable items for scoring
    [
      new Coin(500, 150),
      new Coin(600, 100),
      new Coin(700, 150),
      new Coin(1200, 150),
      new Coin(1200, 100),
      new Coin(1200, 50),
      new Coin(1900, 150),
      new Coin(2000, 100),
      new Coin(2000, 50),
      new Coin(2100, 150),
    ],

    // 8. shadowEnergy: Energy refills for the player
    [
      new ShadowEnergy(500, 250),
      new ShadowEnergy(900, 250),
      new ShadowEnergy(1200, 250),
      new ShadowEnergy(1500, 250),
      new ShadowEnergy(1700, 250),
      new ShadowEnergy(2000, 250),
      new ShadowEnergy(2100, 250),
      new ShadowEnergy(2200, 250),
    ],

    // 9. enemyPlant: Stationary shooting enemy
    [new EnemyPlant(600), new EnemyPlant(1800)],
  );
}
