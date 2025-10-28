import Phaser from "phaser";

export default class Demon extends Phaser.Physics.Arcade.Sprite {
  protected maxHealth: number = 1;
  protected currentHealth: number = this.maxHealth;
  protected isHurt = false;
  protected isDead = false;

  private takeDamage(amount: number) {
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

    if (this.scene.anims.exists("boss_summon_death")) {
      this.play("boss_summon_death");

      if (this.body) this.body.enable = false;

      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.destroy();
      });
    } else {
      this.destroy();
    }
  }
}
