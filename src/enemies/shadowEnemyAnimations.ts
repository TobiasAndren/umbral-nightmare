import Phaser from "phaser";

interface AnimConfig {
  key: string;
  frameCount: number;
  frameRate: number;
  repeat: number;
}

export function createShadowEnemyAnimations(scene: Phaser.Scene) {
  const animations: AnimConfig[] = [
    { key: "shadow_idle", frameCount: 8, frameRate: 10, repeat: -1 },
    { key: "shadow_walk", frameCount: 8, frameRate: 12, repeat: -1 },
    { key: "shadow_attack1", frameCount: 10, frameRate: 15, repeat: 0 },
    { key: "shadow_jump", frameCount: 3, frameRate: 10, repeat: 0 },
    { key: "shadow_death", frameCount: 14, frameRate: 10, repeat: 0 },
  ];

  animations.forEach((anim) => {
    scene.anims.create({
      key: anim.key,
      frames: scene.anims.generateFrameNumbers(anim.key, {
        start: 0,
        end: anim.frameCount - 1,
      }),
      frameRate: anim.frameRate,
      repeat: anim.repeat,
    });
  });
}
