import Phaser from "phaser";

export function createGround(scene: Phaser.Scene) {
  const groundY = 500;
  const groundWidth = 3000;
  const groundHeight = 150;

  // Tilead mittsektion
  const ground = scene.add
    .tileSprite(0, groundY, groundWidth, groundHeight, "ground_tile")
    .setOrigin(0, 0.5);

  // Lägg till vänster- och högerkant som egna sprites
  const leftEdge = scene.add
    .image(0, groundY, "ground_edge_left")
    .setOrigin(0, 0.5);
  const rightEdge = scene.add
    .image(groundWidth, groundY, "ground_edge_right")
    .setOrigin(1, 0.5);

  // Lägg till fysik
  scene.physics.add.existing(ground, true);
  const body = ground.body as Phaser.Physics.Arcade.StaticBody;
  body.updateFromGameObject();

  return { ground, leftEdge, rightEdge };
}
