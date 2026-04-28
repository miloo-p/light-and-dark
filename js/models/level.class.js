class Level {
  enemyStomps;
  backgroundObjectsRear;
  backgroundObjectsFront;
  enemyEndboss;
  coins;
  shadowEnergy;
  level_end_x = 2700;

  constructor(enemyStomps, backgroundObjectsRear, backgroundObjectsFront, enemyEndboss, coins, shadowEnergy) {
    this.enemyStomps = enemyStomps;
    this.backgroundObjectsRear = backgroundObjectsRear;
    this.backgroundObjectsFront = backgroundObjectsFront;
    this.enemyEndboss = enemyEndboss;
    this.coins = coins;
    this.shadowEnergy = shadowEnergy;
  }
}
