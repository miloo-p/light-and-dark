class BossStatusBar extends DrawableObject {
  imagesBossStatus = [
    `img/statusbars/2_statusbar_endboss/0.png`,
    `img/statusbars/2_statusbar_endboss/20.png`,
    `img/statusbars/2_statusbar_endboss/40.png`,
    `img/statusbars/2_statusbar_endboss/60.png`,
    `img/statusbars/2_statusbar_endboss/80.png`,
    `img/statusbars/2_statusbar_endboss/100.png`,
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadAnimationImages(this.imagesBossStatus);
    this.x = 200;
    this.y = -18;
    this.width = 300;
    this.height = 80;
    this.setPercentage(100);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let imageIndex = this.resolveImageIndex();
    let imagePath = this.imagesBossStatus[imageIndex];
    this.img = this.imageCache[imagePath];
  }

  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    else if (this.percentage >= 80) return 4;
    else if (this.percentage >= 60) return 3;
    else if (this.percentage >= 40) return 2;
    else if (this.percentage >= 20) return 1;
    else return 0;
  }
}
