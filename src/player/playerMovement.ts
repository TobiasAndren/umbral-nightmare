import Phaser from "phaser";

export function handleMovement(
  player: Phaser.Physics.Arcade.Sprite,
  cursors: any,
  keys: any,
  isAttacking: boolean,
  isKnockedBack: boolean
) {
  if (isKnockedBack || player.getData("isDead")) {
    return false;
  }

  let moving = false;

  if (cursors.left.isDown || keys.A.isDown) {
    player.setVelocityX(-150);
    if (!isAttacking) player.anims.play("run", true);
    player.setFlipX(true);
    moving = true;
  } else if (cursors.right.isDown || keys.D.isDown) {
    player.setVelocityX(150);
    if (!isAttacking) player.anims.play("run", true);
    player.setFlipX(false);
    moving = true;
  } else {
    player.setVelocityX(0);
  }

  if ((cursors.up.isDown || keys.W.isDown) && player.body!.blocked.down) {
    player.setVelocityY(-300);
    if (!isAttacking) player.anims.play("jump", true);
  }

  if (!player.body!.blocked.down && player.body!.velocity.y > 0) {
    if (!isAttacking) player.anims.play("fall", true);
  }

  if (!isAttacking && !moving && player.body!.blocked.down) {
    player.anims.play("idle", true);
  }

  return moving;
}
