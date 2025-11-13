import Phaser from "phaser";
import { UIButton } from "../ui/UIButton";
import {
  createForestBackground,
  preloadForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";
import { getGameAudio } from "../helpers/gameAudio/gameAudioManager";
import { GameState } from "../helpers/gameState_temp";

export class PauseMenuScene extends Phaser.Scene {
  private previousSceneKey: string | null = null;

  constructor() {
    super({ key: "PauseMenuScene" });
  }

  preload() {
    this.load.audio("button_click", "assets/audio/ui/button-click.wav");
    this.load.audio("button_hover", "assets/audio/ui/button-hover.wav");
    preloadForestBackground(this);
  }

  init(data: any) {
    this.previousSceneKey = data.previousSceneKey || null;
  }

  create() {
    createForestBackground(this, false);

    const { width, height } = this.scale;

    this.add
      .rectangle(width / 2, height / 2, width, height, 0x16303c)
      .setScrollFactor(0)
      .setDepth(-10);

    const title = this.add.text(this.scale.width / 2, 200, "Game Paused", {
      fontSize: "64px",
      fontFamily: "Metal Mania, serif",
      color: "#ffffff",
    });
    title.setOrigin(0.5);

    new UIButton({
      scene: this,
      x: this.scale.width / 2,
      y: 325,
      text: "Resume Game",
      onClick: () => {
        this.scene.stop();
        if (this.previousSceneKey) {
          this.scene.resume(this.previousSceneKey);
        }
      },
    });

    new UIButton({
      scene: this,
      x: this.scale.width / 2,
      y: 400,
      text: "Settings",
      onClick: () => {
        this.scene.pause();
        this.scene.launch("SettingsMenuScene", {
          previousScene: "PauseMenuScene",
        });
      },
    });

    new UIButton({
      scene: this,
      x: this.scale.width / 2,
      y: 475,
      text: "Quit Game",
      onClick: () => {
        const gameAudio = getGameAudio(this);

        if (this.previousSceneKey) {
          this.scene.stop(this.previousSceneKey);

          if (this.previousSceneKey === "MainScene") {
            gameAudio.stopMusic("forest_ambience");
          } else if (this.previousSceneKey === "BossScene") {
            gameAudio.stopMusic("cave_ambience");
          }
        }

        this.cameras.main.fadeOut(500, 0, 0, 0);

        this.time.delayedCall(500, () => {
          GameState.lastCheckpointIndex = 0;
          GameState.activatedCheckpoints.clear();
          this.scene.stop();
          this.scene.start("StartMenuScene");
        });
      },
    });
  }
}
