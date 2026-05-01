class BackgroundObject extends MovableObject {
  constructor(ImageSrc, x, y) {
    super().loadImage(ImageSrc);
    this.x = x;
    this.y = y;

    this.width = 1140;
    this.height = 405;
  }
}
