let canvas;
let ctx;
let character = new Image();

function init() {
  canvas = document.getElementById("game-canvas");
  ctx = canvas.getContext("2d");

  character.src = "../img/shadow-char/walk/w1-1.png";
  ctx.drawImage(character, 20, 20, 50, 150);
}
