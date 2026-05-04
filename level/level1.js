const level1 = new Level(
  [
    new EnemyStomp(500),
    new EnemyStomp(500),
    new EnemyStomp(500),
    new EnemyStomp(1000),
    new EnemyStomp(1000),
    new EnemyStomp(1000),
    new EnemyStomp(1500),
    new EnemyStomp(1500),
    new EnemyStomp(1500),
    new EnemyStomp(2100),
    new EnemyStomp(2100),
    new EnemyStomp(2100),
  ],
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
  [new EnemyEndboss()],
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
  [new EnemyPlant(600)],
);
