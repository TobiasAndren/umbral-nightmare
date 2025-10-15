import Phaser from "phaser";

export function createGround(scene: Phaser.Scene) {
  // Skapa en TileSprite som upprepar bilden automatiskt
  const ground = scene.add
    .tileSprite(0, 650, 3000, 43, "ground_tile")
    .setOrigin(0, 0.5);

  // Lägg till fysik
  scene.physics.add.existing(ground, true); // true = statisk body

  const body = ground.body as Phaser.Physics.Arcade.StaticBody;
  body.updateFromGameObject();

  return ground;
}
