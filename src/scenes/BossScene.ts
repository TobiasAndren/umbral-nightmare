import Phaser from "phaser";
import { preloadPlayerHealth } from "../helpers/uiLoaders/preloadPlayerHealth";
import { preloadPlayerSprites } from "../helpers/spriteLoaders/preloadPlayerAssets";
import { preloadBossSprites } from "../helpers/spriteLoaders/preloadBossAssets";
import { setupPlayerControls } from "../player/playerController";
import { preloadForestTiles } from "../helpers/environmentLoaders/preloadForestTiles";
import { createForestGroundSegments } from "../environment/createForestGround";
import { setupPlayerHealth } from "../player/playerHealth";
import { createPlayerAnimations } from "../animations/playerAnimations";
import { createBossAnimations } from "../animations/bossAnimations";
import UndeadExecutioner from "../bosses/undeadExecutioner/UndeadExecutioner";
import { createForestPlatforms } from "../environment/createForestPlatforms";

export default class BossScene extends Phaser.Scene {
  private ground!: Phaser.Physics.Arcade.StaticGroup;
  private player!: Phaser.Physics.Arcade.Sprite;
  private boss!: UndeadExecutioner;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super("BossScene");
  }

  preload() {
    preloadPlayerHealth(this);
    preloadPlayerSprites(this);
    preloadBossSprites(this);
    preloadForestTiles(this);
  }

  create() {
    this.ground = createForestGroundSegments(this, [{ x: 200, width: 800 }]);

    createPlayerAnimations(this);
    createBossAnimations(this);

    const caveBounds = this.physics.add.staticGroup();

    caveBounds
      .create(550, 80, "platform")
      .setScale(25, 1)
      .setOrigin(0.5, 0)
      .refreshBody();

    caveBounds
      .create(180, 270, "platform")
      .setScale(1, 11)
      .setOrigin(0, 0.5)
      .refreshBody();

    caveBounds
      .create(940, 270, "platform")
      .setScale(1, 11)
      .setOrigin(1, 0.5)
      .refreshBody();

    this.platforms = createForestPlatforms(this, [
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

    this.boss = new UndeadExecutioner(this, 575, 275);
    this.boss.setPlayer(this.player);

    this.boss.body?.setSize(30, 70);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.ground);
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

    setupPlayerControls(this.player, this);
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
