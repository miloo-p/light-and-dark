class MeleeSlashObject extends MovableObject {
  width = 136;
  height = 120;

  isFinished = false;
  hasDealtDamage = false;

  static imagesSlash = [
    "img/characters/shadow/06_slash/1_slash.png",
    "img/characters/shadow/06_slash/2_slash.png",
  ];

  constructor(character) {
    super();
    this.loadImage(MeleeSlashObject.imagesSlash[0]);

    this.character = character;

    this.updatePosition();
    this.followCharacter();
    this.animate();
  }

  updatePosition() {
    this.changeDirection = this.character.changeDirection;

    if (this.changeDirection) {
      this.x = this.character.x - 30;
    } else {
      this.x = this.character.x + 30;
    }

    this.y = this.character.y;
  }

  followCharacter() {
    this.followInterval = this.setStoppableInterval(() => {
      this.updatePosition();
    }, 1000 / 60);
  }

  animate() {
    this.animationInterval = this.setStoppableInterval(() => {
      if (this.currentImage < MeleeSlashObject.imagesSlash.length) {
        let path = MeleeSlashObject.imagesSlash[this.currentImage];
        this.img = this.imageCache[path];
        AudioManager.playSFX("melee_swoosh");
        this.currentImage++;
      } else {
        this.isFinished = true;
        clearInterval(this.followInterval);
        clearInterval(this.animationInterval);
      }
    }, 100);
  }
}
