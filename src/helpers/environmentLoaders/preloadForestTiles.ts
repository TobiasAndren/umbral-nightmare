import Phaser from "phaser";

export function preloadForestTiles(scene: Phaser.Scene) {
  scene.load.image("platform_tile", "assets/environment/platform-tile.png");
  scene.load.image("ground_tile", "assets/environment/ground-tile.png");
  scene.load.image(
    "ground_edge_left",
    "assets/environment/ground-edge-left.png"
  );
  scene.load.image(
    "ground_edge_right",
    "assets/environment/ground-edge-right.png"
  );
}
