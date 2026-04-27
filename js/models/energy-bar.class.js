class EnergyBar extends DrawableObject {
  imagesEnergy = [
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
    this.loadAimationImages(this.imagesEnergy);
    this.x = 20;
    this.y = 20;
    this.width = 70;
    this.height = 70;
    this.setEnergyPercentage(40);
  }

  setEnergyPercentage(energy) {
    this.energyPercentage = energy;
    let path = this.imagesEnergy[this.resolveImageIndexForEnergy()];
    this.img = this.imageChache[path];
  }

  resolveImageIndexForEnergy() {
    if (this.energyPercentage == 100) {
      return 5;
    } else if (this.energyPercentage > 80) {
      return 4;
    } else if (this.energyPercentage > 60) {
      return 3;
    } else if (this.energyPercentage > 40) {
      return 2;
    } else if (this.energyPercentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
