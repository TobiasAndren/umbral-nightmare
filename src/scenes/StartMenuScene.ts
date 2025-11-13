import Phaser from "phaser";
import {
  createForestBackground,
  preloadForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";
import { UIButton } from "../ui/UIButton";
import type { GameAudio } from "../helpers/gameAudio/GameAudio";
import { getGameAudio } from "../helpers/gameAudio/gameAudioManager";

export class StartMenuScene extends Phaser.Scene {
  private audio?: GameAudio;

  constructor() {
    super({ key: "StartMenuScene" });
  }

  preload() {
    this.load.audio("button_click", "assets/audio/ui/button-click.wav");
    this.load.audio("button_hover", "assets/audio/ui/button-hover.wav");
    this.load.audio("menu_ambience", "assets/audio/ambience/menu-ambience.wav");
    preloadForestBackground(this);
  }

  create() {
    createForestBackground(this, false);

    this.audio = getGameAudio(this);

    this.audio.setMusicVolume(this.audio.musicVolume);

    this.audio.playMusic("menu_ambience");

    const title = this.add.text(this.scale.width / 2, 200, "Umbral Nightmare", {
      fontSize: "64px",
      fontFamily: "Metal Mania, serif",
      color: "#ffffff",
    });
    title.setOrigin(0.5);

    new UIButton({
      scene: this,
      x: this.scale.width / 2,
      y: 325,
      text: "Start Game",
      onClick: () => this.handleSceneChange("MainScene"),
    });

    new UIButton({
      scene: this,
      x: this.scale.width / 2,
      y: 400,
      text: "Settings",
      onClick: () => {
        this.scene.pause();
        this.scene.launch("SettingsMenuScene", {
          previousScene: "StartMenuScene",
        });
      },
    });

    this.events.once("shutdown", () => {
      this.audio?.stopAllAudio();
    });
  }

  private handleSceneChange(nextSceneKey: string) {
    this.audio?.fadeOutMusic("menu_ambience", 1100);

    this.cameras.main.fadeOut(1200, 0, 0, 0);

    this.time.delayedCall(1200, () => {
      this.scene.start(nextSceneKey);
    });
  }
}
