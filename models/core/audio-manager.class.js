/**
 * Global static manager responsible for handling all game audio.
 * @class
 */
class AudioManager {
  /** @type {Object.<string, HTMLAudioElement>} */
  static sounds = {};

  /** @type {Object.<string, HTMLAudioElement>} */
  static activeLayers = {};

  /** @type {boolean} */
  static isInitialized = false;

  /** @type {string} */
  static muteStorageKey = "lightAndShadowMute";

  /** @type {boolean} */
  static isMuted = localStorage.getItem(AudioManager.muteStorageKey) === "true";

  /** Synchronizes the muted property of all audio objects with the global state. */
  static applyMuteState() {
    Object.values(this.sounds).forEach((sound) => {
      sound.muted = this.isMuted;
    });
  }

  /** Preloads audio assets from AUDIO_ASSETS and configures them. */
  static initAudioManager() {
    if (this.isInitialized) return;

    AUDIO_ASSETS.forEach((config) => {
      const audioObj = new Audio(config.path);
      audioObj.loop = config.loop;
      audioObj.volume = config.defaultVolume;

      this.sounds[config.id] = audioObj;
    });

    this.applyMuteState();
    this.isInitialized = true;
  }

  /**
   * Plays a one-shot sound effect.
   * @param {string} soundKey - The ID of the sound asset to play.
   */
  static playSFX(soundKey) {
    const targetSound = this.sounds[soundKey];
    if (targetSound) {
      targetSound.currentTime = 0;
      targetSound.play().catch(() => {
        /* Browser policy might block autoplay until user interaction */
      });
    }
  }

  /**
   * Starts playing a looping sound assigned to a specific layer.
   * @param {string} soundKey - The ID of the sound asset to play.
   * @param {string} layerName - The name of the layer (e.g., 'music_layer').
   */
  static playLayer(soundKey, layerName) {
    this.stopLayer(layerName);

    const targetSound = this.sounds[soundKey];
    if (targetSound) {
      targetSound.loop = true;
      this.activeLayers[layerName] = targetSound;
      targetSound.play().catch(() => {
        /* Silently catch autoplay blocking errors */
      });
    }
  }

  /**
   * Stops the sound playback for a specific layer and resets it.
   * @param {string} layerName - The name of the layer to stop.
   */
  static stopLayer(layerName) {
    const playingSound = this.activeLayers[layerName];
    if (playingSound) {
      playingSound.pause();
      playingSound.currentTime = 0;
      delete this.activeLayers[layerName];
    }
  }

  /** Toggles the global mute state and saves preference to localStorage. */
  static toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem(this.muteStorageKey, String(this.isMuted));
    this.applyMuteState();
  }
}
