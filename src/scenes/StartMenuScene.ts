import Phaser from "phaser";
import {
  createForestBackground,
  preloadForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";
import { UIButton } from "../ui/UIButton";

export class StartMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartMenuScene" });
  }

  preload() {
    preloadForestBackground(this);
  }

  create() {
    createForestBackground(this, false);

    const title = this.add.text(this.scale.width / 2, 150, "Umbral Nightmare", {
      fontSize: "64px",
      fontFamily: "Metal Mania, serif",
      color: "#ffffff",
    });
    title.setOrigin(0.5);

    new UIButton({
      scene: this,
      x: this.scale.width / 2,
      y: 350,
      text: "Start Game",
      onClick: () => this.scene.start("MainScene"),
    });
  }
}
