let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
// #region collision-toggle-debug
window.showCollisionBoxes = false;

function updateCollisionToggleButton() {
  const button = document.getElementById("collision-toggle");

  if (button) {
    button.textContent = window.showCollisionBoxes ? "Hitboxen: an" : "Hitboxen: aus";
    button.setAttribute("aria-pressed", String(window.showCollisionBoxes));
  }
}

function toggleCollisionBoxes() {
  window.showCollisionBoxes = !window.showCollisionBoxes;
  updateCollisionToggleButton();
}

function init() {
  canvas = document.getElementById("game-canvas");
  world = new World(canvas, keyboard);
  const button = document.getElementById("collision-toggle");

  if (button) {
    button.addEventListener("click", toggleCollisionBoxes);
  }

  updateCollisionToggleButton();
}
// #endregion collision-toggle-debug

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
