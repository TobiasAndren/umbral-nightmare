import Phaser from "phaser";
import { setupPlayerControls } from "../player/playerController";
import { createPlatforms } from "../environment/platform";
import { preloadPlayerSprites } from "../assets/playerAssets";
import { createPlayerAnimations } from "../player/playerAnimations";
import { preloadShadowEnemySprites } from "../assets/shadowEnemyAssets";
import { createShadowEnemyAnimations } from "../enemies/shadowEnemyAnimations";
import ShadowEnemy from "../enemies/ShadowEnemy";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    preloadPlayerSprites(this);
    preloadShadowEnemySprites(this);
  }

  create() {
    const platforms = createPlatforms(this);

    createPlayerAnimations(this);
    createShadowEnemyAnimations(this);

    const player = this.physics.add.sprite(100, 400, "player_idle");
    player.body.setSize(15, 20);

    const enemies = this.physics.add.group({
      runChildUpdate: true,
    });

    const shadowEnemy = new ShadowEnemy(this, 400, 400);
    shadowEnemy.setPlayer(player);
    shadowEnemy.body?.setSize(20, 20);
    shadowEnemy.body?.setOffset(20, 23);
    enemies.add(shadowEnemy);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemies, platforms);
    this.physics.add.collider(player, enemies);

    this.cameras.main.setZoom(2);
    this.cameras.main.startFollow(player, true, 0.05, 0.05);

    setupPlayerControls(player, this, enemies);

    player.play("idle");
  }
}
