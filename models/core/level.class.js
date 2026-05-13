/**
 * Acts as a data container for a specific game level.
 * @class
 */
class Level {
  /** @type {EnemyStomp[]} */
  enemyStomps;

  /** @type {BackgroundObject[]} */
  backgroundObjectsRear;

  /** @type {BackgroundObject[]} */
  backgroundObjectsFront;

  /** @type {BackgroundObject[]} */
  backgroundObjectsRearEndgame;

  /** @type {BackgroundObject[]} */
  backgroundObjectsFrontEndgame;

  /** @type {EnemyEndboss[]} */
  enemyEndboss;

  /** @type {Coin[]} */
  coins;

  /** @type {ShadowEnergy[]} */
  shadowEnergy;

  /** @type {EnemyPlant[]} */
  enemyPlant;

  /** @type {number} */
  level_end_x = 2700;

  /**
   * Initializes a new level blueprint with all required entities and layers.
   * @param {EnemyStomp[]} enemyStomps - Array of Stomp enemies.
   * @param {BackgroundObject[]} backgroundObjectsRear - Standard rear background layers.
   * @param {BackgroundObject[]} backgroundObjectsFront - Standard front background layers.
   * @param {BackgroundObject[]} backgroundObjectsRearEndgame - Alternate rear backgrounds for the end sequence.
   * @param {BackgroundObject[]} backgroundObjectsFrontEndgame - Alternate front backgrounds for the end sequence.
   * @param {EnemyEndboss[]} enemyEndboss - The final boss entity.
   * @param {Coin[]} coins - Array of collectable coins.
   * @param {ShadowEnergy[]} shadowEnergy - Array of collectable energy potions.
   * @param {EnemyPlant[]} enemyPlant - Array of Plant enemies.
   */
  constructor(
    enemyStomps,
    backgroundObjectsRear,
    backgroundObjectsFront,
    backgroundObjectsRearEndgame,
    backgroundObjectsFrontEndgame,
    enemyEndboss,
    coins,
    shadowEnergy,
    enemyPlant,
  ) {
    this.enemyStomps = enemyStomps;
    this.backgroundObjectsRear = backgroundObjectsRear;
    this.backgroundObjectsFront = backgroundObjectsFront;
    this.backgroundObjectsRearEndgame = backgroundObjectsRearEndgame;
    this.backgroundObjectsFrontEndgame = backgroundObjectsFrontEndgame;
    this.enemyEndboss = enemyEndboss;
    this.coins = coins;
    this.shadowEnergy = shadowEnergy;
    this.enemyPlant = enemyPlant;
  }
}
