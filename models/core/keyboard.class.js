/**
 * Global input manager that maps both physical keyboard events and mobile touch events
 * to simple boolean flags. The game loops read these flags to determine player actions.
 * @class
 */
class Keyboard {
  /** @type {boolean} True if the player is pressing the move-left key/button. */
  keyLeft = false;

  /** @type {boolean} True if the player is pressing the move-right key/button. */
  keyRight = false;

  /** @type {boolean} True if the player is pressing the jump key/button. */
  keyJump = false;

  /** @type {boolean} True if the player is pressing the melee attack key/button. */
  keyAttack = false;

  /** @type {boolean} True if the player is pressing the spell/projectile key/button. */
  keySpell = false;

  /**
   * Disables all input processing when set to true.
   * Used during cutscenes (like the boss death sequence) or menus to prevent unintended movement.
   * @type {boolean}
   */
  keyLocked = false;

  /**
   * Initializes the keyboard and binds all necessary event listeners to the global window object.
   */
  constructor() {
    this.bindKeyPressEvents();
    this.bindTouchEvents();
  }

  /**
   * Master function to bind both keydown and keyup events for physical keyboards.
   */
  bindKeyPressEvents() {
    this.bindKeyDownEvents();
    this.bindKeyUpEvents();
  }

  /**
   * Listens for key presses and sets the corresponding action flags to true.
   * Ignores input if the keyboard is currently locked.
   */
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

  /**
   * Listens for key releases and sets the corresponding action flags back to false.
   */
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

  /**
   * Master function to bind both touchstart and touchend events for mobile touchscreens.
   */
  bindTouchEvents() {
    this.bindTouchStartEvents();
    this.bindTouchEndEvents();
  }

  /**
   * Listens for fingers touching the screen over specific UI buttons.
   * Checks the HTML element ID of the target to set the correct action flag.
   */
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

  /**
   * Listens for fingers lifting off the screen and resets the corresponding action flag.
   */
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

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================

  /**
   * Engages the input lock and immediately forces all action flags to false.
   * Ensures the character doesn't keep running if a key was held down when the lock triggered.
   */
  lockAndReset() {
    this.keyLocked = true;
    this.keyLeft = false;
    this.keyRight = false;
    this.keyJump = false;
    this.keySpell = false;
    this.keyAttack = false;
  }

  /**
   * Releases the input lock and ensures all action flags are clean.
   * Used when restarting the game or exiting menus.
   */
  unlockAndReset() {
    this.keyLocked = false;
    this.keyLeft = false;
    this.keyRight = false;
    this.keyJump = false;
    this.keyAttack = false;
    this.keySpell = false;
  }
}
