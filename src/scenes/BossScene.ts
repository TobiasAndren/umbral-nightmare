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
import { preloadBossAudio } from "../helpers/audioLoaders/preloadBossAudio";
import { preloadPlayerAudio } from "../helpers/audioLoaders/preloadPlayerAudio";

export default class BossScene extends Phaser.Scene {
  private ambience?: Phaser.Sound.BaseSound;
  private bossSounds?: Record<string, Phaser.Sound.BaseSound>;
  private playerSounds!: Record<string, Phaser.Sound.BaseSound>;

  private ground!: Phaser.Physics.Arcade.StaticGroup;
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private ceiling!: Phaser.Physics.Arcade.StaticGroup;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;

  private player!: Phaser.Physics.Arcade.Sprite;
  private boss!: UndeadExecutioner;
  private enemies!: Phaser.Physics.Arcade.Group;

  private bossIntroComplete: boolean = false;
  private hasLanded: boolean = false;

  public addEnemy(enemy: Phaser.Physics.Arcade.Sprite) {
    this.enemies.add(enemy);
  }

  constructor() {
    super("BossScene");
  }

  preload() {
    this.load.audio("cave_ambience", "assets/audio/ambience/cave-ambience.wav");
    preloadPlayerAudio(this);
    preloadBossAudio(this);
    preloadCaveBackground(this);
    preloadPlayerHealth(this);
    preloadPlayerSprites(this);
    preloadBossSprites(this);
    preloadCaveTiles(this);
  }

  create() {
    this.ambience = this.sound.add("cave_ambience", {
      loop: true,
      volume: 0,
    });

    this.ambience.play();

    this.tweens.add({
      targets: this.ambience,
      volume: 0.1,
      duration: 1000,
      ease: "Sine.easeIn",
    });

    createCaveBackground(this);
    this.ground = createCaveGroundSegments(this, [{ x: -100, width: 5000 }]);

    createPlayerAnimations(this);
    createBossAnimations(this);

    const caveBounds = this.physics.add.staticGroup();

    this.ceiling = createCaveCeiling(this, [{ x: 555, width: 5000 }]);

    this.walls = createCaveWalls(this, [
      {
        x: -280,
        y: 270,
        height: 370,
        side: "left",
      },
      {
        x: 1400,
        y: 270,
        height: 370,
        side: "right",
      },
    ]);

    this.platforms = createCavePlatforms(this, [
      { x: 385, y: 355 },
      { x: 385, y: 200 },
      { x: 495, y: 275 },
      { x: 565, y: 355 },
      { x: 565, y: 195 },
      { x: 635, y: 275 },
      { x: 735, y: 195 },
      { x: 735, y: 355 },
    ]);

    this.player = this.physics.add.sprite(250, 150, "player_idle");
    this.player.body?.setSize(15, 15);
    this.player.setCollideWorldBounds(true);
    this.player.setData("isInvincible", true);

    this.playerSounds = {
      player_run_audio: this.sound.add("player_run_audio"),
      player_attack_audio: this.sound.add("player_attack_audio"),
      player_hurt_audio: this.sound.add("player_hurt_audio"),
    };

    this.enemies = this.physics.add.group({
      runChildUpdate: true,
      allowGravity: false,
    });

    this.bossSounds = {
      boss_skill_audio: this.sound.add("boss_skill_audio"),
      boss_attack_audio: this.sound.add("boss_attack_audio"),
      boss_summon_audio: this.sound.add("boss_summon_audio"),
      boss_hurt_audio: this.sound.add("boss_hurt_audio"),
      summon_hurt_audio: this.sound.add("summon_hurt_audio"),
    };

    this.boss = new UndeadExecutioner(this, 575, 275, this.bossSounds);
    this.boss.setPlayer(this.player);
    this.boss.body?.setSize(30, 70);

    this.boss.setActive(false);

    this.enemies.add(this.boss);

    this.setupIntroCamera();

    this.setupCollisions(caveBounds);

    this.physics.add.collider(this.player, this.ground, () => {
      if (!this.hasLanded && this.player.body?.touching.down) {
        this.hasLanded = true;
        this.startBossIntro();
      }
    });

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, this.ceiling);
    this.physics.add.collider(this.player, caveBounds);
    this.physics.add.collider(this.boss, this.ground);
    this.physics.add.collider(this.boss, caveBounds);

    setupPlayerHealth(
      this.player,
      this,
      5,
      375,
      185,
      this.ambience,
      this.playerSounds
    );

    this.boss.deathCallback = () => {
      this.time.delayedCall(1000, () => {
        if (this.ambience) {
          this.tweens.add({
            targets: this.ambience,
            volume: 0,
            duration: 1000,
            ease: "Sine.easeOut",
            onComplete: () => {
              this.ambience?.stop();
            },
          });
        }

        const cam = this.cameras.main;
        cam.fadeOut(1000, 0, 0, 0);

        cam.once("camerafadeoutcomplete", () => {
          this.scene.start("WinMenuScene");
        });
      });
    };
  }

  private setupIntroCamera() {
    const cam = this.cameras.main;
    cam.fadeIn(1000, 0, 0, 0);

    cam.setZoom(2.5);
    cam.startFollow(this.player, true, 0.1, 0.1);
  }

  private startBossIntro() {
    if (this.bossIntroComplete) return;

    this.bossIntroComplete = true;

    const cam = this.cameras.main;
    const roomLeft = 200;
    const roomRight = 800;
    const roomTop = 0;
    const roomBottom = 540;

    this.tweens.add({
      targets: cam,
      zoom: 2,
      scrollX: (roomLeft + roomRight) / 2 - cam.width / 4,
      scrollY: (roomTop + roomBottom) / 2 - cam.height / 4,
      duration: 2000,
      ease: "Quad.easeInOut",
      onUpdate: () => {
        const progress = this.tweens.getTweensOf(cam)[0]?.progress || 0;
        const centerX = (roomLeft + roomRight) / 2;
        const centerY = (roomTop + roomBottom) / 2;

        const currentX = Phaser.Math.Linear(this.player.x, centerX, progress);
        const currentY = Phaser.Math.Linear(this.player.y, centerY, progress);

        cam.centerOn(currentX, currentY);
      },
      onComplete: () => {
        const roomWidth = roomRight - roomLeft;
        const roomHeight = roomBottom - roomTop;
        cam.setBounds(roomLeft, roomTop, roomWidth, roomHeight);
        cam.stopFollow();
        cam.centerOn((roomLeft + roomRight) / 2, (roomTop + roomBottom) / 2);
        cam.fadeIn(500, 0, 0, 0);

        this.time.delayedCall(1000, () => {
          this.activateBoss();
        });
      },
    });
  }

  private activateBoss() {
    this.boss.setActive(true);

    this.player.setData("isInvincible", false);

    setupPlayerControls(this.player, this, this.enemies, this.playerSounds);
  }

  private setupCollisions(caveBounds: Phaser.Physics.Arcade.StaticGroup) {
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
  }

  update() {
    if (this.boss && this.bossIntroComplete) {
      this.boss.update();
    }
  }
}
