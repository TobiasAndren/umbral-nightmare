import Phaser from "phaser";
import UndeadExecutioner from "../UndeadExecutioner";

export function moveToAndWait(
  this: UndeadExecutioner,
  x: number,
  y: number,
  speed: number,
  onArrive: () => void
) {
  const dist = Phaser.Math.Distance.Between(this.x, this.y, x, y);

  if (dist < 1) {
    this.setVelocity(0, 0);
    onArrive();
    return;
  }

  this.moveHasStarted = false;
  this.scene.physics.moveTo(this, x, y, speed);
  this.moveTarget = new Phaser.Math.Vector2(x, y);
  this.moveCallback = onArrive;
}

export function handleMovementUpdate(boss: UndeadExecutioner) {
  const body = boss.body as Phaser.Physics.Arcade.Body;

  if (body.velocity.x < 0) boss.setFlipX(true);
  else if (body.velocity.x > 0) boss.setFlipX(false);

  const target = boss.moveTarget;
  const callback = boss.moveCallback;
  if (!target || !callback) return;

  const dist = Phaser.Math.Distance.Between(boss.x, boss.y, target.x, target.y);

  if (
    !boss.moveHasStarted &&
    (Math.abs(body.velocity.x) > 1 || Math.abs(body.velocity.y) > 1)
  ) {
    boss.moveHasStarted = true;
  }

  if (
    boss.moveHasStarted &&
    (dist < 5 ||
      (Math.abs(body.velocity.x) < 1 && Math.abs(body.velocity.y) < 1))
  ) {
    boss.setVelocity(0, 0);
    const cb = callback;
    boss.moveCallback = undefined;
    boss.moveTarget = undefined;
    boss.moveHasStarted = false;
    cb();
  }
}
