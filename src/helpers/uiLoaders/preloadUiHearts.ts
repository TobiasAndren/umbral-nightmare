import Phaser from "phaser";

export function preloadUiHearts(scene: Phaser.Scene) {
  scene.load.image("full_heart", "assets/ui/full-heart.png");
  scene.load.image("empty_heart", "assets/ui/empty-heart.png");
  scene.load.image("boss_full_heart", "assets/ui/boss-full-heart.png");
}
