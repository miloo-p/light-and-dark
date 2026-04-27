const level1 = new Level(
  [new EnemyStomp(), new EnemyStomp(), new EnemyStomp()],

  /*   [
    new BackgroundObject("img/background/vibrant/bg_v_1.png", -11, 0),
    new BackgroundObject("img/background/vibrant/bg_v_2.png", -11, 0),
    new BackgroundObject("img/background/vibrant/bg_v_3.png", -11, 0),
    new BackgroundObject("img/background/vibrant/bg_v_4.png", -11, 0),

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
  ], */
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
  [new EnemyEndboss()],
  [new Coin(400, 150), new Coin(600, 100), new Coin(800, 150)],
  [new ShadowEnergy(500, 250), new ShadowEnergy(900, 250)],
);
