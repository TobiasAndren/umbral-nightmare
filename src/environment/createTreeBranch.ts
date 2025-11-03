import Phaser from "phaser";

export function createTreeBranch(
  scene: Phaser.Scene,
  platformPositions: { x: number; y: number }[],
  side?: string
) {
  const platforms = scene.physics.add.staticGroup();

  for (const pos of platformPositions) {
    const platform = platforms.create(pos.x, pos.y, "tree_branch");
    platform.setScale(1);
    platform.refreshBody();
    platform.setFlipX(side === "right");
  }

  return platforms;
}
