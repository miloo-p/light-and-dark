/**
 * Acts as a data container for a specific game level.
 * Holds all instantiated entities, collectables, and background layers required to render and play the level.
 * @class
 */
class Level {
  /**
   * Array containing all basic Stomp enemies in the level.
   * @type {EnemyStomp[]}
   */
  enemyStomps;

  /**
   * Array of background objects rendered behind the interactive game elements (e.g., sky, distant mountains).
   * @type {BackgroundObject[]}
   */
  backgroundObjectsRear;

  /**
   * Array of background objects rendered in front of the interactive game elements (e.g., foreground mist, trees).
   * @type {BackgroundObject[]}
   */
  backgroundObjectsFront;

  /**
   * Array of replacement background objects (rear) loaded during the cinematic boss defeat transition.
   * @type {BackgroundObject[]}
   */
  backgroundObjectsRearEndgame;

  /**
   * Array of replacement background objects (front) loaded during the cinematic boss defeat transition.
   * @type {BackgroundObject[]}
   */
  backgroundObjectsFrontEndgame;

  /**
   * Array containing the end boss. (Usually contains exactly one instance, but kept as an array for consistency).
   * @type {EnemyEndboss[]}
   */
  enemyEndboss;

  /**
   * Array of all collectable coins placed in the level.
   * @type {Coin[]}
   */
  coins;

  /**
   * Array of all collectable shadow energy items placed in the level.
   * @type {ShadowEnergy[]}
   */
  shadowEnergy;

  /**
   * Array containing all stationary Plant enemies in the level.
   * @type {EnemyPlant[]}
   */
  enemyPlant;

  /**
   * The absolute right horizontal boundary of the level.
   * The camera and player movement are constrained by this value.
   * @type {number}
   */
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
