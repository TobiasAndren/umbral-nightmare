import Phaser from "phaser";

interface GroundSegment {
  x: number;
  width: number;
  y?: number;
}

export function createCaveGroundSegments(
  scene: Phaser.Scene,
  segments: GroundSegment[]
) {
  const group = scene.physics.add.staticGroup();

  segments.forEach(({ x, width, y = 675 }) => {
    const groundHeight = 500;

    const ground = scene.add
      .tileSprite(x, y, width, groundHeight, "cave_ground_tile")
      .setOrigin(0, 0.5);

    scene.physics.add.existing(ground, true);
    const body = ground.body as Phaser.Physics.Arcade.StaticBody;
    body.updateFromGameObject();

    group.add(ground);
  });

  return group;
}
