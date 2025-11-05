import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  protected player?: Phaser.Physics.Arcade.Sprite;
  protected speed = 50;
  protected health = 3;
  protected isHurt = false;
  protected isDead = false;
  protected deathAnimKey?: string;
  protected hurtAnimKey?: string;

  protected sounds?: Record<string, Phaser.Sound.BaseSound>;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  setPlayer(player: Phaser.Physics.Arcade.Sprite) {
    this.player = player;
  }

  takeDamage(amount: number, sourceX?: number) {
    if (this.isHurt || this.isDead) return;

    this.health -= amount;

    this.isHurt = true;

    this.sounds?.enemy_hurt_audio?.play({ volume: 0.2 });

    this.setTintFill(0x880200);

    const hurtKey = this.hurtAnimKey;
    if (hurtKey && this.scene.anims.exists(hurtKey)) {
      this.play(hurtKey, true);
    }

    if (sourceX !== undefined) {
      const direction = this.x < sourceX ? -1 : 1;
      this.setVelocityX(150 * direction);
      this.setDrag(600);

      this.scene.time.delayedCall(100, () => {
        this.clearTint();
      });

      this.scene.time.delayedCall(300, () => {
        this.setVelocityX(0);
        this.isHurt = false;
        this.setDrag(0);
      });
    } else {
      this.scene.time.delayedCall(300, () => {
        this.isHurt = false;
      });
    }

    if (this.health <= 0) this.die();
  }

  protected die() {
    if (this.isDead) return;

    this.isDead = true;
    this.setVelocity(0, 0);
    this.isHurt = true;

    const deathKey = this.deathAnimKey;
    if (deathKey && this.scene.anims.exists(deathKey)) {
      this.anims.stop();
      this.play(deathKey);

      if (this.body) this.body.enable = false;

      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.destroy();
      });
    } else {
      this.destroy();
    }
  }

  update() {}
}
