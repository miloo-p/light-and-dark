class EnemyStomp extends MovableObject {
  constructor() {
    super().loadimage(`img/enemies/enemie_stomp/idle/1_i.png`);

    this.x = 250 + Math.random() * 500;
    this.y = 300;
    this.width = 71;
    this.height = 70;
  }
}
