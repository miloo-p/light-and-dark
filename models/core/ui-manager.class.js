class UIManager {
  constructor() {
    this.startScreen = document.getElementById("start-screen");
    this.endScreen = document.getElementById("end-screen");
    this.endButtons = document.getElementById("end-menu-buttons");
    this.endButtonTimeout = null;
    this.controlsBox = document.querySelector(".controls-box");
    this.narrativeBox = document.querySelector(".narrative-box");
  }

  hideStartScreen() {
    if (this.startScreen) this.startScreen.classList.add("d_none");
  }

  showStartScreen() {
    if (this.startScreen) this.startScreen.classList.remove("d_none");
  }

  hideEndScreen() {
    if (this.endScreen) this.endScreen.classList.add("d_none");
    if (this.endButtons) this.endButtons.classList.add("d_none");
    if (this.endButtonTimeout) clearTimeout(this.endButtonTimeout);
  }

  showEndScreen() {
    if (this.endScreen) this.endScreen.classList.remove("d_none");
    this.endButtonTimeout = setTimeout(() => {
      if (this.endButtons) this.endButtons.classList.remove("d_none");
    }, 3000);
  }

  startGame() {
    this.hideStartScreen();
    this.hideEndScreen();
    initStartGame();
  }

  backToMenu() {
    this.hideEndScreen();
    this.showStartScreen();

    if (typeof MovableObject !== "undefined") {
      MovableObject.stopAllIntervals();
    }
  }

  toggleControls() {
    if (this.controlsBox && this.narrativeBox) {
      this.controlsBox.classList.toggle("d_none");
      this.narrativeBox.classList.toggle("d_none");

      const btn = document.getElementById("btn-show-controls");
      if (btn) {
        btn.innerText = this.controlsBox.classList.contains("d_none") ? "Controls" : "Back";
      }
    }
  }

  static toggleMute() {
    AudioManager.toggleMute();

    const muteIcon = document.getElementById("mute-icon");
    if (muteIcon) {
      muteIcon.src = AudioManager.isMuted ? "./img/ui/sound-mute.svg" : "./img/ui/sound.svg";
      muteIcon.alt = AudioManager.isMuted ? "Unmute Gamesound Button" : "Mute Gamesound Button";
    }
  }
}
