class Level {
  enemyStomps;
  backgroudObjectsRear;
  backgroudObjectsFront;
  enemyEndboss;
  level_end_x = 2700;

  constructor(enemyStomps, backgroudObjectsRear, backgroudObjectsFront, enemyEndboss) {
    this.enemyStomps = enemyStomps;
    this.backgroudObjectsRear = backgroudObjectsRear;
    this.backgroudObjectsFront = backgroudObjectsFront;
    this.enemyEndboss = enemyEndboss;
  }
}
