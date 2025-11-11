import Phaser from "phaser";
import { UIButton } from "../ui/UIButton";
import {
  createForestBackground,
  preloadForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";

export class SettingsMenuScene extends Phaser.Scene {
  private previousSceneKey: string | null = null;

  constructor() {
    super({ key: "SettingsMenuScene" });
  }

  preload() {
    this.load.audio("button_click", "assets/audio/ui/button-click.wav");
    this.load.audio("button_hover", "assets/audio/ui/button-hover.wav");
    preloadForestBackground(this);
  }

  init(data: any) {
    this.previousSceneKey = data.previousScene || null;
  }

  create() {
    const { width, height } = this.scale;
    this.add
      .rectangle(width / 2, height / 2, width, height, 0x16303c)
      .setScrollFactor(0)
      .setDepth(-10);

    createForestBackground(this, false);

    const title = this.add.text(width / 2, 200, "Settings", {
      fontSize: "64px",
      fontFamily: "Metal Mania, serif",
      color: "#ffffff",
    });

    title.setOrigin(0.5);

    new UIButton({
      scene: this,
      x: width / 2,
      y: 325,
      text: "Sound",
      onClick: () => {
        this.scene.pause();
        this.scene.launch("SoundSettingsScene");
      },
    });

    new UIButton({
      scene: this,
      x: width / 2,
      y: 400,
      text: "Controller",
      onClick: () => {
        this.scene.pause();
        this.scene.launch("ControllerSettingsScene");
      },
    });

    new UIButton({
      scene: this,
      x: width / 2,
      y: 475,
      text: "Back",
      onClick: () => {
        this.scene.stop();
        if (this.previousSceneKey) {
          this.scene.resume(this.previousSceneKey);
        } else {
          this.scene.start("StartMenuScene");
        }
      },
    });
  }
}
