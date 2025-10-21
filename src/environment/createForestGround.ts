import Phaser from "phaser";

interface GroundSegment {
  x: number;
  width: number;
  y?: number;
}

export function createForestGroundSegments(
  scene: Phaser.Scene,
  segments: GroundSegment[]
) {
  const group = scene.physics.add.staticGroup();

  segments.forEach(({ x, width, y = 500 }) => {
    const groundHeight = 150;

    const ground = scene.add
      .tileSprite(x, y, width, groundHeight, "forest_ground_tile")
      .setOrigin(0, 0.5);

    const leftEdge = scene.add
      .image(x, y, "forest_ground_edge_left")
      .setOrigin(0, 0.5);
    const rightEdge = scene.add
      .image(x + width, y, "forest_ground_edge_right")
      .setOrigin(1, 0.5);

    scene.physics.add.existing(ground, true);
    const body = ground.body as Phaser.Physics.Arcade.StaticBody;
    body.updateFromGameObject();

    group.add(ground);
  });

  return group;
}
