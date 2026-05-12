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

const IMAGE_ASSETS = [
  // --- UI & Menüs ---
  "./img/homepage_background.jpg",
  "./img/game-logo.png",
  "./img/ui/sound.svg",
  "./img/ui/sound-mute.svg",

  // --- Shadow Character ---
  ...ShadowCharacter.imagesIdle,
  ...ShadowCharacter.imagesWalk,
  ...ShadowCharacter.imagesJump,
  ...ShadowCharacter.imagesHurt,
  ...ShadowCharacter.imagesDead,

  // --- Projektile & Attacken ---
  "img/characters/shadow/projectile/shadow_projectile.png",
  ...MeleeSlashObject.imagesSlash,
  ...EnemyBossProjectileObject.imagesFly,
  ...EnemyPlantProjectileObject.imagesFly,

  // --- Endboss ---
  ...EnemyEndboss.imagesIdle,
  ...EnemyEndboss.imagesWalk,
  ...EnemyEndboss.imagesDead,
  ...EnemyEndboss.imagesHurt,
  ...EnemyEndboss.imagesShoot,

  // --- Gegner: Plant ---
  ...EnemyPlant.imagesAttack,
  ...EnemyPlant.imagesHurt,
  ...EnemyPlant.imagesDead,

  // --- Gegner: Stomp ---
  ...EnemyStomp.imagesIdle,
  ...EnemyStomp.imagesWalk,
  ...EnemyStomp.imagesAttack,

  // --- Statusbars ---
  ...BossStatusBar.imagesBossStatus,
  ...EnergyBar.imagesEnergy,
  ...StatusBar.imagesStatus,

  // --- Backgrounds ---
  "img/background/dead/bg_d_1.png",
  "img/background/dead/bg_d_2.png",
  "img/background/dead/bg_d_3.png",
  "img/background/dead/bg_d_4.png",
  "img/background/dead/bg_d_5.png",
  "img/background/dead/bg_d_6.png",
  "img/background/vibrant/bg_v_1.png",
  "img/background/vibrant/bg_v_2.png",
  "img/background/vibrant/bg_v_3.png",
  "img/background/vibrant/bg_v_4.png",
  "img/background/vibrant/bg_v_5.png",
  "img/background/vibrant/bg_v_6.png",
];

function startPreload() {
  const loader = document.getElementById("loading-container");
  if (loader) loader.classList.remove("d_none");

  let loadedCount = 0;
  const totalAssets = IMAGE_ASSETS.length + AUDIO_ASSETS.length;

  if (totalAssets === 0) {
    finishPreload();
    return;
  }

  function updateProgress() {
    loadedCount++;
    const percent = Math.round((loadedCount / totalAssets) * 100);

    const fillBar = document.getElementById("loading-bar-fill");
    const textObj = document.getElementById("loading-text");

    if (fillBar) fillBar.style.width = percent + "%";
    if (textObj) textObj.innerText = `Lade Assets (${percent}%)...`;

    if (loadedCount >= totalAssets) {
      setTimeout(finishPreload, 400);
    }
  }

  IMAGE_ASSETS.forEach((src) => {
    const img = new Image();
    img.onload = updateProgress;
    img.onerror = updateProgress;
    img.src = src;

    if (typeof DrawableObject !== "undefined") {
      DrawableObject.imageCache[src] = img;
    }
  });

  AUDIO_ASSETS.forEach((config) => {
    const audioObj = new Audio();
    audioObj.addEventListener("canplaythrough", updateProgress, { once: true });
    audioObj.addEventListener("error", updateProgress, { once: true });

    audioObj.src = config.path;
    audioObj.loop = config.loop;
    audioObj.volume = config.defaultVolume;
    audioObj.load();

    if (typeof AudioManager !== "undefined") {
      AudioManager.sounds[config.id] = audioObj;
    }
  });
}

function finishPreload() {
  const initScreen = document.getElementById("init-screen");
  if (initScreen) initScreen.classList.add("d_none");

  const startScreen = document.getElementById("start-screen");
  if (startScreen) startScreen.classList.remove("d_none");

  if (typeof AudioManager !== "undefined") {
    AudioManager.applyMuteState();
    AudioManager.isInitialized = true;
  }
}
