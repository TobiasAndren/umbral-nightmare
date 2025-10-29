import Phaser from "phaser";
import { preloadPlayerHealth } from "../helpers/uiLoaders/preloadPlayerHealth";
import { preloadPlayerSprites } from "../helpers/spriteLoaders/preloadPlayerAssets";
import { preloadBossSprites } from "../helpers/spriteLoaders/preloadBossAssets";
import { setupPlayerControls } from "../player/playerController";
import { createCaveGroundSegments } from "../environment/createCaveGround";
import { createCavePlatforms } from "../environment/createCavePlatforms";
import { setupPlayerHealth } from "../player/playerHealth";
import { createPlayerAnimations } from "../animations/playerAnimations";
import { createBossAnimations } from "../animations/bossAnimations";
import UndeadExecutioner from "../bosses/undeadExecutioner/UndeadExecutioner";
import { preloadCaveTiles } from "../helpers/environmentLoaders/preloadCaveTiles";
import { createCaveCeiling } from "../environment/createCaveCeiling";
import { createCaveWalls } from "../environment/createCaveWalls";
import {
  createCaveBackground,
  preloadCaveBackground,
} from "../helpers/backgroundLoaders/preloadCaveBackground";

export default class BossScene extends Phaser.Scene {
  private backgroundLayers?: {};
  private ground!: Phaser.Physics.Arcade.StaticGroup;
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private ceiling!: Phaser.Physics.Arcade.StaticGroup;
  private player!: Phaser.Physics.Arcade.Sprite;
  private boss!: UndeadExecutioner;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private enemies!: Phaser.Physics.Arcade.Group;

  public addEnemy(enemy: Phaser.Physics.Arcade.Sprite) {
    this.enemies.add(enemy);
  }

  constructor() {
    super("BossScene");
  }

  preload() {
    preloadCaveBackground(this);
    preloadPlayerHealth(this);
    preloadPlayerSprites(this);
    preloadBossSprites(this);
    preloadCaveTiles(this);
  }

  create() {
    this.backgroundLayers = createCaveBackground(this);
    this.ground = createCaveGroundSegments(this, [{ x: 180, width: 750 }]);

    createPlayerAnimations(this);
    createBossAnimations(this);

    const caveBounds = this.physics.add.staticGroup();

    this.ceiling = createCaveCeiling(this, [{ x: 555, width: 750 }]);

    this.walls = createCaveWalls(this, [
      {
        x: 190,
        y: 270,
        height: 370,
        side: "left",
      },
      {
        x: 930,
        y: 270,
        height: 370,
        side: "right",
      },
    ]);

    this.platforms = createCavePlatforms(this, [
      { x: 400, y: 355 },
      { x: 300, y: 275 },
      { x: 400, y: 195 },
      { x: 495, y: 275 },
      { x: 730, y: 195 },
      { x: 830, y: 275 },
      { x: 635, y: 275 },
      { x: 730, y: 355 },
    ]);

    this.player = this.physics.add.sprite(250, 200, "player_idle");
    this.player.body?.setSize(15, 17);
    this.player.setCollideWorldBounds(true);
    this.player.setData("isInvincible");

    this.enemies = this.physics.add.group({
      runChildUpdate: true,
      allowGravity: false,
    });

    this.boss = new UndeadExecutioner(this, 575, 275);
    this.boss.setPlayer(this.player);

    this.boss.body?.setSize(30, 70);

    this.enemies.add(this.boss);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, this.ceiling);
    this.physics.add.collider(this.player, caveBounds);
    this.physics.add.collider(this.boss, this.ground);
    this.physics.add.collider(this.boss, caveBounds);

    this.physics.add.collider(
      this.boss.projectileGroup,
      this.platforms,
      (projectile) => {
        (projectile as Phaser.Physics.Arcade.Sprite).destroy();
      }
    );
    this.physics.add.collider(
      this.boss.projectileGroup,
      this.ground,
      (projectile) => {
        (projectile as Phaser.Physics.Arcade.Sprite).destroy();
      }
    );
    this.physics.add.collider(
      this.boss.projectileGroup,
      caveBounds,
      (projectile) => {
        (projectile as Phaser.Physics.Arcade.Sprite).destroy();
      }
    );
    this.physics.add.overlap(
      this.boss.projectileGroup,
      this.player,
      (playerObj, projectileObj) => {
        const player = playerObj as Phaser.Physics.Arcade.Sprite;
        const projectile = projectileObj as Phaser.Physics.Arcade.Sprite;

        projectile.destroy();
        player.emit("takeDamage", 1, projectile.x);
      }
    );

    setupPlayerControls(this.player, this, this.enemies);
    setupPlayerHealth(this.player, this, 100);

    this.setupCamera();
  }

  update() {
    if (this.boss) {
      this.boss.update();
    }
  }

  private setupCamera() {
    const cam = this.cameras.main;

    const roomLeft = 200;
    const roomRight = 800;
    const roomTop = 0;
    const roomBottom = 540;

    const roomWidth = roomRight - roomLeft;
    const roomHeight = roomBottom - roomTop;

    cam.setBounds(roomLeft, roomTop, roomWidth, roomHeight);

    cam.setZoom(2);

    cam.centerOn((roomLeft + roomRight) / 2, (roomTop + roomBottom) / 2);

    cam.stopFollow();
  }
}
