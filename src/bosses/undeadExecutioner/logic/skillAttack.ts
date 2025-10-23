import UndeadExecutioner from "../UndeadExecutioner";
import { spawnProjectileRing } from "./projectiles";

export function performSkillMove(boss: UndeadExecutioner) {
  boss.clearAttackTimers();
  boss.state = "attacking";

  const targetX = 565;
  const targetY = 275;
  const speed = 250;

  boss.moveToAndWait(targetX, targetY, speed, () => {
    boss.play("boss_skill", true);

    for (let i = 0; i < 8; i++) {
      const ringTimer = boss.scene.time.delayedCall(i * 300, () =>
        spawnProjectileRing(boss)
      );
      boss["currentAttackTimers"].push(ringTimer);
    }

    boss.endAttack(4000);
  });
}
