class EnergyBar extends DrawableObject {
  static imagesEnergy = [
    `img/statusbars/1_statusbar/3_statusbar_energy/shadow/0.png`,
    `img/statusbars/1_statusbar/3_statusbar_energy/shadow/20.png`,
    `img/statusbars/1_statusbar/3_statusbar_energy/shadow/40.png`,
    `img/statusbars/1_statusbar/3_statusbar_energy/shadow/60.png`,
    `img/statusbars/1_statusbar/3_statusbar_energy/shadow/80.png`,
    `img/statusbars/1_statusbar/3_statusbar_energy/shadow/100.png`,
  ];

  energyPercentage = 100;

  constructor() {
    super();
    this.x = 20;
    this.y = 15;
    this.width = 80;
    this.height = 80;
    this.setEnergyPercentage(40);
  }

  setEnergyPercentage(energy) {
    this.energyPercentage = energy;
    let path = EnergyBar.imagesEnergy[this.resolveImageIndexForEnergy()];

    if (DrawableObject.imageCache[path]) {
      this.img = DrawableObject.imageCache[path];
    } else {
      this.loadImage(path);
    }
  }

  resolveImageIndexForEnergy() {
    if (this.energyPercentage >= 100) return 5;
    else if (this.energyPercentage >= 80) return 4;
    else if (this.energyPercentage >= 60) return 3;
    else if (this.energyPercentage >= 40) return 2;
    else if (this.energyPercentage >= 20) return 1;
    else return 0;
  }
}
