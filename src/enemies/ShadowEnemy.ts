import Enemy from "./Enemy";
import Phaser from "phaser";

export default class ShadowEnemy extends Enemy {
  private isAttacking = false;
  private attackHitbox?: Phaser.GameObjects.Rectangle;
  private attackBody?: Phaser.Physics.Arcade.Body;
  private overlapSet = false;
  deathAnimKey = "shadow_death";
  hurtAnimKey = "shadow_hurt";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "shadow_idle");
    this.speed = 50;

    this.attackHitbox = scene.add.rectangle(
      this.x,
      this.y,
      10,
      15,
      0xf00000,
      0
    );

    scene.physics.add.existing(this.attackHitbox);
    this.attackBody = this.attackHitbox.body as Phaser.Physics.Arcade.Body;
    this.attackBody.enable = false;
    this.attackBody.allowGravity = false;
  }

  override setPlayer(player: Phaser.Physics.Arcade.Sprite): void {
    super.setPlayer(player);

    if (!this.overlapSet) {
      this.scene.physics.add.overlap(
        this.attackHitbox!,
        this.player!,
        () => {
          if (!this.player) return;
          if (!this.player.getData("isInvincible")) {
            this.player.emit("takeDamage", 1, this.x);
          }
        },
        undefined,
        this
      );

      this.overlapSet = true;
    }
  }

  update() {
    if (this.isDead) return;
    if (this.isHurt) return;
    if (!this.player) return;

    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.player.x,
      this.player.y
    );

    if (distance < 35) {
      this.setVelocityX(0);

      if (!this.isAttacking) {
        this.isAttacking = true;
        this.play("shadow_attack1");

        const onFrameUpdate = (
          _anim: Phaser.Animations.Animation,
          frame: Phaser.Animations.AnimationFrame
        ) => {
          if (frame.index >= 2 && frame.index <= 4) {
            this.attackBody!.enable = true;
            this.attackHitbox!.x = this.flipX ? this.x - 15 : this.x + 15;
            this.attackHitbox!.y = this.y;
          } else {
            this.attackBody!.enable = false;
          }
        };

        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, onFrameUpdate);

        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          this.off(Phaser.Animations.Events.ANIMATION_UPDATE, onFrameUpdate);
          this.attackBody!.enable = false;
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
