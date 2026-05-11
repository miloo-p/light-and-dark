class StatusBar extends DrawableObject {
  static imagesStatus = [
    `img/statusbars/1_statusbar/2_statusbar_health/0.png`,
    `img/statusbars/1_statusbar/2_statusbar_health/20.png`,
    `img/statusbars/1_statusbar/2_statusbar_health/40.png`,
    `img/statusbars/1_statusbar/2_statusbar_health/60.png`,
    `img/statusbars/1_statusbar/2_statusbar_health/80.png`,
    `img/statusbars/1_statusbar/2_statusbar_health/100.png`,
  ];
  lifePercentage = 100;
  constructor() {
    super();
    this.x = 60;
    this.y = 28;
    this.width = 200;
    this.height = 53;
    this.setLifePercentage(100);
  }

  setLifePercentage(hp) {
    this.lifePercentage = hp;
    let path = StatusBar.imagesStatus[this.resolveImageIndexForHP()];

    if (DrawableObject.imageCache[path]) {
      this.img = DrawableObject.imageCache[path];
    } else {
      this.loadImage(path);
    }
  }

  resolveImageIndexForHP() {
    if (this.lifePercentage >= 100) return 5;
    else if (this.lifePercentage >= 80) return 4;
    else if (this.lifePercentage >= 60) return 3;
    else if (this.lifePercentage >= 40) return 2;
    else if (this.lifePercentage >= 20) return 1;
    else return 0;
  }
}
