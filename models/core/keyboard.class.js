class Keyboard {
  keyLeft = false;
  keyRight = false;
  keyJump = false;
  keyAttack = false;
  keySpell = false;

  keyLocked = false;

  constructor() {
    this.bindKeyPressEvents();
  }

  bindKeyPressEvents() {
    this.bindKeyDownEvents();
    this.bindKeyUpEvents();
  }

  bindKeyDownEvents() {
    window.addEventListener("keydown", (event) => {
      if (this.keyLocked) return;

      if (event.key == "a") {
        this.keyLeft = true;
      }
      if (event.key == "d") {
        this.keyRight = true;
      }
      if (event.key == " ") {
        this.keyJump = true;
      }
      if (event.key == "q") {
        this.keySpell = true;
      }
      if (event.key == "e") {
        this.keyAttack = true;
      }
    });
  }

  bindKeyUpEvents() {
    window.addEventListener("keyup", (event) => {
      if (this.keyLocked) return;

      if (event.key == "a") {
        this.keyLeft = false;
      }
      if (event.key == "d") {
        this.keyRight = false;
      }
      if (event.key == " ") {
        this.keyJump = false;
      }
      if (event.key == "q") {
        this.keySpell = false;
      }
      if (event.key == "e") {
        this.keyAttack = false;
      }
    });
  }

  lockAndReset() {
    this.keyLocked = true;
    this.keyLeft = false;
    this.keyRight = false;
    this.keyJump = false;
    this.keySpell = false;
    this.keyAttack = false;
  }

  unlockAndReset() {
    this.keyLocked = false;
    this.keyLeft = false;
    this.keyRight = false;
    this.keyJump = false;
    this.keyAttack = false;
    this.keySpell = false;
  }
}
