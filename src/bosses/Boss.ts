import Phaser from "phaser";

export default class Boss extends Phaser.Physics.Arcade.Sprite {
  protected maxHealth: number;
  protected currentHealth: number;
  protected isHurt = false;
  public isDead = false;
  public player?: Phaser.Physics.Arcade.Sprite;

  public state: "idle" | "attacking" | "dead" = "idle";

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.maxHealth = 20;
    this.currentHealth = this.maxHealth;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.setScale(2);
    this.setDepth(5);
  }

  public setPlayer(player: Phaser.Physics.Arcade.Sprite) {
    this.player = player;
  }

  protected takeDamage(amount: number) {
    if (this.isDead || this.isHurt) return;

    this.currentHealth -= amount;
    this.isHurt = true;

    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });

    this.scene.time.delayedCall(400, () => {
      this.isHurt = false;
    });

    if (this.currentHealth <= 0) {
      this.die();
    }
  }

  private die() {
    if (this.isDead) return;
    this.isDead = true;
    this.state = "dead";
    this.setVelocity(0, 0);

    this.onDeath();

    if (this.scene.anims.exists("boss_death")) {
      this.play("boss_death");

      if (this.body) this.body.enable = false;

      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.destroy();
      });
    } else {
      this.destroy();
    }
  }

  protected onDeath() {}
}
