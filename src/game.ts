import Phaser from "phaser";
import MainScene from "./scenes/MainScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#1d1d1d",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500, x: 0 },
      debug: true,
    },
  },
  scene: [MainScene],
  render: { pixelArt: true, roundPixels: true },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export default new Phaser.Game(config);
