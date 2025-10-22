import Phaser from "phaser";

export function preloadBossSprites(scene: Phaser.Scene) {
  const spriteConfigs = [
    {
      key: "boss_idle",
      file: "boss-idle.png",
      frameWidth: 100,
      frameHeight: 100,
    },
    {
      key: "boss_attack",
      file: "boss-attack.png",
      frameWidth: 100,
      frameHeight: 100,
    },
    {
      key: "boss_skill",
      file: "boss-skill1.png",
      frameWidth: 100,
      frameHeight: 100,
    },
    {
      key: "boss_death",
      file: "boss-death.png",
      frameWidth: 100,
      frameHeight: 100,
    },
    {
      key: "boss_summon",
      file: "boss-summon.png",
      frameWidth: 100,
      frameHeight: 100,
    },
    {
      key: "boss_summon_appear",
      file: "boss-summon-appear.png",
      frameWidth: 50,
      frameHeight: 50,
    },
    {
      key: "boss_summon_death",
      file: "boss-summon-death.png",
      frameWidth: 50,
      frameHeight: 50,
    },
    {
      key: "boss_summon_idle",
      file: "boss-summon-idle.png",
      frameWidth: 50,
      frameHeight: 50,
    },
  ];

  spriteConfigs.forEach((config) => {
    scene.load.spritesheet(config.key, `/assets/boss/${config.file}`, {
      frameWidth: config.frameWidth,
      frameHeight: config.frameHeight,
    });
  });
}
