import Phaser from "phaser";
import {
  createForestBackground,
  preloadForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";
import { UIButton } from "../ui/UIButton";
import { GameState } from "../helpers/GameState";
import type { GameAudio } from "../helpers/gameAudio/GameAudio";
import { getGameAudio } from "../helpers/gameAudio/gameAudioManager";

export class WinMenuScene extends Phaser.Scene {
  private audio?: GameAudio;

  constructor() {
    super({ key: "WinMenuScene" });
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

    this.audio.fadeInMusic("menu_ambience", 5000);

    const title = this.add.text(this.scale.width / 2, 200, "You Win!", {
      fontSize: "64px",
      fontFamily: "Metal Mania, serif",
      color: "#55ff55",
      stroke: "#000000",
      strokeThickness: 6,
    });
    title.setOrigin(0.5);

    new UIButton({
      scene: this,
      x: this.scale.width / 2,
      y: 325,
      text: "Play Again",
      onClick: () => {
        GameState.lastCheckpointIndex = 0;
        this.cameras.main.fadeOut(1200, 0, 0, 0);
        this.audio?.fadeOutMusic("menu_ambience", 1000);
        this.time.delayedCall(1200, () => {
          this.scene.start("MainScene");
        });
      },
    });

    new UIButton({
      scene: this,
      x: this.scale.width / 2,
      y: 400,
      text: "Main Menu",
      onClick: () => {
        GameState.lastCheckpointIndex = 0;
        this.cameras.main.fadeOut(1200, 0, 0, 0);
        this.audio?.fadeOutMusic("menu_ambience", 1000);
        this.time.delayedCall(1200, () => {
          this.scene.start("StartMenuScene");
        });
      },
    });

    this.events.once("shutdown", () => {
      this.audio?.stopAllAudio();
    });
  }
}
