import Phaser from "phaser";

export function createPlatforms(scene: Phaser.Scene) {
  const platforms = scene.physics.add.staticGroup();

  // Mark
  const ground = platforms.create(400, 550, undefined);
  ground.setDisplaySize(3000, 50);
  ground.refreshBody();

  return platforms;
}
