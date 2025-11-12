import Phaser from "phaser";

export function createCheckpointCrystalAnimations(scene: Phaser.Scene) {
  const anims = [
    {
      key: "green_crystal",
      sheet: "green_crystal",
      start: 0,
      end: 3,
      frameRate: 5,
      repeat: -1,
    },
    {
      key: "red_crystal",
      sheet: "red_crystal",
      start: 0,
      end: 3,
      frameRate: 5,
      repeat: -1,
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
