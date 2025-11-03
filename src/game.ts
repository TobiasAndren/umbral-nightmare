import Phaser from "phaser";
import MainScene from "./scenes/MainScene";
import BossScene from "./scenes/BossScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1440,
    height: 684,
  },
  backgroundColor: "#16303c",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500, x: 0 },
      debug: false,
    },
  },
  scene: [MainScene, BossScene],
  render: {
    pixelArt: true,
    roundPixels: true,
  },
};

export default new Phaser.Game(config);
