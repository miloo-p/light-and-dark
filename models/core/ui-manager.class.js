class UIManager {
  static isFullscreen = false;
  constructor() {
    this.startScreen = document.getElementById("start-screen");
    this.endScreen = document.getElementById("end-screen");
    this.gameOverScreen = document.getElementById("game-over-screen"); // NEU
    this.controlsBox = document.getElementById("controls-box");
    this.narrativeBox = document.querySelector("#start-screen .content-box");

    this.endButtonTimeout = null;
    UIManager.updateMuteButtonState();

    document.addEventListener("fullscreenchange", () => {
      UIManager.updateFullscreenButtonState();
    });
  }

  // --- Hilfsmethoden zum Aufräumen ---
  hideAllOverlayScreens() {
    if (this.startScreen) this.startScreen.classList.add("d_none");
    if (this.endScreen) this.endScreen.classList.add("d_none");
    if (this.gameOverScreen) this.gameOverScreen.classList.add("d_none");
    if (this.endButtonTimeout) clearTimeout(this.endButtonTimeout);
  }

  // --- Screen Controls ---
  showStartScreen() {
    this.hideAllOverlayScreens();
    if (this.startScreen) this.startScreen.classList.remove("d_none");
  }

  showGameOver() {
    this.hideAllOverlayScreens();
    if (this.gameOverScreen) {
      this.gameOverScreen.classList.remove("d_none");
      document.getElementById("in-game-hud").classList.add("d_none");
    }
  }

  showEndScreen() {
    this.hideAllOverlayScreens();
    if (this.endScreen) {
      this.endScreen.classList.remove("d_none");
      document.getElementById("in-game-hud").classList.add("d_none");
    }
  }

  // --- Game Flow ---
  startGame() {
    this.hideAllOverlayScreens();
    document.getElementById("in-game-hud").classList.remove("d_none");
    initStartGame();
  }

  backToMenu() {
    this.showStartScreen();
    if (typeof MovableObject !== "undefined") {
      MovableObject.stopAllIntervals();
    }
  }

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

  // --- Fullscreen Toggle ---

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

  static updateFullscreenButtonState() {
    const fsIcon = document.getElementById("fs-icon");
    if (fsIcon) {
      const isFS = !!document.fullscreenElement;
      fsIcon.src = isFS ? "./img/ui/collapse-screen.svg" : "./img/ui/expand-screen.svg";
      fsIcon.alt = isFS ? "Vollbild beenden" : "Vollbild starten";
    }
  }
  // --- Audio UI ---
  static toggleMute() {
    AudioManager.toggleMute();
    UIManager.updateMuteButtonState();
    document.getElementById("mute-btn").blur();
  }

  static updateMuteButtonState() {
    const muteIcon = document.getElementById("mute-icon");
    if (muteIcon) {
      muteIcon.src = AudioManager.isMuted ? "./img/ui/sound-mute.svg" : "./img/ui/sound.svg";
      muteIcon.alt = AudioManager.isMuted ? "Sound einschalten" : "Sound stummschalten";
    }
  }
}
