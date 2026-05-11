class BossStatusBar extends DrawableObject {
  static imagesBossStatus = [
    `img/statusbars/2_statusbar_endboss/0.png`,
    `img/statusbars/2_statusbar_endboss/20.png`,
    `img/statusbars/2_statusbar_endboss/40.png`,
    `img/statusbars/2_statusbar_endboss/60.png`,
    `img/statusbars/2_statusbar_endboss/80.png`,
    `img/statusbars/2_statusbar_endboss/100.png`,
    `img/statusbars/2_statusbar_endboss/120.png`,
    `img/statusbars/2_statusbar_endboss/140.png`,
    `img/statusbars/2_statusbar_endboss/160.png`,
    `img/statusbars/2_statusbar_endboss/180.png`,
    `img/statusbars/2_statusbar_endboss/200.png`,
  ];

  percentage = 200;

  constructor() {
    super();
    this.x = 200;
    this.y = -18;
    this.width = 300;
    this.height = 80;
    this.setPercentage(200);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let imageIndex = this.resolveImageIndex();

    let imagePath = BossStatusBar.imagesBossStatus[imageIndex];

    this.img = DrawableObject.imageCache[imagePath];
  }

  resolveImageIndex() {
    if (this.percentage >= 200) return 10;
    else if (this.percentage >= 180) return 9;
    else if (this.percentage >= 160) return 8;
    else if (this.percentage >= 140) return 7;
    else if (this.percentage >= 120) return 6;
    else if (this.percentage >= 100) return 5;
    else if (this.percentage >= 80) return 4;
    else if (this.percentage >= 60) return 3;
    else if (this.percentage >= 40) return 2;
    else if (this.percentage >= 20) return 1;
    else return 0;
  }
}
