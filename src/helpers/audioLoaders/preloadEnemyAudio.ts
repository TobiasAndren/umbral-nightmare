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
    file: "enemy-attack.mp3",
  },
  {
    key: "enemy_hurt_audio",
    file: "demon-damage.wav",
  },
];

export function preloadEnemyAudio(scene: Phaser.Scene) {
  enemyAudioConfigs.forEach((config) => {
    scene.load.audio(config.key, `assets/audio/enemy/${config.file}`);
  });
}
