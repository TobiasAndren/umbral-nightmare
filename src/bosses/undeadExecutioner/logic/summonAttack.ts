import Phaser from "phaser";
import UndeadExecutioner from "../UndeadExecutioner";
import Demon from "../UndeadExecutionerSummon";

export function performSummon(boss: UndeadExecutioner) {
  if (!boss.active || boss.isDead) return;
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

    const summonSound = boss.sounds?.boss_summon_audio as
      | Phaser.Sound.WebAudioSound
      | undefined;
    if (summonSound && !summonSound.isPlaying) {
      summonSound.loop = true;
      summonSound.volume = 0.8;
      summonSound.play();
    }

    const summonInterval = boss.scene.time.addEvent({
      delay: 6000,
      loop: true,
      callback: () => spawnDemons(boss),
      startAt: 5000,
    });

    const endTimer = boss.scene.time.delayedCall(8000, () => {
      summonInterval.remove();
      if (summonSound && summonSound.isPlaying) {
        summonSound.stop();
      }
      if (!boss.active || boss.isDead) return;
      boss.play("boss_idle");
      boss.endAttack(1750);
    });

    boss.currentAttackTimers.push(endTimer);
  });
}

function spawnDemons(boss: UndeadExecutioner) {
  if (!boss.active || boss.isDead) return;

  const scene = boss.scene as any;
  const player = boss.player as Phaser.Physics.Arcade.Sprite;
  const spawnOffset = [
    { x: -40, y: -40 },
    { x: 0, y: -60 },
    { x: 40, y: -40 },
  ];

  spawnOffset.forEach((offset) => {
    const demon = new Demon(
      boss.scene,
      boss.x + offset.x,
      boss.y + offset.y,
      "boss_summon_idle"
    );

    scene.add.existing(demon);
    scene.physics.add.existing(demon);

    demon.body?.setSize(25, 25);
    (demon.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    demon.setData("speed", 100);
    demon.setData("target", player);

    if (scene.addEnemy) {
      scene.addEnemy(demon);
    }

    demon.play("boss_summon_appear", true);

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

        if (boss.scene && boss.scene.events) {
          boss.scene.events.on("update", demon.update, demon);
        }
      }
    });
  });
}
