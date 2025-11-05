import Phaser from "phaser";
import UndeadExecutioner from "../UndeadExecutioner";

export function performMeleeAttack(boss: UndeadExecutioner) {
  if (!boss.active || boss.isDead) return;
  if (!boss.player) return;

  boss.clearAttackTimers();
  boss.state = "attacking";

  const attackRange = 85;
  const speed = 200;

  const checkDistance = () => {
    if (!boss.player) return;

    const distance = Phaser.Math.Distance.Between(
      boss.x,
      boss.y,
      boss.player.x,
      boss.player.y
    );

    if (distance > attackRange) {
      boss.scene.physics.moveToObject(boss, boss.player, speed);
      boss.scene.time.delayedCall(50, checkDistance);
    } else {
      if (!boss.active || boss.isDead) return;

      boss.setVelocity(0, 0);

      if (boss.player.x < boss.x) boss.setFlipX(true);

      boss.play("boss_windup", true);

      boss.scene.time.delayedCall(600, () => {
        if (!boss.active || boss.isDead) return;

        boss.play("boss_attack", true);

        boss.scene.physics.add.overlap(
          boss.meleeHitBox,
          boss.player!,
          (_hitbox, playerGO) => {
            const player = playerGO as Phaser.Physics.Arcade.Sprite;
            if (!player.getData("isInvincible")) {
              player.emit("takeDamage", 1, boss.x);
            }
          }
        );

        const onFrameUpdate = (
          _anim: Phaser.Animations.Animation,
          frame: Phaser.Animations.AnimationFrame
        ) => {
          if (!boss.active || boss.isDead) return;

          if (frame.index >= 1 && frame.index <= 4) {
            enableHitbox(boss);
          } else if (frame.index >= 9 && frame.index <= 11) {
            enableHitbox(boss);
          } else {
            boss.meleeBody.enable = false;
          }

          if (frame.index === 2) {
            boss.scene.sound.play("boss_attack_audio", { volume: 0.6 });
          }

          if (frame.index === 10) {
            boss.scene.sound.play("boss_attack_audio", { volume: 0.6 });
          }
        };

        boss.on(Phaser.Animations.Events.ANIMATION_UPDATE, onFrameUpdate);

        boss.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          boss.off(Phaser.Animations.Events.ANIMATION_UPDATE, onFrameUpdate);
          boss.meleeBody.enable = false;
        });
      });

      boss.scene.time.delayedCall(1750, () => {
        if (!boss.active || boss.isDead) return;

        boss.play("boss_idle");
        boss.endAttack(1000);
      });
    }
  };

  checkDistance();
}

function enableHitbox(boss: UndeadExecutioner, duration: number = 100) {
  boss.meleeHitBox.x = boss.flipX ? boss.x - 40 : boss.x + 40;
  boss.meleeHitBox.y = boss.y;
  boss.meleeBody.enable = true;

  boss.scene.time.delayedCall(duration, () => {
    boss.meleeBody.enable = false;
  });
}
