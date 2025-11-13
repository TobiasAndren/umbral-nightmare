import Phaser from "phaser";
import { setupPlayerControls } from "../player/playerController";
import { createForestGroundSegments } from "../environment/createForestGround";
import { preloadPlayerSprites } from "../helpers/spriteLoaders/preloadPlayerAssets";
import { createPlayerAnimations } from "../animations/playerAnimations";
import { preloadShadowEnemySprites } from "../helpers/spriteLoaders/preloadShadowEnemyAssets";
import { createShadowEnemyAnimations } from "../animations/shadowEnemyAnimations";
import ShadowEnemy from "../enemies/ShadowEnemy";
import {
  createForestBackground,
  preloadForestBackground,
} from "../helpers/backgroundLoaders/preloadForestBackground";
import { preloadForestTiles } from "../helpers/environmentLoaders/preloadForestTiles";
import { createForestPlatforms } from "../environment/createForestPlatforms";
import { preloadPlayerHealth } from "../helpers/uiLoaders/preloadPlayerHealth";
import { setupPlayerHealth } from "../player/playerHealth";
import { createTreeBranch } from "../environment/createTreeBranch";
import { preloadPlayerAudio } from "../helpers/audioLoaders/preloadPlayerAudio";
import { preloadEnemyAudio } from "../helpers/audioLoaders/preloadEnemyAudio";
import { GameAudio } from "../helpers/gameAudio/GameAudio";
import { GameState } from "../helpers/gameState_temp";
import { preloadCheckpointCrystal } from "../helpers/environmentLoaders/preloadCheckpointCrystal";
import { createCheckpointCrystalAnimations } from "../animations/checkpointCrystalAnimations";

export default class MainScene extends Phaser.Scene {
  private backgroundLayers?: {
    bg: Phaser.GameObjects.TileSprite;
    far: Phaser.GameObjects.TileSprite;
    mid: Phaser.GameObjects.TileSprite;
    close: Phaser.GameObjects.TileSprite;
  };

  private checkpoints: { x: number; y: number }[] = [
    { x: 100, y: 160 },
    { x: 2400, y: 400 },
    { x: 4700, y: 200 },
  ];

  private audio?: GameAudio;

  private player!: Phaser.Physics.Arcade.Sprite;
  private enemies!: Phaser.Physics.Arcade.Group;
  private ground!: Phaser.Physics.Arcade.StaticGroup;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;

