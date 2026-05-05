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

window.addEventListener("keydown", (event) => {
  if (event.key == "a") {
    keyboard.keyLeft = true;
  }
  if (event.key == "d") {
    keyboard.keyRight = true;
  }
  if (event.key == " ") {
    keyboard.keyJump = true;
  }
  if (event.key == "q") {
    keyboard.keySpell = true;
  }
  if (event.key == "e") {
    keyboard.keyAttack = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key == "a") {
    keyboard.keyLeft = false;
  }
  if (event.key == "d") {
    keyboard.keyRight = false;
  }
  if (event.key == " ") {
    keyboard.keyJump = false;
  }
  if (event.key == "q") {
    keyboard.keySpell = false;
  }
  if (event.key == "e") {
    keyboard.keyAttack = false;
  }
});
