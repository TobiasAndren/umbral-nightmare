import Phaser from "phaser";
import { UIButton } from "../ui/UIButton";
import {
  createForestBackground,
  preloadForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";

export class PauseMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "PauseMenuScene" });
  }

  preload() {
    this.load.audio("button_click", "assets/audio/ui/button-click.wav");
    this.load.audio("button_hover", "assets/audio/ui/button-hover.wav");
    preloadForestBackground(this);
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
        this.scene.resume("MainScene");
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
        this.scene.stop();
        this.scene.stop("MainScene");
        this.scene.start("StartMenuScene");
      },
    });
  }
}
