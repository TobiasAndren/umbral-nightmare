import Phaser from "phaser";

export function preloadCaveTiles(scene: Phaser.Scene) {
  scene.load.image(
    "cave_platform_tile",
    "assets/environment/cave/cave-platform.png"
  );
  scene.load.image(
    "cave_ground_tile",
    "assets/environment/cave/cave-ground.png"
  );
  scene.load.image("cave_wall_tile", "assets/environment/cave/cave-wall.png");
  scene.load.image(
    "cave_ceiling_tile",
    "assets/environment/cave/cave-ceiling.png"
  );
}
