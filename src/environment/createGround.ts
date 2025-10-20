import Phaser from "phaser";

interface GroundSegment {
  x: number;
  width: number;
  y?: number;
}

export function createGroundSegments(
  scene: Phaser.Scene,
  segments: GroundSegment[]
) {
  const group = scene.physics.add.staticGroup();

  segments.forEach(({ x, width, y = 500 }) => {
    const groundHeight = 150;

    // TileSprite för marken
    const ground = scene.add
      .tileSprite(x, y, width, groundHeight, "ground_tile")
      .setOrigin(0, 0.5);

    // Vänster och höger kant
    const leftEdge = scene.add
      .image(x, y, "ground_edge_left")
      .setOrigin(0, 0.5);
    const rightEdge = scene.add
      .image(x + width, y, "ground_edge_right")
      .setOrigin(1, 0.5);

    // Lägg till fysik för marken
    scene.physics.add.existing(ground, true);
    const body = ground.body as Phaser.Physics.Arcade.StaticBody;
    body.updateFromGameObject();

    // Lägg till i gruppen
    group.add(ground);
  });

  return group;
}