  private levelEnd!: Phaser.GameObjects.Zone & {
    body: Phaser.Physics.Arcade.Body;
  };
  private transitioning: boolean = false;

  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.audio(
      "forest_ambience",
      "assets/audio/ambience/forest-ambience.wav"
    );
    this.load.audio(
      "checkpoint_activated",
      "assets/audio/effects/checkpoint-activated.wav"
    );
    preloadPlayerAudio(this);
    preloadEnemyAudio(this);
    preloadForestBackground(this);
    preloadPlayerSprites(this);
    preloadShadowEnemySprites(this);
    preloadForestTiles(this);
    preloadPlayerHealth(this);
    preloadCheckpointCrystal(this);
  }

  create(data?: { checkpointIndex: number }) {
    const spawnIndex =
      data?.checkpointIndex ?? GameState.lastCheckpointIndex ?? 0;

    const spawnPoint = this.checkpoints[spawnIndex];

    this.cameras.main.fadeIn(1200, 0, 0, 0);
    this.audio = new GameAudio(this);

    this.audio.setMusicVolume(this.audio.musicVolume);
    this.audio.setSFXVolume(this.audio.sfxVolume);

    this.time.delayedCall(800, () => {
      this.audio?.fadeInMusic("forest_ambience", 5000);
    });

    this.backgroundLayers = createForestBackground(this, true);

    const startTreeX = 0;
    const startTreeY = 190;

    const treeTrunk = this.physics.add.staticImage(
      startTreeX,
      startTreeY,
      "tree"
    );
    treeTrunk.setScale(1);
    treeTrunk.refreshBody();
    treeTrunk.setSize(treeTrunk.width, treeTrunk.height);
    treeTrunk.setOffset(0, 0);

    const startBranch = createTreeBranch(
      this,
      [{ x: startTreeX + 90, y: startTreeY }],
      "right"
    );

    const endTreeX = 5000;
    const endtreeY = -230;

    const endTreeTrunk = this.physics.add.staticImage(
      endTreeX,
      endtreeY,
      "tree"
    );
    endTreeTrunk.setScale(1.5);

    const endTreeBranches = createTreeBranch(this, [
      { x: endTreeX - 75, y: 155 },
      { x: endTreeX - 75, y: -5 },
      { x: endTreeX - 75, y: -165 },
      { x: endTreeX - 75, y: -325 },
    ]);

    const endTreeBranchesRight = createTreeBranch(
      this,
      [
        { x: endTreeX + 90, y: 75 },
        { x: endTreeX + 90, y: -85 },
        { x: endTreeX + 90, y: -245 },
        { x: endTreeX + 90, y: -405 },
        { x: endTreeX + 190, y: -405 },
        { x: endTreeX + 280, y: -405 },
        { x: endTreeX + 380, y: -405 },
      ],
      "right"
    );

    this.ground = createForestGroundSegments(this, [
      { x: -200, width: 1000 },
      { x: 1000, width: 600 },
      { x: 1900, width: 700 },
      { x: 3400, width: 1700, y: 300 },
      { x: 5500, width: 400, y: 200 },
    ]);

    const holeX = 5600 + 105;
    const holeY = 200 - 35;
    const holeWidth = 400;
    const holeHeight = 80;

    const holeImage = this.add.image(holeX, holeY, "ground_hole");
    holeImage.setDepth(3);
    holeImage.setOrigin(0.5, 0.5);
    holeImage.setScale(1);

    this.levelEnd = this.add.zone(
      holeX,
      holeY,
      holeWidth,
      holeHeight
    ) as Phaser.GameObjects.Zone & {
      body: Phaser.Physics.Arcade.Body;
    };

    this.physics.add.existing(this.levelEnd);
    this.levelEnd.body.setAllowGravity(false);
    this.levelEnd.body.setImmovable(true);

    this.platforms = createForestPlatforms(this, [
      { x: 900, y: 375 },
      { x: 1700, y: 365 },
      { x: 1800, y: 390 },
      { x: 2700, y: 375 },
      { x: 2850, y: 345 },
      { x: 3000, y: 315 },
      { x: 3150, y: 285 },
      { x: 3300, y: 255 },
    ]);

    createCheckpointCrystalAnimations(this);
    createPlayerAnimations(this);
    createShadowEnemyAnimations(this);

    this.player = this.physics.add.sprite(
      spawnPoint.x,
      spawnPoint.y,
      "player_idle"
    );
    this.player.body?.setSize(15, 15);
    this.player.setDepth(1);

    this.player.setTint(0xffffff);

    this.enemies = this.physics.add.group({
      runChildUpdate: true,
    });

    const enemyPositions = [
      { x: 600, y: 400 },
      { x: 700, y: 400 },
      { x: 1200, y: 400 },
      { x: 1500, y: 380 },
      { x: 2000, y: 400 },
      { x: 3800, y: 200 },
      { x: 4000, y: 200 },
    ];

    enemyPositions.forEach((pos) => {
      const enemy = new ShadowEnemy(this, pos.x, pos.y, this.audio);
      enemy.setPlayer(this.player);
      enemy.body?.setSize(15, 20);
      enemy.body?.setOffset(25, 20);
      this.enemies.add(enemy);
    });

    this.physics.add.collider(this.player, this.ground!);
    this.physics.add.collider(this.player, treeTrunk);
    this.physics.add.collider(this.player, startBranch);
    this.physics.add.collider(this.player, endTreeBranches);
    this.physics.add.collider(this.player, endTreeBranchesRight);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.ground!);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.player, this.enemies);

    this.cameras.main.setZoom(2.25);
    this.cameras.main.startFollow(this.player, true, 1, 1, -50, 0);
    this.cameras.main.setDeadzone(0, 100);

    setupPlayerHealth(this.player, this, 5, 410, 195, this.audio);
    setupPlayerControls(this.player, this, this.enemies, this.audio);

    this.player.play("idle");

    this.checkpoints.forEach((point, index) => {
      const isActivated = GameState.activatedCheckpoints.has(index);

      const crystal = this.add.sprite(
        point.x,
        point.y,
        isActivated ? "green_crystal" : "red_crystal"
      );
      crystal.play(isActivated ? "green_crystal" : "red_crystal");
      crystal.setDepth(1.5);
      crystal.setScale(0.5);

      const checkpointZone = this.add.zone(point.x, point.y, 50, 50);
      this.physics.add.existing(checkpointZone);
      (checkpointZone.body as Phaser.Physics.Arcade.Body).setAllowGravity(
        false
      );
      (checkpointZone.body as Phaser.Physics.Arcade.Body).setImmovable(true);

      this.physics.add.overlap(this.player, checkpointZone, () => {
        if (GameState.activatedCheckpoints.has(index)) return;

        GameState.activatedCheckpoints.add(index);
        GameState.lastCheckpointIndex = index;

        this.audio?.playSFX("checkpoint_activated");
        crystal.setTexture("green_crystal");
        crystal.play("green_crystal");
      });
    });

    this.physics.add.overlap(this.player, this.levelEnd, () => {
      this.startTransition();
    });

    this.events.once("shutdown", () => {
      this.audio?.stopAllAudio();
    });
  }

  update() {
    const cam = this.cameras.main;

    if (this.backgroundLayers) {
      const { far, mid, close } = this.backgroundLayers;

      far.tilePositionX = cam.scrollX * 0.2;
      mid.tilePositionX = cam.scrollX * 0.4;
      close.tilePositionX = cam.scrollX * 0.7;
    }
  }

  private startTransition() {
    if (this.transitioning) return;

    this.transitioning = true;

    this.player.setVelocity(0, 0);
    this.player.body!.enable = false;

    const music = this.audio?.playMusic("forest_ambience");

    this.tweens.add({
      targets: music,
      volume: 0,
      duration: 1000,
      onComplete: () => {
        music?.stop();
      },
    });

    this.tweens.add({
      targets: this.player,
      y: this.player.y + 30,
      alpha: 0,
      duration: 1000,
      ease: "Sine.easeIn",
    });

    this.cameras.main.fadeOut(1200, 0, 0, 0);

    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.transitioning = false;
      this.scene.start("BossScene");
    });
  }
}
