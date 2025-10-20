import Phaser from "phaser";

export function createPlatforms(
  scene: Phaser.Scene,
  platformPositions: { x: number; y: number }[]
) {
  const platforms = scene.physics.add.staticGroup();

  for (const pos of platformPositions) {
    const platform = platforms.create(pos.x, pos.y, "platform_tile");
    platform.setScale(0.5);
    platform.refreshBody();
  }

  return platforms;
}
