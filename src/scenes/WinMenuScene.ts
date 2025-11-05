import Phaser from "phaser";
import {
  createForestBackground,
  preloadForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";
import { UIButton } from "../ui/UIButton";

export class WinMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "WinMenuScene" });
  }

  preload() {
    this.load.audio("button_click", "assets/audio/ui/button-click.wav");
    this.load.audio("button_hover", "assets/audio/ui/button-hover.wav");
    preloadForestBackground(this);
  }

  create() {
    createForestBackground(this, false);

    const title = this.add.text(this.scale.width / 2, 150, "You Win!", {
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
      width: 180,
      onClick: () => this.scene.start("MainScene"),
    });

    new UIButton({
      scene: this,
      x: this.scale.width / 2,
      y: 400,
      text: "Main Menu",
      width: 180,
      onClick: () => this.scene.start("StartMenuScene"),
    });
  }
}
