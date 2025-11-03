import Phaser from "phaser";
import MainScene from "./scenes/MainScene";
import BossScene from "./scenes/BossScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  scale: {
    mode: Phaser.Scale.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1440,
    height: 684,
  },
  backgroundColor: "#16303c",
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500, x: 0 },
      fps: 60,
      timeScale: 1,
      debug: false,
    },
  },
  scene: [MainScene, BossScene],
  render: {
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    powerPreference: "low-power",
  },
};

export default new Phaser.Game(config);
