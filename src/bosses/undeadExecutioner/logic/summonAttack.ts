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
      delay: 7000,
      loop: true,
      callback: () => spawnDemons(boss),
      startAt: 6000,
    });

    const endTimer = boss.scene.time.delayedCall(100000, () => {
      summonInterval.remove();
      boss.state = "idle";
      boss.attackCooldown = false;
      boss.play("boss_idle", true);
    });

    boss.currentAttackTimers.push(endTimer);
  });
}

function spawnDemons(boss: UndeadExecutioner) {
  const player = boss.player as Phaser.Physics.Arcade.Sprite;
  const spawnOffset = [
    { x: -40, y: -40 },
    { x: 40, y: -40 },
    { x: -40, y: 40 },
    { x: 40, y: 40 },
  ];

  spawnOffset.forEach((offset) => {
    const demon = boss.scene.physics.add.sprite(
      boss.x + offset.x,
      boss.y + offset.y,
      "boss_summon_idle"
    );

    demon.body.setSize(25, 25);

    demon.body.allowGravity = false;

    demon.play("boss_summon_appear", true);
    demon.setData("speed", 100);
    demon.setData("target", player);

    boss.scene.physics.add.overlap(demon, player, () => {
      player.emit("takeDamage", 1, demon.x);
      demon.destroy();
    });

    demon.on("animationcomplete", (anim: Phaser.Animations.Animation) => {
      if (anim.key === "boss_summon_appear") {
        demon.play("boss_summon_idle", true);

        demon.update = () => {
          if (!demon.active || !player.active) return;

          const angle = Phaser.Math.Angle.Between(
            demon.x,
            demon.y,
            player.x,
            player.y
          );
          demon.setVelocity(
            Math.cos(angle) * demon.getData("speed"),
            Math.sin(angle) * demon.getData("speed")
          );
          demon.setRotation(angle + (3 * Math.PI) / 2);
        };

        boss.scene.events.on("update", demon.update, demon);
      }
    });
  });
}
