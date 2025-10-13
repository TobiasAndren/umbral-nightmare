import Phaser from "phaser";

export function createPlayerAnimations(scene: Phaser.Scene) {
  const anims = [
    {
      key: "idle",
      sheet: "player_idle",
      start: 0,
      end: 6,
      frameRate: 10,
      repeat: -1,
    },
    {
      key: "run",
      sheet: "player_run",
      start: 0,
      end: 7,
      frameRate: 15,
      repeat: -1,
    },
    {
      key: "attack",
      sheet: "player_attack",
      start: 0,
      end: 9,
      frameRate: 20,
      repeat: 0,
    },
    {
      key: "jump",
      sheet: "player_jump",
      start: 0,
      end: 3,
      frameRate: 10,
      repeat: 0,
    },
    {
      key: "fall",
      sheet: "player_fall",
      start: 0,
      end: 3,
      frameRate: 10,
      repeat: -1,
    },
    {
      key: "hurt",
      sheet: "player_hurt",
      start: 0,
      end: 2,
      frameRate: 10,
      repeat: 0,
    },
  ];

  anims.forEach((a) =>
    scene.anims.create({
      key: a.key,
      frames: scene.anims.generateFrameNumbers(a.sheet, {
        start: a.start,
        end: a.end,
      }),
      frameRate: a.frameRate,
      repeat: a.repeat,
    })
  );
}
