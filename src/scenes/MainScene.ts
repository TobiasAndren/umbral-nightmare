import Phaser from "phaser";
import { setupPlayerControls } from "../player/playerController";
import { createGround } from "../environment/ground";
import { preloadPlayerSprites } from "../helpers/spriteLoaders/preloadPlayerAssets";
import { createPlayerAnimations } from "../player/playerAnimations";
import { preloadShadowEnemySprites } from "../helpers/spriteLoaders/preloadShadowEnemyAssets";
import { createShadowEnemyAnimations } from "../enemies/shadowEnemyAnimations";
import ShadowEnemy from "../enemies/ShadowEnemy";
import {
  createForestBackground,
  preloadForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";
import { preloadForestTiles } from "../helpers/environmentLoaders/preloadForestTiles";

export default class MainScene extends Phaser.Scene {
  private backgroundLayers?: {
    bg: Phaser.GameObjects.TileSprite;
    far: Phaser.GameObjects.TileSprite;
    mid: Phaser.GameObjects.TileSprite;
    close: Phaser.GameObjects.TileSprite;
  };

  constructor() {
    super("MainScene");
  }

  preload() {
    preloadForestBackground(this);
    preloadPlayerSprites(this);
    preloadShadowEnemySprites(this);
    preloadForestTiles(this);
  }

  update() {
    const backgroundLayers = this.backgroundLayers;
    const cam = this.cameras.main;

    if (backgroundLayers) {
      backgroundLayers.far.tilePositionX = cam.scrollX * 0.2;
      backgroundLayers.mid.tilePositionX = cam.scrollX * 0.4;
      backgroundLayers.close.tilePositionX = cam.scrollX * 0.7;
    }
  }

  create() {
    this.backgroundLayers = createForestBackground(this);

    const ground = createGround(this);

    createPlayerAnimations(this);
    createShadowEnemyAnimations(this);

    const player = this.physics.add.sprite(100, 400, "player_idle");
    player.body.setSize(15, 17);

    const enemies = this.physics.add.group({
      runChildUpdate: true,
    });

    const shadowEnemy = new ShadowEnemy(this, 400, 400);
    shadowEnemy.setPlayer(player);
    shadowEnemy.body?.setSize(20, 20);
    shadowEnemy.body?.setOffset(20, 20);

    enemies.add(shadowEnemy);

    this.physics.add.collider(player, ground!);
    this.physics.add.collider(enemies, ground!);
    this.physics.add.collider(player, enemies);

    this.cameras.main.setZoom(2.5);
    this.cameras.main.startFollow(player, true, 0.2, 0.2, -50, 30);

    setupPlayerControls(player, this, enemies);

    player.play("idle");
  }
}
