import Phaser from "phaser";

interface ButtonConfig {
  x: number;
  y: number;
  text: string;
  scene: Phaser.Scene;
  onClick: () => void;
  width?: number;
  height?: number;
  fontSize?: string;
}

export class UIButton {
  private scene: Phaser.Scene;
  private bg: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;

  private hoverSound?: Phaser.Sound.BaseSound;
  private clickSound?: Phaser.Sound.BaseSound;

  constructor({
    x,
    y,
    text,
    scene,
    onClick,
    width = 180,
    height,
    fontSize = "32px",
  }: ButtonConfig) {
    this.scene = scene;

    this.hoverSound = scene.sound.add("button_hover", { volume: 1 });
    this.clickSound = scene.sound.add("button_click", { volume: 0.5 });

    this.text = scene.add
      .text(x, y, text, {
        fontSize: fontSize,
        fontFamily: "Metal Mania, serif",
        color: "#ffffff",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5);

    const bgWidth = width ?? this.text.width + 5;
    const bgHeight = height ?? this.text.height + 5;

    this.bg = scene.add
      .rectangle(
        x,
        y,
        bgWidth,
        bgHeight,
        Phaser.Display.Color.HexStringToColor("#1c3c4b").color
      )
      .setStrokeStyle(1, 0xffffff)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.bg.setDepth(0);
    this.text.setDepth(1);

    this.addInteractivity(onClick);
  }

  private addInteractivity(onClick: () => void) {
    this.bg.on("pointerover", () => {
      this.hoverSound?.play();
      this.scene.tweens.add({
        targets: [this.text, this.bg],
        scale: 1.03,
        duration: 200,
        ease: "Sine.easeInOut",
      });

      const colorObj = { value: 0 };
      this.scene.tweens.add({
        targets: colorObj,
        value: 1,
        duration: 200,
        ease: "Sine.easeInOut",
        onUpdate: () => {
          const color = Phaser.Display.Color.Interpolate.ColorWithColor(
            Phaser.Display.Color.HexStringToColor("#1c3c4b"),
            Phaser.Display.Color.HexStringToColor("#98484b"),
            1,
            colorObj.value
          );
          this.bg.fillColor = Phaser.Display.Color.GetColor(
            color.r,
            color.g,
            color.b
          );
        },
      });
    });

    this.bg.on("pointerout", () => {
      this.scene.tweens.add({
        targets: [this.text, this.bg],
        scale: 1.0,
        duration: 200,
        ease: "Sine.easeInOut",
      });

      const colorObj = { value: 0 };
      this.scene.tweens.add({
        targets: colorObj,
        value: 1,
        duration: 200,
        ease: "Sine.easeInOut",
        onUpdate: () => {
          const color = Phaser.Display.Color.Interpolate.ColorWithColor(
            Phaser.Display.Color.HexStringToColor("#98484b"),
            Phaser.Display.Color.HexStringToColor("#1c3c4b"),
            1,
            colorObj.value
          );
          this.bg.fillColor = Phaser.Display.Color.GetColor(
            color.r,
            color.g,
            color.b
          );
        },
      });
    });

    this.bg.on("pointerdown", () => {
      this.clickSound?.play();
      onClick();
    });
  }
}
