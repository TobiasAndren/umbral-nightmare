import Phaser from "phaser";

interface AnimConfig {
  key: string;
  frameCount: number;
  frameRate: number;
  repeat: number;
}

export function createBossAnimations(scene: Phaser.Scene) {
  const animations: AnimConfig[] = [
    { key: "boss_idle", frameCount: 4, frameRate: 10, repeat: -1 },
    { key: "boss_skill", frameCount: 12, frameRate: 12, repeat: -1 },
    { key: "boss_attack", frameCount: 11, frameRate: 8, repeat: 0 },
    { key: "boss_death", frameCount: 17, frameRate: 15, repeat: 0 },
    { key: "boss_summon", frameCount: 5, frameRate: 8, repeat: -1 },
    { key: "boss_summon_appear", frameCount: 6, frameRate: 10, repeat: 0 },
    { key: "boss_summon_idle", frameCount: 4, frameRate: 10, repeat: 0 },
    { key: "boss_summon_death", frameCount: 6, frameRate: 10, repeat: 0 },
    { key: "boss_fireball", frameCount: 54, frameRate: 15, repeat: -1 },
  ];

  animations.forEach((anim) => {
    if (anim.key === "boss_attack") {
      scene.anims.create({
        key: anim.key,
        frames: scene.anims.generateFrameNumbers("boss_attack", {
          start: 2,
          end: 12,
        }),
        frameRate: anim.frameRate,
        repeat: anim.repeat,
      });
    } else {
      scene.anims.create({
        key: anim.key,
        frames: scene.anims.generateFrameNumbers(anim.key, {
          start: 0,
          end: anim.frameCount - 1,
        }),
        frameRate: anim.frameRate,
        repeat: anim.repeat,
      });
    }
  });

  scene.anims.create({
    key: "boss_windup",
    frames: scene.anims.generateFrameNumbers("boss_attack", {
      start: 0,
      end: 1,
    }),
    frameRate: 3,
    repeat: 0,
  });
}
