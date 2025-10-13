import Phaser from "phaser";

export function setupPlayerControls(
  player: Phaser.Physics.Arcade.Sprite,
  scene: Phaser.Scene
) {
  const cursors = scene.input.keyboard?.createCursorKeys();
  const keys = scene.input.keyboard?.addKeys({
    W: Phaser.Input.Keyboard.KeyCodes.W,
    A: Phaser.Input.Keyboard.KeyCodes.A,
    S: Phaser.Input.Keyboard.KeyCodes.S,
    D: Phaser.Input.Keyboard.KeyCodes.D,
  }) as { [key: string]: Phaser.Input.Keyboard.Key };

  scene.events.on("update", () => {
    if (!player.body) return;

    if (cursors?.left?.isDown || keys.A.isDown) {
      player.setVelocityX(-200);
      player.anims.play("run", true);
      player.setFlipX(true);
    } else if (cursors?.right?.isDown || keys.D.isDown) {
      player.setVelocityX(200);
      player.anims.play("run", true);
      player.setFlipX(false);
    } else {
      player.setVelocityX(0);
      player.anims.play("idle", true);
    }

    if ((cursors?.up?.isDown || keys.W.isDown) && player.body.blocked.down) {
      player.setVelocityY(-400);
      player.anims.play("jump", true);
    }

    if (!player.body.blocked.down && player.body.velocity.y > 0) {
      player.anims.play("fall", true);
    }
  });
}
