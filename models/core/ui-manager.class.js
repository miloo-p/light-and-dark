/**
 * Global manager responsible for handling all DOM manipulations, UI overlays,
 * and menu transitions. Bridges the gap between the HTML document and the game logic.
 * @class
 */
class UIManager {
  /**
   * Tracks the global fullscreen state of the application.
   * @static
   * @type {boolean}
   */
  static isFullscreen = false;

  /**
   * Initializes the UI Manager, binds essential DOM elements to the instance,
   * and sets up event listeners for native browser API changes (like fullscreen).
   */
  constructor() {
    /** @type {HTMLElement|null} Reference to the start screen container. */
    this.startScreen = document.getElementById("start-screen");

    /** @type {HTMLElement|null} Reference to the victory/end screen container. */
    this.endScreen = document.getElementById("end-screen");

    /** @type {HTMLElement|null} Reference to the game over (death) screen container. */
    this.gameOverScreen = document.getElementById("game-over-screen");

    /** @type {HTMLElement|null} Reference to the imprint screen container. */
    this.imprintScreen = document.getElementById("imprint-screen");

    /** @type {HTMLElement|null} Reference to the credits screen container. */
    this.creditsScreen = document.getElementById("credits-screen");

    /** @type {HTMLElement|null} Reference to the tutorial/controls information box. */
    this.controlsBox = document.getElementById("controls-box");

    /** @type {HTMLElement|null} Reference to the story/narrative text box. */
    this.narrativeBox = document.querySelector("#start-screen .content-box");

    /** @type {number|null} Internal reference to timeout functions for UI transitions. */
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

  /**
   * Helper method to forcefully hide all full-screen UI overlays.
   * Ensures a clean slate before displaying a new screen.
   */
  hideAllOverlayScreens() {
    if (this.startScreen) this.startScreen.classList.add("d_none");
    if (this.endScreen) this.endScreen.classList.add("d_none");
    if (this.gameOverScreen) this.gameOverScreen.classList.add("d_none");
    if (this.imprintScreen) this.imprintScreen.classList.add("d_none");
    if (this.creditsScreen) this.creditsScreen.classList.add("d_none");

    if (this.endButtonTimeout) clearTimeout(this.endButtonTimeout);
  }

  /**
   * Displays the main menu/start screen and hides all other overlays.
   */
  showStartScreen() {
    this.hideAllOverlayScreens();
    if (this.startScreen) this.startScreen.classList.remove("d_none");
  }

  /**
   * Displays the Imprint (Impressum) screen and hides all other overlays.
   */
  showImprint() {
    this.hideAllOverlayScreens();
    if (this.imprintScreen) this.imprintScreen.classList.remove("d_none");
  }

  /**
   * Displays the Credits screen and hides all other overlays.
   */
  showCredits() {
    this.hideAllOverlayScreens();
    if (this.creditsScreen) this.creditsScreen.classList.remove("d_none");
  }

  /**
   * Displays the Game Over screen and hides the in-game heads-up display (HUD).
   */
  showGameOver() {
    this.hideAllOverlayScreens();
    if (this.gameOverScreen) {
      this.gameOverScreen.classList.remove("d_none");
      document.getElementById("in-game-hud").classList.add("d_none");
    }
  }

  /**
   * Displays the victory/end screen and hides the in-game heads-up display (HUD).
   */
  showEndScreen() {
    this.hideAllOverlayScreens();
    if (this.endScreen) {
      this.endScreen.classList.remove("d_none");
      document.getElementById("in-game-hud").classList.add("d_none");
    }
  }

  /**
   * Hides the mobile touch controls. Used during cutscenes or menu screens.
   */
  hideMobileControls() {
    const controls = document.getElementById("mobile-controls");
    if (controls) {
      // Wichtig: Wir nutzen display: none !important, um Media Queries zu überschreiben
      controls.style.setProperty("display", "none", "important");
    }
  }

  /**
   * Resets the mobile touch controls to let CSS Media Queries handle their visibility again.
   */
  resetMobileControls() {
    const controls = document.getElementById("mobile-controls");
    if (controls) {
      controls.style.removeProperty("display");
    }
  }

  // ==========================================
  // GAME FLOW CONTROLS
  // ==========================================

  /**
   * Triggers the game initialization sequence.
   * Hides menus, reveals the HUD, and calls the global `initStartGame` routine.
   */
  startGame() {
    this.hideAllOverlayScreens();
    this.resetMobileControls();
    document.getElementById("in-game-hud").classList.remove("d_none");
    initStartGame();
  }

  /**
   * Aborts the current game and returns to the main menu.
   * Safely halts all running game intervals to prevent background logic execution.
   */
  backToMenu() {
    this.showStartScreen();
    this.resetMobileControls();
    if (typeof MovableObject !== "undefined") {
      MovableObject.stopAllIntervals();
    }
  }

  /**
   * Toggles the visibility between the narrative text box and the controls manual
   * on the start screen. Updates the button text dynamically.
   */
  toggleControls() {
    if (this.controlsBox && this.narrativeBox) {
      const isHidden = this.controlsBox.classList.contains("d_none");

      this.controlsBox.classList.toggle("d_none");
      this.narrativeBox.classList.toggle("d_none");

      const btn = document.getElementById("btn-show-controls");
      if (btn) {
        btn.innerText = isHidden ? "Zurück" : "Steuerung";
      }
    }
  }

  // ==========================================
  // FULLSCREEN API
  // ==========================================

  /**
   * Requests or exits browser fullscreen mode for the main game container.
   * Removes focus from the clicked button immediately to prevent spacebar-double-triggering.
   * @static
   */
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

  /**
   * Updates the icon and alt-text of the fullscreen button to match the current browser state.
   * @static
   */
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

  /**
   * Toggles the global audio mute state via the AudioManager and updates the UI button.
   * Removes focus from the clicked button immediately.
   * @static
   * @see AudioManager
   */
  static toggleMute() {
    AudioManager.toggleMute();
    UIManager.updateMuteButtonState();
    document.getElementById("mute-btn").blur();
  }

  /**
   * Updates the icon and alt-text of the mute button based on the AudioManager's state.
   * @static
   */
  static updateMuteButtonState() {
    const muteIcon = document.getElementById("mute-icon");
    if (muteIcon) {
      muteIcon.src = AudioManager.isMuted ? "./img/ui/sound-mute.svg" : "./img/ui/sound.svg";
      muteIcon.alt = AudioManager.isMuted ? "Sound einschalten" : "Sound stummschalten";
    }
  }
}
