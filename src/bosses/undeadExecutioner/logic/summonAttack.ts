import Phaser from "phaser";
import UndeadExecutioner from "../UndeadExecutioner";

export function performSummon(boss: UndeadExecutioner) {
  boss.clearAttackTimers();
  boss.state = "attacking";

  const possiblePositions = [
    { x: 300, y: 225 },
    { x: 800, y: 225 },
    { x: 565, y: 275 },
  ];
  const target = Phaser.Math.RND.pick(possiblePositions);

  boss.moveToAndWait(target.x, target.y, 250, () => {
    boss.play("boss_summon", true);

    const summonInterval = boss.scene.time.addEvent({
      delay: 2000,
      callback: () => spawnDemon(boss),
      loop: true,
    });

    const endTimer = boss.scene.time.delayedCall(6000, () => {
      summonInterval.remove();
      boss.state = "idle";
      boss.attackCooldown = false;
      boss.play("boss_idle", true);
    });

    boss.currentAttackTimers.push(endTimer);
  });
}

function spawnDemon(boss: UndeadExecutioner) {
  const demon = boss.scene.physics.add.sprite(boss.x, boss.y, "demon_idle");
  demon.setVelocityY(100);
  const destroy = boss.scene.time.delayedCall(5000, () => demon.destroy());
  boss.currentAttackTimers.push(destroy);
}
