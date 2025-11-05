import Phaser from "phaser";
import {
  createForestBackground,
  preloadForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";
import { UIButton } from "../ui/UIButton";

export class StartMenuScene extends Phaser.Scene {
  private ambience?: Phaser.Sound.BaseSound;

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

    this.ambience = this.sound.add("menu_ambience", {
      loop: true,
      volume: 0,
    });
    this.ambience.play();

    this.tweens.add({
      targets: this.ambience,
      volume: 0.4,
      duration: 1000,
      ease: "Sine.easeIn",
    });

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
  }

  private handleSceneChange(nextSceneKey: string) {
    if (this.ambience) {
      this.tweens.add({
        targets: this.ambience,
        volume: 0,
        duration: 1000,
        ease: "Sine.easeOut",
        onComplete: () => {
          this.ambience?.stop();
          this.scene.start(nextSceneKey);
        },
      });
    } else {
      this.scene.start(nextSceneKey);
    }
  }
}
