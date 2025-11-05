import Phaser from "phaser";

export function handleMovement(
  player: Phaser.Physics.Arcade.Sprite,
  cursors: any,
  keys: any,
  isAttacking: boolean,
  isKnockedBack: boolean,
  playerSounds?: Record<string, Phaser.Sound.BaseSound>
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

    if (playerSounds?.player_run_audio?.isPlaying) {
      playerSounds.player_run_audio.stop();
    }
  }

  if (!onGround && player.body!.velocity.y > 0) {
    if (!isAttacking) player.anims.play("fall", true);
    if (playerSounds?.player_run_audio?.isPlaying) {
      playerSounds.player_run_audio.stop();
    }
  }

  if (!isAttacking && !moving && onGround) {
    player.anims.play("idle", true);
    if (playerSounds?.player_run_audio?.isPlaying) {
      playerSounds.player_run_audio.stop();
    }
  }

  if (playerSounds?.player_run_audio) {
    if (moving && onGround) {
      if (!playerSounds.player_run_audio.isPlaying) {
        playerSounds.player_run_audio.play({ loop: true, volume: 0.6 });
      }
    } else {
      if (playerSounds.player_run_audio.isPlaying) {
        playerSounds.player_run_audio.stop();
      }
    }
  }

  return moving;
}
