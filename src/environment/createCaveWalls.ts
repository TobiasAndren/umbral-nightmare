import Phaser from "phaser";

interface WallSegment {
  x: number;
  height: number;
  y?: number;
  side?: "left" | "right";
}

export function createCaveWalls(scene: Phaser.Scene, segments: WallSegment[]) {
  const group = scene.physics.add.staticGroup();

  segments.forEach(({ x, height, y = 270, side = "left" }) => {
    const wallWidth = 27;

    const wall = scene.add
      .tileSprite(x, y, wallWidth, height, "cave_wall_tile")
      .setOrigin(side === "left" ? 0 : 1, 0.5)
      .setFlipX(side === "right");

    scene.physics.add.existing(wall, true);
    const body = wall.body as Phaser.Physics.Arcade.StaticBody;
    body.updateFromGameObject();

    group.add(wall);
  });

  return group;
}
