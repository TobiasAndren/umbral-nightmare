import Phaser from "phaser";
import { createPlayerAnimations } from "../player/playerAnimations";
import { setupPlayerControls } from "../systems/playerController";
import { createPlatforms } from "../environment/platform";
import Enemy from "../enemies/Enemy";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    const spriteConfigs = [
      {
        key: "player_idle",
        file: "Idle.png",
        frames: { frameWidth: 144, frameHeight: 144 },
      },
      {
        key: "player_run",
        file: "Run.png",
        frames: { frameWidth: 144, frameHeight: 144 },
      },
      {
        key: "player_attack",
        file: "Attack-1.png",
        frames: { frameWidth: 144, frameHeight: 144 },
      },
      {
        key: "player_jump",
        file: "Jump.png",
        frames: { frameWidth: 144, frameHeight: 144 },
      },
      {
        key: "player_fall",
        file: "Fall.png",
        frames: { frameWidth: 144, frameHeight: 144 },
      },
      {
        key: "player_hurt",
        file: "Hurt.png",
        frames: { frameWidth: 144, frameHeight: 144 },
      },
    ];

    spriteConfigs.forEach((config) =>
      this.load.spritesheet(
        config.key,
        `assets/player/${config.file}`,
        config.frames
      )
    );
  }

  create() {
    const player = this.physics.add.sprite(100, 400, "player_idle");

    const enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    const testEnemy = new Enemy(this, 400, 400, "player_idle");
    testEnemy.setPlayer(player);
    enemies.add(testEnemy);

    player.body.setSize(15, 15);
    testEnemy.body?.setSize(15, 15);

    createPlayerAnimations(this);
    const platforms = createPlatforms(this);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemies, platforms);

    this.cameras.main.setZoom(2);
    this.cameras.main.startFollow(player, true, 0.05, 0.05);

    setupPlayerControls(player, this, enemies);

    player.play("idle");
  }
}
