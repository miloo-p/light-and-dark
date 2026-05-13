/**
 * UI element displaying the player's current health percentage.
 * @class
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  /** @type {string[]} */
  static imagesStatus = [
    `img/statusbars/1_statusbar/2_statusbar_health/0.png`,
    `img/statusbars/1_statusbar/2_statusbar_health/20.png`,
    `img/statusbars/1_statusbar/2_statusbar_health/40.png`,
    `img/statusbars/1_statusbar/2_statusbar_health/60.png`,
    `img/statusbars/1_statusbar/2_statusbar_health/80.png`,
    `img/statusbars/1_statusbar/2_statusbar_health/100.png`,
  ];

  /** @type {number} */
  lifePercentage = 100;

  /** Initializes the status bar and sets its screen position. */
  constructor() {
    super();
    this.x = 60;
    this.y = 28;
    this.width = 200;
    this.height = 53;
    this.setLifePercentage(100);
  }

  /**
   * Updates the health percentage and switches the displayed image.
   * @param {number} hp - The current health points.
   */
  setLifePercentage(hp) {
    this.lifePercentage = hp;
    let path = StatusBar.imagesStatus[this.resolveImageIndexForHP()];

    if (DrawableObject.imageCache[path]) {
      this.img = DrawableObject.imageCache[path];
    } else {
      this.loadImage(path);
    }
  }

  /**
   * @returns {number} The index of the image corresponding to the current health level.
   */
  resolveImageIndexForHP() {
    if (this.lifePercentage >= 100) return 5;
    else if (this.lifePercentage >= 80) return 4;
    else if (this.lifePercentage >= 60) return 3;
    else if (this.lifePercentage >= 40) return 2;
    else if (this.lifePercentage >= 20) return 1;
    else return 0;
  }
}
