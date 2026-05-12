/**
 * Global static manager responsible for handling all game audio.
 * Manages sound effects (SFX), looping ambient layers, and persistent mute states.
 * @class
 */
class AudioManager {
  /**
   * Registry of all loaded HTMLAudioElement instances, keyed by their asset ID.
   * @static
   * @type {Object.<string, HTMLAudioElement>}
   */
  static sounds = {};

  /**
   * Tracks currently playing looping sounds (layers) to allow independent control.
   * @static
   * @type {Object.<string, HTMLAudioElement>}
   */
  static activeLayers = {};

  /**
   * Prevents multiple initializations of the audio library.
   * @static
   * @type {boolean}
   */
  static isInitialized = false;

  /**
   * Key used for storing the mute preference in the browser's localStorage.
   * @static
   * @type {string}
   */
  static muteStorageKey = "lightAndShadowMute";

  /**
   * Current mute state, initialized from localStorage.
   * @static
   * @type {boolean}
   */
  static isMuted = localStorage.getItem(AudioManager.muteStorageKey) === "true";

  /**
   * Synchronizes the `muted` property of all registered audio objects with the global state.
   * @static
   */
  static applyMuteState() {
    Object.values(this.sounds).forEach((sound) => {
      sound.muted = this.isMuted;
    });
  }

  /**
   * Preloads all audio assets defined in `AUDIO_ASSETS` and configures their volumes/loops.
   * Should be called once during the initial game boot sequence.
   * @static
   */
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
   * Resets the playback time to zero if the sound is already playing.
   * @static
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
   * If the layer is already occupied, the previous sound is stopped first.
   * @static
   * @param {string} soundKey - The ID of the sound asset to play.
   * @param {string} layerName - The name of the layer (e.g., 'music_layer' or 'player_walk_layer').
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
   * Stops the sound playback for a specific layer and resets its progress.
   * @static
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

  /**
   * Toggles the global mute state, persists the preference to localStorage,
   * and updates all active audio instances.
   * @static
   */
  static toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem(this.muteStorageKey, String(this.isMuted));
    this.applyMuteState();
  }
}
