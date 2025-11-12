import Phaser from "phaser";

interface SpriteConfig {
  key: string;
  file: string;
  frames: { frameWidth: number; frameHeight: number };
}

export const checkpointCrystalConfigs: SpriteConfig[] = [
  {
    key: "green_crystal",
    file: "green-crystal.png",
    frames: { frameWidth: 64, frameHeight: 64 },
  },
  {
    key: "red_crystal",
    file: "red-crystal.png",
    frames: { frameWidth: 64, frameHeight: 64 },
  },
];

export function preloadCheckpointCrystal(scene: Phaser.Scene) {
  checkpointCrystalConfigs.forEach((config) => {
    scene.load.spritesheet(
      config.key,
      `assets/environment/checkpoints/${config.file}`,
      config.frames
    );
  });
}
