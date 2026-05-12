class Keyboard {
  keyLeft = false;
  keyRight = false;
  keyJump = false;
  keyAttack = false;
  keySpell = false;

  keyLocked = false;

  constructor() {
    this.bindKeyPressEvents();
    this.bindTouchEvents();
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

  bindTouchEvents() {
    this.bindTouchStartEvents();
    this.bindTouchEndEvents();
  }

  bindTouchStartEvents() {
    window.addEventListener("touchstart", (event) => {
      if (this.keyLocked) return;

      let id = event.target.id;

      if (id == "btn-left") {
        this.keyLeft = true;
      }
      if (id == "btn-right") {
        this.keyRight = true;
      }
      if (id == "btn-jump") {
        this.keyJump = true;
      }
      if (id == "btn-pulse") {
        this.keySpell = true;
      }
      if (id == "btn-blade") {
        this.keyAttack = true;
      }
    });
  }

  bindTouchEndEvents() {
    window.addEventListener("touchend", (event) => {
      if (this.keyLocked) return;

      let id = event.target.id;

      if (id == "btn-left") {
        this.keyLeft = false;
      }
      if (id == "btn-right") {
        this.keyRight = false;
      }
      if (id == "btn-jump") {
        this.keyJump = false;
      }
      if (id == "btn-pulse") {
        this.keySpell = false;
      }
      if (id == "btn-blade") {
        this.keyAttack = false;
      }
    });
  }

  // --- RESET ---
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
