export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  health: number;
  speed: number;
  player?: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.health = 3;
    this.speed = 50;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
  }

  setPlayer(player: Phaser.Physics.Arcade.Sprite) {
    this.player = player;
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (!this.player || !this.player.body) return;

    if (this.player.x < this.x) {
      this.setVelocityX(-this.speed);
      this.flipX = true;
    } else if (this.player.x > this.x) {
      this.setVelocityX(this.speed);
      this.flipX = false;
    } else {
      this.setVelocityX(0);
    }
  }

  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) this.die();
    console.log("ouch", this.health);
  }

  die() {
    this.destroy();
  }
}
