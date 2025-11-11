import Phaser from "phaser";
import { UIButton } from "../ui/UIButton";
import {
  getAllPresets,
  setActivePreset,
  getActivePreset,
} from "../config/controllerConfig";
import {
  createForestBackground,
  preloadForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";

export class ControllerSettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: "ControllerSettingsScene" });
  }

  preload() {
    preloadForestBackground(this);
    this.load.image(
      "controller1",
      "assets/ui/controllers/controller-config1.png"
    );

    this.load.image(
      "controller2",
      "assets/ui/controllers/controller-config2.png"
    );
  }

  create() {
    const { width, height } = this.scale;
    this.add
      .rectangle(width / 2, height / 2, width, height, 0x16303c)
      .setScrollFactor(0)
      .setDepth(-10);

    createForestBackground(this, false);
    const presets = getAllPresets();
    const current = getActivePreset();

    this.add
      .text(width / 2, 200, "Controller Settings", {
        fontSize: "64px",
        color: "#ffffff",
        fontFamily: "Metal Mania, serif",
      })
      .setOrigin(0.5);

    const imgKey = current === presets.default ? "controller1" : "controller2";
    this.add.image(width / 2 - 450, 325, imgKey).setOrigin(0.5, 0.5);

    let y = 325;

    (Object.keys(presets) as (keyof typeof presets)[]).forEach((preset) => {
      new UIButton({
        scene: this,
        x: width / 2,
        y,
        text:
          preset.charAt(0).toUpperCase() +
          preset.slice(1) +
          (presets[preset] === current ? " (Active)" : ""),
        onClick: () => {
          setActivePreset(preset);
          this.scene.restart();
        },
        width: 210,
      });
      y += 75;
    });

    new UIButton({
      scene: this,
      x: width / 2,
      y,
      text: "Back",
      onClick: () => {
        this.scene.stop();
        this.scene.resume("SettingsMenuScene");
      },
    });
  }
}
