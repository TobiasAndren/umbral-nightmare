import Phaser from "phaser";
import {
  createForestBackground,
  preloadForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";
import { UIButton } from "../ui/UIButton";
import type { GameAudio } from "../helpers/gameAudio/GameAudio";
import { getGameAudio } from "../helpers/gameAudio/gameAudioManager";
import { GameState } from "../helpers/gameState_temp";

export class DeathMenuScene extends Phaser.Scene {
  private audio?: GameAudio;

  constructor() {
    super({ key: "DeathMenuScene" });
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

    this.audio.playMusic("menu_ambience");

    const title = this.add.text(this.scale.width / 2, 200, "You Died", {
      fontSize: "64px",
      fontFamily: "Metal Mania, serif",
      color: "#ff5555",
      stroke: "#000000",
      strokeThickness: 6,
    });

    title.setOrigin(0.5);

    new UIButton({
      scene: this,
      x: this.scale.width / 2,
      y: 325,
      text: "Try Again",
      onClick: () => {
        this.audio?.stopMusic("menu_ambience");
        this.scene.start("MainScene", {
          checkpointIndex: GameState.lastCheckpointIndex,
        });
      },
    });

    new UIButton({
      scene: this,
      x: this.scale.width / 2,
      y: 400,
      text: "Main Menu",
      onClick: () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);

        this.time.delayedCall(500, () => {
          GameState.lastCheckpointIndex = 0;
          GameState.activatedCheckpoints.clear();
          this.scene.stop();
          this.audio?.stopMusic("menu_ambience");
          this.scene.start("StartMenuScene");
        });
      },
    });
  }
}
