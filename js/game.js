let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let uiManager = new UIManager();

function initStartGame() {
  resetGame();
  initLevel();

  canvas = document.getElementById("game-canvas");
  world = new World(canvas, keyboard);

  world.isGamePaused = false;

  AudioManager.initAudioManager();
  AudioManager.playLayer("horror_ambience", "ambience_layer");
  AudioManager.playLayer("winter_ruins", "music_layer");
}

function resetGame() {
  keyboard.unlockAndReset();
  MovableObject.stopAllIntervals();
}
