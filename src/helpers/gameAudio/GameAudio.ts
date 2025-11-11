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
    if (!this.bgMusic[key].isPlaying) {
      this.bgMusic[key].play();
    }
    return this.bgMusic[key];
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
}
