import Phaser from "phaser";
import MainScene from "./scenes/MainScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#1d1d1d",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500, x: 0 },
      debug: false,
    },
  },
  scene: [MainScene],
};

export default new Phaser.Game(config);
