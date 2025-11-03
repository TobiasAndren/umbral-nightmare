export function createCaveCeiling(
  scene: Phaser.Scene,
  segments: { x: number; width: number; y?: number }[]
) {
  const group = scene.physics.add.staticGroup();

  segments.forEach(({ x, width, y = -137 }) => {
    const ceilingHeight = 500;

    const ceiling = scene.add.tileSprite(
      x,
      y,
      width,
      ceilingHeight,
      "cave_ceiling_tile"
    );

    scene.physics.add.existing(ceiling, true);
    const body = ceiling.body as Phaser.Physics.Arcade.StaticBody;
    body.updateFromGameObject();

    group.add(ceiling);
  });

  return group;
}
