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

    proj.setVelocity(velocity.x, velocity.y);
    proj.setOrigin(0.5, 0.5);
    proj.play("boss_fireball");
    proj.rotation =
      Phaser.Math.Angle.Between(0, 0, velocity.x, velocity.y) + Math.PI;

    proj.body?.setCircle(4);
    proj.body?.setOffset(proj.width / 2 - 4, proj.height / 2 - 4);

    const destroyTimer = boss.scene.time.delayedCall(3000, () =>
      proj.destroy()
    );
    boss["currentAttackTimers"].push(destroyTimer);
  }
}
