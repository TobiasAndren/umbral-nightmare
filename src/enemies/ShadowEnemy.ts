import Enemy from "./Enemy";
import Phaser from "phaser";

export default class ShadowEnemy extends Enemy {
  private isAttacking = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "shadow_idle");
    this.speed = 50;
  }

  update() {
    if (!this.player) return;

    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.player.x,
      this.player.y
    );

    if (distance < 25) {
      this.setVelocityX(0);

      if (!this.isAttacking) {
        this.isAttacking = true;
        this.play("shadow_attack1");

        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          this.isAttacking = false;
          this.play("shadow_idle", true);
        });
      }

      return;
    }

    if (distance < 150) {
      if (this.isAttacking) return;

      const movingLeft = this.player.x < this.x;
      this.setVelocityX(movingLeft ? -this.speed : this.speed);
      this.flipX = movingLeft;

      if (
        this.anims.currentAnim?.key !== "shadow_walk" ||
        !this.anims.isPlaying
      ) {
        this.play("shadow_walk", true);
      }

      return;
    }

    if (!this.isAttacking) {
      this.setVelocityX(0);
      if (
        this.anims.currentAnim?.key !== "shadow_idle" ||
        !this.anims.isPlaying
      ) {
        this.play("shadow_idle", true);
      }
    }
  }
}
