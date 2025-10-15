import Phaser from "phaser";

export function createGround(scene: Phaser.Scene) {
  const ground = scene.add
    .tileSprite(0, 450, 3000, 43, "ground_tile")
    .setOrigin(0, 0.5);

  scene.physics.add.existing(ground, true);

  const body = ground.body as Phaser.Physics.Arcade.StaticBody;
  body.updateFromGameObject();

  return ground;
}
