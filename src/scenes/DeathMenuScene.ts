import Phaser from "phaser";
import {
  createForestBackground,
  preloadForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";
import { UIButton } from "../ui/UIButton";

export class DeathMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "DeathMenuScene" });
  }

  preload() {
    preloadForestBackground(this);
  }

  create() {
    createForestBackground(this, false);

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
      text: "Restart",
      onClick: () => this.scene.start("MainScene"),
      width: 180,
    });

    new UIButton({
      scene: this,
      x: this.scale.width / 2,
      y: 400,
      text: "Main Menu",
      onClick: () => this.scene.start("StartMenuScene"),
      width: 180,
    });
  }
}
