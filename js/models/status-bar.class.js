class StatusBar extends DrawableObject {
  imagesStatus = [
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
    this.loadAimationImages(this.imagesStatus);
    this.x = 30;
    this.y = 20;
    this.width = 200;
    this.height = 60;
    this.setLifePercentage(100);
  }

  setLifePercentage(hp) {
    this.lifePercentage = hp;
    let path = this.imagesStatus[this.resolveImageIndexForHP()];
    this.img = this.imageChache[path];
  }

  resolveImageIndexForHP() {
    if (this.lifePercentage == 100) {
      return 5;
    } else if (this.lifePercentage > 80) {
      return 4;
    } else if (this.lifePercentage > 60) {
      return 3;
    } else if (this.lifePercentage > 40) {
      return 2;
    } else if (this.lifePercentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
