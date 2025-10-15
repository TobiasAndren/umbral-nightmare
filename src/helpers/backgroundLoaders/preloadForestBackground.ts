import Phaser from "phaser";

export function preloadForestBackground(scene: Phaser.Scene) {
  scene.load.image(
    "forest_bg",
    "assets/backgrounds/layers/parallax-demon-woods-bg.png"
  );
  scene.load.image(
    "close_trees",
    "assets/backgrounds/layers/parallax-demon-woods-close-trees.png"
  );
  scene.load.image(
    "far_trees",
    "assets/backgrounds/layers/parallax-demon-woods-far-trees.png"
  );
  scene.load.image(
    "mid_trees",
    "assets/backgrounds/layers/parallax-demon-woods-mid-trees.png"
  );
}

export function createForestBackground(scene: Phaser.Scene) {
  const width = scene.scale.width;
  const height = scene.scale.height;

  const bgImageHeight = scene.textures.get("forest_bg").getSourceImage().height;
  const farImageHeight = scene.textures
    .get("far_trees")
    .getSourceImage().height;
  const midImageHeight = scene.textures
    .get("mid_trees")
    .getSourceImage().height;
  const closeImageHeight = scene.textures
    .get("close_trees")
    .getSourceImage().height;

  const offsetY = 30;

  const bgY = (height - bgImageHeight) / 2 - offsetY;
  const farY = (height - farImageHeight) / 2 - offsetY;
  const midY = (height - midImageHeight) / 2 - offsetY;
  const closeY = (height - closeImageHeight) / 2 - offsetY;

  const bg = scene.add
    .tileSprite(0, bgY, width, bgImageHeight, "forest_bg")
    .setOrigin(0, 0)
    .setScrollFactor(0, 0)
    .setDepth(-3);

  const far = scene.add
    .tileSprite(0, farY, width, farImageHeight, "far_trees")
    .setOrigin(0, 0)
    .setScrollFactor(0, 0)
    .setDepth(-2);

  const mid = scene.add
    .tileSprite(0, midY, width, midImageHeight, "mid_trees")
    .setOrigin(0, 0)
    .setScrollFactor(0, 0)
    .setDepth(-1);

  const close = scene.add
    .tileSprite(0, closeY, width, closeImageHeight, "close_trees")
    .setOrigin(0, 0)
    .setScrollFactor(0, 0)
    .setDepth(0);

  return { bg, far, mid, close };
}
