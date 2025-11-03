import Phaser from "phaser";

export function preloadForestTiles(scene: Phaser.Scene) {
  scene.load.image(
    "forest_platform_tile",
    "assets/environment/forest/platform-tile.png"
  );
  scene.load.image(
    "forest_ground_tile",
    "assets/environment/forest/ground-tile.png"
  );
  scene.load.image(
    "forest_ground_edge_left",
    "assets/environment/forest/ground-edge-left.png"
  );
  scene.load.image(
    "forest_ground_edge_right",
    "assets/environment/forest/ground-edge-right.png"
  );
  scene.load.image("tree", "assets/environment/forest/tree.png");
  scene.load.image("tree_branch", "assets/environment/forest/tree-branch.png");
  scene.load.image("ground_hole", "assets/environment/forest/ground-hole.png");
}
