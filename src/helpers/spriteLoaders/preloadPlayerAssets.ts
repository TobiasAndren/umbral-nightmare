import Phaser from "phaser";

interface SpriteConfig {
  key: string;
  file: string;
  frames: { frameWidth: number; frameHeight: number };
}

export const playerSpriteConfigs: SpriteConfig[] = [
  {
    key: "player_idle",
    file: "Idle.png",
    frames: { frameWidth: 144, frameHeight: 144 },
  },
  {
    key: "player_run",
    file: "Run.png",
    frames: { frameWidth: 144, frameHeight: 144 },
  },
  {
    key: "player_attack",
    file: "Attack-1.png",
    frames: { frameWidth: 144, frameHeight: 144 },
  },
  {
    key: "player_jump",
    file: "Jump.png",
    frames: { frameWidth: 144, frameHeight: 144 },
  },
  {
    key: "player_fall",
    file: "Fall.png",
    frames: { frameWidth: 144, frameHeight: 144 },
  },
  {
    key: "player_hurt",
    file: "Hurt.png",
    frames: { frameWidth: 144, frameHeight: 144 },
  },
  {
    key: "player_death",
    file: "Death.png",
    frames: { frameWidth: 144, frameHeight: 144 },
  },
];

export function preloadPlayerSprites(scene: Phaser.Scene) {
  playerSpriteConfigs.forEach((config) => {
    scene.load.spritesheet(
      config.key,
      `assets/player/${config.file}`,
      config.frames
    );
  });
}
