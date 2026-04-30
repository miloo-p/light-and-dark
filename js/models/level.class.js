class Level {
  enemyStomps;
  backgroundObjectsRear;
  backgroundObjectsFront;
  backgroundObjectsRearEndgame;
  backgroundObjectsFrontEndgame;
  enemyEndboss;
  coins;
  shadowEnergy;
  enemyPlant;
  level_end_x = 2700;

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
