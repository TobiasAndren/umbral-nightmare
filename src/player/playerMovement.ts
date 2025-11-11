import Phaser from "phaser";
import type { GameAudio } from "../helpers/gameAudio/GameAudio";

export function handleMovement(
  player: Phaser.Physics.Arcade.Sprite,
  cursors: any,
  keys: any,
  isAttacking: boolean,
  isKnockedBack: boolean,
  audio?: GameAudio
) {
  if (isKnockedBack) return false;

  let moving = false;
  const onGround = player.body!.blocked.down;

  if (cursors.left.isDown || keys.A.isDown) {
    player.setVelocityX(-150);
    if (!isAttacking && onGround) player.anims.play("run", true);
    player.setFlipX(true);
    moving = true;
  } else if (cursors.right.isDown || keys.D.isDown) {
    player.setVelocityX(150);
    if (!isAttacking && onGround) player.anims.play("run", true);
    player.setFlipX(false);
    moving = true;
  } else {
    player.setVelocityX(0);
  }

  if ((cursors.up.isDown || keys.W.isDown) && onGround) {
    player.setVelocityY(-300);
    if (!isAttacking) player.anims.play("jump", true);
  }

  if (!onGround && player.body!.velocity.y > 0) {
    if (!isAttacking) player.anims.play("fall", true);
  }

  if (!isAttacking && !moving && onGround) {
    player.anims.play("idle", true);
  }

  if (!player.data) player.setDataEnabled();

  if (!player.getData("footstepTimer")) {
    player.setData("footstepTimer", null as Phaser.Time.TimerEvent | null);
  }

  if (moving && onGround && !isAttacking) {
    if (!player.getData("footstepTimer")) {
      const timer = player.scene.time.addEvent({
        delay: 300,
        loop: true,
        callback: () => {
          if (audio) {
            audio.playSFX("player_run_audio");
          }
        },
      });
      player.setData("footstepTimer", timer);
    }
  } else {
    const timer: Phaser.Time.TimerEvent | null =
      player.getData("footstepTimer");
    if (timer) {
      timer.remove(false);
      player.setData("footstepTimer", null);
    }
  }

  return moving;
}
