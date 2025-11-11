export class GameAudio {
  private scene: Phaser.Scene;
  public musicVolume: number = 1;
  public sfxVolume: number = 1;

  public bgMusic: Record<string, Phaser.Sound.BaseSound> = {};
  public sfxSound: Phaser.Sound.BaseSound[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  playMusic(key: string, loop: boolean = true) {
    if (!this.bgMusic[key]) {
      this.bgMusic[key] = this.scene.sound.add(key, {
        loop,
        volume: this.musicVolume,
      });
    }

    const music = this.bgMusic[key];

    if (!music.isPlaying) {
      music.play();
    }
    (music as Phaser.Sound.WebAudioSound).setVolume(this.musicVolume);
    return music;
  }

  stopMusic(key: string) {
    if (this.bgMusic[key]?.isPlaying) {
      this.bgMusic[key].stop();
    }
  }

  setMusicVolume(value: number) {
    this.musicVolume = Phaser.Math.Clamp(value, 0, 1);
    Object.values(this.bgMusic).forEach((music) =>
      (music as Phaser.Sound.WebAudioSound).setVolume(this.musicVolume)
    );
  }

  fadeInMusic(key: string, duration: number = 1000, loop: boolean = true) {
    const music = this.playMusic(key, loop) as Phaser.Sound.WebAudioSound;

    if (this.musicVolume === 0) return;

    if (!music.isPlaying) {
      music.setVolume(0);
      music.play();
    }

    this.scene.tweens.addCounter({
      from: 0,
      to: this.musicVolume,
      duration,
      onUpdate: (tween) => {
        music.setVolume(tween.getValue()!);
      },
    });
  }

  fadeOutMusic(
    key: string,
    duration: number = 1000,
    stopAfter: boolean = true
  ) {
    const music = this.bgMusic[key] as Phaser.Sound.WebAudioSound;
    if (!music || !music.isPlaying) return;

    const startVolume = music.volume;
    this.scene.tweens.addCounter({
      from: startVolume,
      to: 0,
      duration,
      onUpdate: (tween) => {
        const value = tween.getValue()!;
        music.setVolume(value);
      },
      onComplete: () => {
        if (stopAfter) music.stop();
      },
    });
  }

  playSFX(key: string, loop: boolean = false) {
    const sound = this.scene.sound.add(key, {
      volume: this.sfxVolume,
      loop,
    });

    sound.once("destroy", () => {
      this.sfxSound = this.sfxSound.filter((s) => s !== sound);
    });

    this.sfxSound.push(sound);
    sound.play();
    return sound;
  }

  stopSFX(key: string) {
    this.sfxSound.forEach((s) => {
      if (s.key === key && s.isPlaying) s.stop();
    });
  }

  setSFXVolume(value: number) {
    this.sfxVolume = Phaser.Math.Clamp(value, 0, 1);
    this.sfxSound.forEach((s) => {
      (s as Phaser.Sound.WebAudioSound).setVolume(this.sfxVolume);
    });
  }

  stopAllAudio() {
    Object.values(this.bgMusic).forEach((music) => {
      if (music.isPlaying) music.stop();
    });

    this.sfxSound.forEach((sfx) => {
      if (sfx.isPlaying) sfx.stop();
    });

    this.sfxSound = [];
  }
}
