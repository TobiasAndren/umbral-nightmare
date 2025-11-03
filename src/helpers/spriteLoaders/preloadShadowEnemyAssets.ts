import Phaser from "phaser";

export function preloadShadowEnemySprites(scene: Phaser.Scene) {
  const spriteConfigs = [
    {
      key: "shadow_idle",
      file: "shadow-idle.png",
      frameWidth: 64,
      frameHeight: 64,
    },
    {
      key: "shadow_walk",
      file: "shadow-walk.png",
      frameWidth: 64,
      frameHeight: 64,
    },
    {
      key: "shadow_attack1",
      file: "shadow-attack.png",
      frameWidth: 64,
      frameHeight: 64,
    },
    {
      key: "shadow_hurt",
      file: "shadow-hurt.png",
      frameWidth: 64,
      frameHeight: 64,
    },
    {
      key: "shadow_death",
      file: "shadow-death.png",
      frameWidth: 64,
      frameHeight: 64,
    },
  ];

  spriteConfigs.forEach((config) => {
    scene.load.spritesheet(
      config.key,
      `/assets/enemies/shadow-enemy/${config.file}`,
      {
        frameWidth: config.frameWidth,
        frameHeight: config.frameHeight,
      }
    );
  });
}
