import Phaser from "phaser";

interface AudioConfig {
  key: string;
  file: string;
}

export const enemyAudioConfigs: AudioConfig[] = [
  {
    key: "enemy_run_audio",
    file: "forest-footstep.wav",
  },
  {
    key: "enemy_attack_audio",
    file: "enemy-attack.wav",
  },
  {
    key: "enemy_hurt_audio",
    file: "enemy-damage.wav",
  },
];

export function preloadenemySprites(scene: Phaser.Scene) {
  enemyAudioConfigs.forEach((config) => {
    scene.load.audio(config.key, `assets/enemy/${config.file}`);
  });
}
