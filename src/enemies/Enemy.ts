import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  protected player?: Phaser.Physics.Arcade.Sprite;
  protected speed = 50;
  protected health = 3;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  setPlayer(player: Phaser.Physics.Arcade.Sprite) {
    this.player = player;
  }

  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) this.die();
  }

  protected die() {
    this.destroy();
  }

  update() {}
}
