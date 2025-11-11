import Phaser from "phaser";
import { UIButton } from "./UIButton";

export class VolumeSlider {
  private bar: Phaser.GameObjects.Rectangle;
  private handle: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;
  private valueText: Phaser.GameObjects.Text;
  private value: number = 1;
  private lastValue: number = 1;

  private hoverSound?: Phaser.Sound.BaseSound;
  private clickSound?: Phaser.Sound.BaseSound;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    labelText: string,
    initialValue: number,
    onChange: (value: number) => void
  ) {
    this.value = Phaser.Math.Clamp(initialValue, 0, 1);
    this.lastValue = this.value;

    this.hoverSound = scene.sound.get("button_hover");
    this.clickSound = scene.sound.get("button_click");

    this.label = scene.add.text(x - 200, y, labelText, {
      fontSize: "28px",
      color: "#ffffff",
      fontFamily: "Metal Mania, serif",
    });
    this.label.setOrigin(0, 0.5);

    this.valueText = scene.add
      .text(x + 150, y, `${Math.round(this.value * 100)}%`, {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Metal Mania, serif",
      })
      .setOrigin(0.5);

    this.bar = scene.add.rectangle(x, y, 200, 8, 0x888888);
    this.bar.setOrigin(0.5);

    this.handle = scene.add
      .rectangle(x - 100 + this.value * 200, y, 20, 20, 0xffffff)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true, draggable: true });

    scene.input.setDraggable(this.handle);

    this.handle.on("pointerover", () => {
      this.handle.setFillStyle(0x98484b);
      this.hoverSound?.play();
    });

    this.handle.on("pointerout", () => {
      this.handle.setFillStyle(0xffffff);
    });

    this.handle.on("pointerdown", () => {
      this.clickSound?.play();
    });

    scene.input.on("drag", (_pointer: any, gameObject: any, dragX: number) => {
      if (gameObject !== this.handle) return;

      const clampedX = Phaser.Math.Clamp(dragX, x - 100, x + 100);
      this.handle.x = clampedX;

      const newValue = (clampedX - (x - 100)) / 200;
      this.value = newValue;
      this.valueText.setText(`${Math.round(this.value * 100)}%`);
      this.lastValue = this.value;
      onChange(this.value);
    });

    new UIButton({
      x: x + 220,
      y: y,
      scene: scene,
      text: "Mute",
      width: 50,
      height: 40,
      fontSize: "18px",
      onClick: () => {
        if (this.value > 0) {
          this.lastValue = this.value;
          this.value = 0;
        } else {
          this.value = this.lastValue;
        }

        this.handle.x = x - 100 + this.value * 200;

        this.valueText.setText(`${Math.round(this.value * 100)}%`);
        onChange(this.value);
      },
    });
  }

  getValue() {
    return this.value;
  }
}
