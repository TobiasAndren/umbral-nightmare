import Phaser from "phaser";
import {
  createForestBackground,
  preloadForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";
import { UIButton } from "../ui/UIButton";

export class DeathMenuScene extends Phaser.Scene {
  private ambience?: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: "DeathMenuScene" });
  }

  preload() {
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
      duration: 2000,
      ease: "Sine.easeIn",
    });

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
      onClick: () => this.handleSceneChange("MainScene"),
      width: 180,
    });

    new UIButton({
      scene: this,
      x: this.scale.width / 2,
      y: 400,
      text: "Main Menu",
      onClick: () => this.handleSceneChange("StartMenuScene"),
      width: 180,
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
