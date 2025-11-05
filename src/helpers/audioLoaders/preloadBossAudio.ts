import Phaser from "phaser";

interface AudioConfig {
  key: string;
  file: string;
}

export const bossAudioConfigs: AudioConfig[] = [
  {
    key: "boss_skill_audio",
    file: "boss-skill.wav",
  },
  {
    key: "boss_attack_audio",
    file: "boss-attack.mp3",
  },
  {
    key: "boss_summon_audio",
    file: "boss-summon.wav",
  },
  {
    key: "boss_hurt_audio",
    file: "boss-damage.wav",
  },
  {
    key: "summon_hurt_audio",
    file: "demon-damage.wav",
  },
];

export function preloadBossAudio(scene: Phaser.Scene) {
  bossAudioConfigs.forEach((config) => {
    scene.load.audio(config.key, `assets/audio/boss/${config.file}`);
  });
}
