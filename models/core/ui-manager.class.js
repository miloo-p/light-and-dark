/**
 * Global manager handling DOM manipulations, UI overlays, and menus.
 * @class
 */
class UIManager {
  /** @type {boolean} */
  static isFullscreen = false;

  /** Initializes the UI Manager and binds essential DOM elements. */
  constructor() {
    /** @type {HTMLElement|null} */
    this.startScreen = document.getElementById("start-screen");

    /** @type {HTMLElement|null} */
    this.endScreen = document.getElementById("end-screen");

    /** @type {HTMLElement|null} */
    this.gameOverScreen = document.getElementById("game-over-screen");

    /** @type {HTMLElement|null} */
    this.imprintScreen = document.getElementById("imprint-screen");

    /** @type {HTMLElement|null} */
    this.creditsScreen = document.getElementById("credits-screen");

    /** @type {HTMLElement|null} */
    this.controlsBox = document.getElementById("controls-box");

    /** @type {HTMLElement|null} */
    this.narrativeBox = document.querySelector("#start-screen .content-box");

    /** @type {number|null} */
    this.endButtonTimeout = null;

    // Ensure the UI matches the initial audio state
    UIManager.updateMuteButtonState();

    // Listen for native ESC key or browser-level fullscreen exits to update UI buttons accordingly
    document.addEventListener("fullscreenchange", () => {
      UIManager.updateFullscreenButtonState();
    });
  }

  // ==========================================
  // SCREEN TRANSITIONS & OVERLAYS
  // ==========================================

  /** Forcefully hides all full-screen UI overlays. */
  hideAllOverlayScreens() {
    if (this.startScreen) this.startScreen.classList.add("d_none");
    if (this.endScreen) this.endScreen.classList.add("d_none");
    if (this.gameOverScreen) this.gameOverScreen.classList.add("d_none");
    if (this.imprintScreen) this.imprintScreen.classList.add("d_none");
    if (this.creditsScreen) this.creditsScreen.classList.add("d_none");

    if (this.endButtonTimeout) clearTimeout(this.endButtonTimeout);
  }

  /** Displays the main menu/start screen. */
  showStartScreen() {
    this.hideAllOverlayScreens();
    if (this.startScreen) this.startScreen.classList.remove("d_none");
  }

  /** Displays the Imprint (Impressum) screen. */
  showImprint() {
    this.hideAllOverlayScreens();
    if (this.imprintScreen) this.imprintScreen.classList.remove("d_none");
  }

  /** Displays the Credits screen. */
  showCredits() {
    this.hideAllOverlayScreens();
    if (this.creditsScreen) this.creditsScreen.classList.remove("d_none");
  }

  /** Displays the Game Over screen and hides the HUD. */
  showGameOver() {
    this.hideAllOverlayScreens();
    if (this.gameOverScreen) {
      this.gameOverScreen.classList.remove("d_none");
      document.getElementById("in-game-hud").classList.add("d_none");
    }
  }

  /** Displays the victory/end screen and hides the HUD. */
  showEndScreen() {
    this.hideAllOverlayScreens();
    if (this.endScreen) {
      this.endScreen.classList.remove("d_none");
      document.getElementById("in-game-hud").classList.add("d_none");
    }
  }

  /** Hides the mobile touch controls via CSS display override. */
  hideMobileControls() {
    const controls = document.getElementById("mobile-controls");
    if (controls) {
      controls.style.setProperty("display", "none", "important");
    }
  }

  /** Resets mobile touch controls visibility to CSS media queries. */
  resetMobileControls() {
    const controls = document.getElementById("mobile-controls");
    if (controls) {
      controls.style.removeProperty("display");
    }
  }

  // ==========================================
  // GAME FLOW CONTROLS
  // ==========================================

  /** Triggers game initialization and reveals the HUD. */
  startGame() {
    this.hideAllOverlayScreens();
    this.resetMobileControls();
    document.getElementById("in-game-hud").classList.remove("d_none");
    initStartGame();
  }

  /** Aborts the game, stops intervals, and returns to the main menu. */
  backToMenu() {
    this.showStartScreen();
    this.resetMobileControls();

    if (typeof MovableObject !== "undefined") {
      MovableObject.stopAllIntervals();
    }

    // ACHTUNG: Hier ist der Bugfix gegen das Hacken/Memory Leak!
    if (typeof world !== "undefined" && world !== null) {
      world.stop();
    }
  }

  /** Toggles visibility between the narrative text and the controls manual. */
  toggleControls() {
    if (this.controlsBox && this.narrativeBox) {
      const isHidden = this.controlsBox.classList.contains("d_none");

      this.controlsBox.classList.toggle("d_none");
      this.narrativeBox.classList.toggle("d_none");

      const btn = document.getElementById("btn-show-controls");
      if (btn) {
        btn.innerText = isHidden ? "Zurück" : "Steuerung";
      }

      const legalLinks = document.getElementById("legal-links");
      if (legalLinks) {
        legalLinks.classList.toggle("d_none");
      }
    }
  }

  // ==========================================
  // FULLSCREEN API
  // ==========================================

  /** Requests or exits browser fullscreen mode. */
  static toggleFullscreen() {
    let container = document.getElementById("game-container");

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    document.getElementById("fs-btn").blur();
  }

  /** Updates the fullscreen button icon based on browser state. */
  static updateFullscreenButtonState() {
    const fsIcon = document.getElementById("fs-icon");
    if (fsIcon) {
      const isFS = !!document.fullscreenElement;
      fsIcon.src = isFS ? "./img/ui/collapse-screen.svg" : "./img/ui/expand-screen.svg";
      fsIcon.alt = isFS ? "Vollbild beenden" : "Vollbild starten";
    }
  }

  // ==========================================
  // AUDIO UI
  // ==========================================

  /** Toggles global audio mute state and updates the UI. */
  static toggleMute() {
    AudioManager.toggleMute();
    UIManager.updateMuteButtonState();
    document.getElementById("mute-btn").blur();
  }

  /** Updates the mute button icon based on AudioManager state. */
  static updateMuteButtonState() {
    const muteIcon = document.getElementById("mute-icon");
    if (muteIcon) {
      muteIcon.src = AudioManager.isMuted ? "./img/ui/sound-mute.svg" : "./img/ui/sound.svg";
      muteIcon.alt = AudioManager.isMuted ? "Sound einschalten" : "Sound stummschalten";
    }
  }
}
