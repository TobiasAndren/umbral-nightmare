import Phaser from "phaser";

export function preloadPlayerHealth(scene: Phaser.Scene) {
  scene.load.image("full_heart", "assets/ui/full-heart.png");
  scene.load.image("empty_heart", "assets/ui/empty-heart.png");
}
