import UndeadExecutioner from "../UndeadExecutioner";
import { spawnProjectileRing } from "./projectiles";

export function performSkillMove(boss: UndeadExecutioner) {
  boss.clearAttackTimers();
  boss.state = "attacking";

  const targetX = 565;
  const targetY = 275;
  const speed = 250;
  const attackDelay = 500;

  boss.moveToAndWait(targetX, targetY, speed, () => {
    if (!boss.active || boss.isDead) return;
    boss.play("boss_skill", true);
    const delayTimer = boss.scene.time.delayedCall(attackDelay, () => {
      for (let i = 0; i < 4; i++) {
        const ringTimer = boss.scene.time.delayedCall(i * 1000, () =>
          spawnProjectileRing(boss)
        );
        boss.currentAttackTimers.push(ringTimer);
      }

      boss.scene.time.delayedCall(3250, () => {
        if (!boss.active || boss.isDead) return;

        boss.play("boss_idle");
        boss.endAttack(1500);
      });
    });

    boss.currentAttackTimers.push(delayTimer);
  });
}
