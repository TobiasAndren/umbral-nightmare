import Phaser from "phaser";

interface AudioConfig {
  key: string;
  file: string;
}

export const playerAudioConfigs: AudioConfig[] = [
  {
    key: "player_run_audio",
    file: "forest-footstep.wav",
  },
  {
    key: "player_attack_audio",
    file: "player-attack.wav",
  },
  {
    key: "player_hurt_audio",
    file: "player-damage.wav",
  },
];

export function preloadPlayerAudio(scene: Phaser.Scene) {
  playerAudioConfigs.forEach((config) => {
    scene.load.audio(config.key, `assets/audio/player/${config.file}`);
  });
}
