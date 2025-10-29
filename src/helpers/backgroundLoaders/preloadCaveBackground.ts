import Phaser from "phaser";

export function preloadCaveBackground(scene: Phaser.Scene) {
  for (let i = 1; i <= 9; i++) {
    scene.load.image(
      `cave_layer_${i}`,
      `assets/backgrounds/cave/layers/${i}.png`
    );
  }
}

export function createCaveBackground(scene: Phaser.Scene) {
  const cam = scene.cameras.main;
  const { width, height } = cam;

  const layers: Phaser.GameObjects.Image[] = [];

  for (let i = 1; i <= 9; i++) {
    const key = `cave_layer_${i}`;
    const image = scene.add
      .image(width / 2, height / 2, key)
      .setScrollFactor(0)
      .setDepth(-10 + i);

    const scaleX = width / image.width;
    const scaleY = height / image.height;
    const scale = Math.max(scaleX, scaleY) * 0.5;

    image.setScale(scale);
    layers.push(image);
  }

  const overlay = scene.add
    .rectangle(0, 0, width, height, 0x000000, 0.2)
    .setOrigin(0)
    .setScrollFactor(0)
    .setDepth(0);

  return [...layers, overlay];
}
