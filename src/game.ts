import Phaser from "phaser";
import MainScene from "./scenes/MainScene";
import BossScene from "./scenes/BossScene";
import { StartMenuScene } from "./scenes/StartMenuScene";
import { DeathMenuScene } from "./scenes/DeathMenuScene";
import { WinMenuScene } from "./scenes/WinMenuScene";
import { PauseMenuScene } from "./scenes/PauseMenuScene";
import { SettingsMenuScene } from "./scenes/SettingsMenuScene";
import { SoundSettingsScene } from "./scenes/SoundSettingsScene";

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
      fps: 60,
      timeScale: 1,
      debug: false,
    },
  },
  scene: [
    StartMenuScene,
    MainScene,
    BossScene,
    DeathMenuScene,
    WinMenuScene,
    PauseMenuScene,
    SettingsMenuScene,
    SoundSettingsScene,
  ],
  render: {
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    powerPreference: "high-performance",
  },
};

export default new Phaser.Game(config);
