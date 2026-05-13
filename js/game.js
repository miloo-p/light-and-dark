/** @type {HTMLCanvasElement} The main game canvas element. */
let canvas;

/** @type {CanvasRenderingContext2D} The 2D drawing context of the canvas. */
let ctx;

/** @type {World} The main game world instance containing all logic and entities. */
let world;

/** @type {Keyboard} Global instance to track user input. */
let keyboard = new Keyboard();

/** @type {UIManager} Global instance to handle UI transitions and DOM overlays. */
let uiManager = new UIManager();

/**
 * Global state object to track the progress of the asset preloading sequence.
 * @type {{loadedCount: number, totalAssets: number}}
 */
const PreloadState = {
  loadedCount: 0,
  totalAssets: 0,
};

/**
 * A comprehensive list of all image file paths required for the game.
 * Uses spread operators to collect static image arrays from various classes.
 * @constant
 * @type {string[]}
 */
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

/**
 * Initializes the game start sequence.
 * Resets existing states, builds the level, sets up the world context, and starts audio.
 */
function initStartGame() {
  resetGame();
  initLevel();
  setupWorld();
  startBackgroundAudio();
}

/**
 * Cleans up the current game state.
 * Unlocks the keyboard, stops all running intervals, and clears the old world
 * to prevent memory leaks or logic overlaps.
 */
function resetGame() {
  keyboard.unlockAndReset();

  // 1. Gegner & Projektile stoppen
  if (typeof MovableObject !== "undefined") {
    MovableObject.stopAllIntervals();
  }

  // 2. WICHTIG: Die Endlosschleifen der alten Welt killen!
  if (typeof world !== "undefined" && world !== null) {
    world.clearWorld();
  }
}

/**
 * Binds the canvas to the application and instantiates the World class.
 */
function setupWorld() {
  canvas = document.getElementById("game-canvas");
  world = new World(canvas, keyboard);
  world.isGamePaused = false;
}

/**
 * Initializes the global AudioManager and begins playing the default ambient and music layers.
 */
function startBackgroundAudio() {
  if (typeof AudioManager !== "undefined") {
    AudioManager.initAudioManager();
    AudioManager.playLayer("horror_ambience", "ambience_layer");
    AudioManager.playLayer("winter_ruins", "music_layer");
  }
}

/**
 * Main entry point for the asset preloading process.
 * Calculates the total asset count and initiates loading for both images and audio.
 */
function startPreload() {
  showLoadingUI();

  let audioLength = typeof AUDIO_ASSETS !== "undefined" ? AUDIO_ASSETS.length : 0;
  PreloadState.totalAssets = IMAGE_ASSETS.length + audioLength;
  PreloadState.loadedCount = 0;

  if (PreloadState.totalAssets === 0) {
    finishPreload();
    return;
  }

  loadAllImages();
  loadAllAudio();
}

/**
 * Iterates through all specified image assets and triggers their loading.
 * Successfully loaded images are stored in the DrawableObject cache.
 */
function loadAllImages() {
  IMAGE_ASSETS.forEach((src) => {
    const img = new Image();
    img.onload = onAssetLoaded;
    img.onerror = onAssetLoaded; // Ensure progress continues even if an asset fails
    img.src = src;

    if (typeof DrawableObject !== "undefined") {
      DrawableObject.imageCache[src] = img;
    }
  });
}

/**
 * Iterates through all specified audio assets and triggers their loading.
 * Configures the Audio objects and stores them in the AudioManager registry.
 */
function loadAllAudio() {
  if (typeof AUDIO_ASSETS === "undefined") return;

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

/**
 * Callback function triggered every time an asset (image or audio) finishes loading.
 * Updates the loading UI and initiates completion once the total count is reached.
 */
function onAssetLoaded() {
  PreloadState.loadedCount++;

  const percent = Math.round((PreloadState.loadedCount / PreloadState.totalAssets) * 100);
  updateLoadingUI(percent);

  if (PreloadState.loadedCount >= PreloadState.totalAssets) {
    setTimeout(finishPreload, 400); // Slight delay for visual polish
  }
}

/**
 * Reveals the loading screen overlay.
 */
function showLoadingUI() {
  const loader = document.getElementById("loading-container");
  if (loader) loader.classList.remove("d_none");
}

/**
 * Updates the visual progress bar and text on the loading screen.
 * @param {number} percent - The current loading progress in percent (0-100).
 */
function updateLoadingUI(percent) {
  const fillBar = document.getElementById("loading-bar-fill");
  const textObj = document.getElementById("loading-text");

  if (fillBar) fillBar.style.width = `${percent}%`;
  if (textObj) textObj.innerText = `Lade Assets (${percent}%)...`;
}

/**
 * Cleans up the preloading UI and transitions the player to the main start screen.
 * Finalizes the AudioManager state.
 */
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
