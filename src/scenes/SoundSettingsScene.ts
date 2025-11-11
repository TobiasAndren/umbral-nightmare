// src/scenes/SoundSettingsScene.ts
import Phaser from "phaser";
import { UIButton } from "../ui/UIButton";
import { VolumeSlider } from "../ui/VolumeSlider";
import {
  preloadForestBackground,
  createForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";
import { GameAudio } from "../helpers/gameAudio/GameAudio";
import { getGameAudio } from "../helpers/gameAudio/gameAudioManager";

export class SoundSettingsScene extends Phaser.Scene {
  private previousSceneKey: string | null = null;
  private audio!: GameAudio;

  constructor() {
    super({ key: "SoundSettingsScene" });
  }

  preload() {
    preloadForestBackground(this);
  }

  init(data: any) {
    this.previousSceneKey = data.previousScene || null;
  }

  create() {
    this.audio = getGameAudio(this);

    const { width, height } = this.scale;

    this.add
      .rectangle(width / 2, height / 2, width, height, 0x16303c)
      .setScrollFactor(0)
      .setDepth(-10);

    createForestBackground(this, false);

    const title = this.add.text(width / 2, 200, "Sound Settings", {
      fontSize: "64px",
      fontFamily: "Metal Mania, serif",
      color: "#ffffff",
    });

    title.setOrigin(0.5);

    new VolumeSlider(
      this,
      width / 2,
      300,
      "Master",
      this.sound.volume,
      (value) => {
        this.sound.volume = value;
      }
    );

    new VolumeSlider(
      this,
      width / 2,
      380,
      "Music",
      this.audio.musicVolume,
      (value) => {
        this.audio.setMusicVolume(value);
      }
    );

    new VolumeSlider(
      this,
      width / 2,
      460,
      "SFX",
      this.audio.sfxVolume,
      (value) => {
        this.audio.setSFXVolume(value);
      }
    );

    new UIButton({
      scene: this,
      x: width / 2,
      y: 550,
      text: "Back",
      onClick: () => {
        this.scene.stop();
        if (this.previousSceneKey) {
          this.scene.resume(this.previousSceneKey);
        } else {
          this.scene.start("SettingsMenuScene");
        }
      },
    });
  }
}
