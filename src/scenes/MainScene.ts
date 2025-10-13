import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.spritesheet("player_idle", "assets/player/Idle.png", {
      frameWidth: 144,
      frameHeight: 82,
    });

    this.load.spritesheet("player_run", "assets/player/Run.png", {
      frameWidth: 144,
      frameHeight: 82,
    });

    this.load.spritesheet("player_attack", "assets/player/Attack-1.png", {
      frameWidth: 144,
      frameHeight: 82,
    });

    this.load.spritesheet("player_jump", "assets/player/Jump.png", {
      frameWidth: 144,
      frameHeight: 82,
    });

    this.load.spritesheet("player_fall", "assets/player/Fall.png", {
      frameWidth: 144,
      frameHeight: 82,
    });

    this.load.spritesheet("player_hurt", "assets/player/Hurt.png", {
      frameWidth: 144,
      frameHeight: 82,
    });
  }

  create() {
    const player = this.physics.add.sprite(100, 200, "player_idle");

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player_idle", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("player_run", {
        start: 0,
        end: 7,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: "attack",
      frames: this.anims.generateFrameNumbers("player_attack", {
        start: 0,
        end: 9,
      }),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player_jump", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "fall",
      frames: this.anims.generateFrameNumbers("player_fall", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "hurt",
      frames: this.anims.generateFrameNumbers("player_hurt", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: 0,
    });

    const platforms = this.physics.add.staticGroup();

    const ground = platforms.create(400, 550, undefined);
    ground.setDisplaySize(800, 50);
    ground.refreshBody();

    this.physics.add.collider(player, platforms);

    player.play("idle");
  }
}
