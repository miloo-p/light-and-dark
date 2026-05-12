let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let uiManager = new UIManager();

const PreloadState = {
  loadedCount: 0,
  totalAssets: 0,
};

const IMAGE_ASSETS = [
  "./img/homepage_background.jpg",
  "./img/game-logo.png",
  "./img/ui/sound.svg",
  "./img/ui/sound-mute.svg",

  ...ShadowCharacter.imagesIdle,
  ...ShadowCharacter.imagesWalk,
  ...ShadowCharacter.imagesJump,
  ...ShadowCharacter.imagesHurt,
  ...ShadowCharacter.imagesDead,

  "img/characters/shadow/projectile/shadow_projectile.png",
  ...MeleeSlashObject.imagesSlash,
  ...EnemyBossProjectileObject.imagesFly,
  ...EnemyPlantProjectileObject.imagesFly,

  ...EnemyEndboss.imagesIdle,
  ...EnemyEndboss.imagesWalk,
  ...EnemyEndboss.imagesDead,
  ...EnemyEndboss.imagesHurt,
  ...EnemyEndboss.imagesShoot,

  ...EnemyPlant.imagesAttack,
  ...EnemyPlant.imagesHurt,
  ...EnemyPlant.imagesDead,

  ...EnemyStomp.imagesIdle,
  ...EnemyStomp.imagesWalk,
  ...EnemyStomp.imagesAttack,

  ...BossStatusBar.imagesBossStatus,
  ...EnergyBar.imagesEnergy,
  ...StatusBar.imagesStatus,

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

function initStartGame() {
  resetGame();
  initLevel();
  setupWorld();
  startBackgroundAudio();
}

function resetGame() {
  keyboard.unlockAndReset();
  MovableObject.stopAllIntervals();
}

function setupWorld() {
  canvas = document.getElementById("game-canvas");
  world = new World(canvas, keyboard);
  world.isGamePaused = false;
}

function startBackgroundAudio() {
  AudioManager.initAudioManager();
  AudioManager.playLayer("horror_ambience", "ambience_layer");
  AudioManager.playLayer("winter_ruins", "music_layer");
}

function startPreload() {
  showLoadingUI();

  PreloadState.totalAssets = IMAGE_ASSETS.length + AUDIO_ASSETS.length;
  PreloadState.loadedCount = 0;

  if (PreloadState.totalAssets === 0) {
    finishPreload();
    return;
  }

  loadAllImages();
  loadAllAudio();
}

function loadAllImages() {
  IMAGE_ASSETS.forEach((src) => {
    const img = new Image();
    img.onload = onAssetLoaded;
    img.onerror = onAssetLoaded;
    img.src = src;

    if (typeof DrawableObject !== "undefined") {
      DrawableObject.imageCache[src] = img;
    }
  });
}

function loadAllAudio() {
  AUDIO_ASSETS.forEach((config) => {
    const audioObj = new Audio();
    audioObj.addEventListener("canplaythrough", onAssetLoaded, { once: true });
    audioObj.addEventListener("error", onAssetLoaded, { once: true });

    audioObj.src = config.path;
    audioObj.loop = config.loop;
    audioObj.volume = config.defaultVolume;
    audioObj.load();

    if (typeof AudioManager !== "undefined") {
      AudioManager.sounds[config.id] = audioObj;
    }
  });
}

function onAssetLoaded() {
  PreloadState.loadedCount++;

  const percent = Math.round((PreloadState.loadedCount / PreloadState.totalAssets) * 100);
  updateLoadingUI(percent);

  if (PreloadState.loadedCount >= PreloadState.totalAssets) {
    setTimeout(finishPreload, 400);
  }
}

function showLoadingUI() {
  const loader = document.getElementById("loading-container");
  if (loader) loader.classList.remove("d_none");
}

function updateLoadingUI(percent) {
  const fillBar = document.getElementById("loading-bar-fill");
  const textObj = document.getElementById("loading-text");

  if (fillBar) fillBar.style.width = `${percent}%`;
  if (textObj) textObj.innerText = `Lade Assets (${percent}%)...`;
}

function finishPreload() {
  const initScreen = document.getElementById("init-screen");
  const startScreen = document.getElementById("start-screen");

  if (initScreen) initScreen.classList.add("d_none");
  if (startScreen) startScreen.classList.remove("d_none");

  if (typeof AudioManager !== "undefined") {
    AudioManager.applyMuteState();
    AudioManager.isInitialized = true;
  }
}
