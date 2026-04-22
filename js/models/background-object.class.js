class BackgroundObject extends MovableObject {
  constructor(ImageSrc, x, y) {
    super().loadimage(ImageSrc);
    this.x = x;
    this.y = y;

    this.width = 1140;
    this.height = 405;
  }
}
