let canvas;
let ctx;
let world;
let keyboard = new Keyboard();

function initStartGame() {
  initLevel();
  canvas = document.getElementById("game-canvas");
  world = new World(canvas, keyboard);
  const button = document.getElementById("collision-toggle");

  if (button) {
    button.addEventListener("click", toggleCollisionBoxes);
  }
  AudioManager.initAudioManager();

  AudioManager.playLayer("horror_ambience", "ambience_layer");
  AudioManager.playLayer("winter_ruins", "music_layer");
}
