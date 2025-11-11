import Phaser from "phaser";

export function createCavePlatforms(
  scene: Phaser.Scene,
  platformPositions: { x: number; y: number }[]
) {
  const platforms = scene.physics.add.staticGroup();

  for (const pos of platformPositions) {
    const platform = platforms.create(pos.x, pos.y, "cave_platform_tile");
    platform.setScale(0.7);
    platform.refreshBody();
  }

  return platforms;
}
