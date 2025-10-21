import Phaser from "phaser";
import { setupPlayerControls } from "../player/playerController";
import { createGroundSegments } from "../environment/createGround";
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
import { createPlatforms } from "../environment/createPlatforms";
import { preloadPlayerHealth } from "../helpers/uiLoaders/preloadPlayerHealth";
import { setupPlayerHealth } from "../player/playerHealth";

export default class MainScene extends Phaser.Scene {
  private backgroundLayers?: {
    bg: Phaser.GameObjects.TileSprite;
    far: Phaser.GameObjects.TileSprite;
    mid: Phaser.GameObjects.TileSprite;
    close: Phaser.GameObjects.TileSprite;
  };

  private player!: Phaser.Physics.Arcade.Sprite;
  private enemies!: Phaser.Physics.Arcade.Group;
  private ground!: Phaser.Physics.Arcade.StaticGroup;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private targetCamY: number = 0;

  constructor() {
    super("MainScene");
  }

  preload() {
    preloadForestBackground(this);
    preloadPlayerSprites(this);
    preloadShadowEnemySprites(this);
    preloadForestTiles(this);
    preloadPlayerHealth(this);
  }

  create() {
    this.backgroundLayers = createForestBackground(this);

    this.ground = createGroundSegments(this, [
      { x: 0, width: 800 },
      { x: 1000, width: 600 },
      { x: 1900, width: 700 },
      { x: 3400, width: 1000, y: 300 },
    ]);

    this.platforms = createPlatforms(this, [
      { x: 900, y: 375 },
      { x: 1700, y: 365 },
      { x: 1800, y: 390 },
      { x: 2700, y: 375 },
      { x: 2850, y: 345 },
      { x: 3000, y: 315 },
      { x: 3150, y: 285 },
      { x: 3300, y: 255 },
    ]);

    createPlayerAnimations(this);
    createShadowEnemyAnimations(this);

    this.player = this.physics.add.sprite(250, 400, "player_idle");
    this.player.body?.setSize(15, 17);

    this.enemies = this.physics.add.group({
      runChildUpdate: true,
    });

    const enemyPositions = [
      { x: 600, y: 400 },
      { x: 700, y: 400 },
      { x: 1200, y: 400 },
      { x: 1500, y: 380 },
      { x: 2000, y: 400 },
      { x: 3700, y: 200 },
      { x: 4000, y: 200 },
    ];

    enemyPositions.forEach((pos) => {
      const enemy = new ShadowEnemy(this, pos.x, pos.y);
      enemy.setPlayer(this.player);
      enemy.body?.setSize(15, 20);
      enemy.body?.setOffset(25, 20);
      this.enemies.add(enemy);
    });

    this.physics.add.collider(this.player, this.ground!);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.ground!);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.player, this.enemies);

    this.cameras.main.setZoom(2.5);
    this.cameras.main.startFollow(this.player, true, 0.2, 0, -50, 30);

    setupPlayerHealth(this.player, this, 5);
    setupPlayerControls(this.player, this, this.enemies);

    this.player.play("idle");
  }

  update() {
    const backgroundLayers = this.backgroundLayers;
    const cam = this.cameras.main;

    if (backgroundLayers) {
      backgroundLayers.far.tilePositionX = cam.scrollX * 0.2;
      backgroundLayers.mid.tilePositionX = cam.scrollX * 0.4;
      backgroundLayers.close.tilePositionX = cam.scrollX * 0.7;
    }

    if (this.player.x >= 2300 && this.player.x <= 3600) {
      this.targetCamY = this.player.y - 375;
    } else {
      this.targetCamY = cam.scrollY;
    }

    if (this.targetCamY !== undefined) {
      cam.scrollY = Phaser.Math.Linear(cam.scrollY, this.targetCamY, 0.05);
    }
  }
}
