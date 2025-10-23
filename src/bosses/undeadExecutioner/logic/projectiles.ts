import Phaser from "phaser";
import UndeadExecutioner from "../UndeadExecutioner";

export function spawnProjectileRing(boss: UndeadExecutioner) {
  const origin = new Phaser.Math.Vector2(boss.x, boss.y);
  for (let angle = 0; angle < 360; angle += 45) {
    const velocity = boss.scene.physics.velocityFromAngle(angle, 200);
    const proj = boss.projectileGroup.create(
      origin.x,
      origin.y,
      "boss_fireball"
    ) as Phaser.Physics.Arcade.Sprite;

    proj.play("boss_fireball");

    const hitboxRadius = 4.5;
    proj.body?.setCircle(hitboxRadius);

    const fireballVisualX = 8;
    const fireballVisualY = 4.5;

    proj.body?.setOffset(
      fireballVisualX - hitboxRadius,
      fireballVisualY - hitboxRadius
    );

    proj.setOrigin(fireballVisualX / proj.width, 0.5);

    proj.rotation =
      Phaser.Math.Angle.Between(0, 0, velocity.x, velocity.y) + Math.PI;

    proj.setVelocity(velocity.x, velocity.y);

    const destroyTimer = boss.scene.time.delayedCall(3000, () =>
      proj.destroy()
    );
    boss.currentAttackTimers.push(destroyTimer);
  }
}
