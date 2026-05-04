class AudioManager {
  static sounds = {};
  static activeLayers = {};
  static isInitialized = false;
  static isMuted = false;

  static initAudioManager() {
    if (this.isInitialized) return;

    AUDIO_ASSETS.forEach((config) => {
      const audioObj = new Audio(config.path);
      audioObj.loop = config.loop;
      audioObj.volume = config.defaultVolume;

      this.sounds[config.id] = audioObj;
    });

    this.isInitialized = true;
    console.log(`AudioManager ready. Loaded ${Object.keys(this.sounds).length} sounds.`);
  }

  static playSFX(soundKey) {
    const targetSound = this.sounds[soundKey];
    if (targetSound) {
      targetSound.currentTime = 0;
      targetSound.play().catch(() => {});
    }
  }

  static playLayer(soundKey, layerName) {
    this.stopLayer(layerName);

    const targetSound = this.sounds[soundKey];
    if (targetSound) {
      targetSound.loop = true;
      this.activeLayers[layerName] = targetSound;
      targetSound.play().catch(() => {});
    }
  }

  static stopLayer(layerName) {
    const playingSound = this.activeLayers[layerName];
    if (playingSound) {
      playingSound.pause();
      playingSound.currentTime = 0;
      delete this.activeLayers[layerName];
    }
  }

  static toggleMute() {
    this.isMuted = !this.isMuted;

    Object.values(this.sounds).forEach((sound) => {
      sound.muted = this.isMuted;
    });

    console.log(`AudioManager: All sounds are now ${this.isMuted ? "MUTED" : "UNMUTED"}.`);
  }
}
