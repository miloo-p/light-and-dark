class Level {
  enemyStomps;
  backgroudObjectsRear;
  backgroudObjectsFront;
  enemyEndboss;
  coins;
  shadowEnergy;
  level_end_x = 2700;

  constructor(enemyStomps, backgroudObjectsRear, backgroudObjectsFront, enemyEndboss, coins, shadowEnergy) {
    this.enemyStomps = enemyStomps;
    this.backgroudObjectsRear = backgroudObjectsRear;
    this.backgroudObjectsFront = backgroudObjectsFront;
    this.enemyEndboss = enemyEndboss;
    this.coins = coins;
    this.shadowEnergy = shadowEnergy;
  }
}
