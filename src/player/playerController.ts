import Phaser from "phaser";

export function setupPlayerControls(
  player: Phaser.Physics.Arcade.Sprite,
  scene: Phaser.Scene,
  enemies?: Phaser.Physics.Arcade.Group
) {
  const cursors = scene.input.keyboard?.createCursorKeys();
  const keys = scene.input.keyboard?.addKeys({
    W: Phaser.Input.Keyboard.KeyCodes.W,
    A: Phaser.Input.Keyboard.KeyCodes.A,
    S: Phaser.Input.Keyboard.KeyCodes.S,
    D: Phaser.Input.Keyboard.KeyCodes.D,
    SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
  }) as { [key: string]: Phaser.Input.Keyboard.Key };

  const attackHitBox = scene.add.rectangle(
    player.x,
    player.y,
    45,
    25,
    0xff0000,
    0
  );
  scene.physics.add.existing(attackHitBox);
  const attackBody = attackHitBox.body as Phaser.Physics.Arcade.Body;
  attackBody.enable = false;
  attackBody.allowGravity = false;

  let isAttacking = false;
  let attackQueued = false;

  function startAttack() {
    isAttacking = true;
    attackQueued = false;

    player.anims.play("attack", true);

    const startFrame = 2;
    const endFrame = 4;

    const onFrameUpdate = (
      _anim: Phaser.Animations.Animation,
      frame: Phaser.Animations.AnimationFrame
    ) => {
      if (frame.index >= startFrame && frame.index <= endFrame) {
        attackBody.enable = true;
        attackHitBox.x = player.flipX ? player.x - 20 : player.x + 20;
        attackHitBox.y = player.y;
      } else {
        attackBody.enable = false;
      }
    };

    player.on(Phaser.Animations.Events.ANIMATION_UPDATE, onFrameUpdate);

    player.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "attack",
      () => {
        attackBody.enable = false;
        isAttacking = false;
        player.off(Phaser.Animations.Events.ANIMATION_UPDATE, onFrameUpdate);

        if (player.body?.velocity.x === 0 && player.body?.blocked.down)
          player.anims.play("idle", true);

        if (attackQueued) startAttack();
      }
    );
  }

  scene.events.on("update", () => {
    if (!player.body) return;

    if (Phaser.Input.Keyboard.JustDown(cursors?.space || keys.SPACE)) {
      if (isAttacking) attackQueued = true;
      else startAttack();
    }

    let moving = false;
    if (cursors?.left?.isDown || keys.A.isDown) {
      player.setVelocityX(-200);
      if (!isAttacking) player.anims.play("run", true);
      player.setFlipX(true);
      moving = true;
    } else if (cursors?.right?.isDown || keys.D.isDown) {
      player.setVelocityX(200);
      if (!isAttacking) player.anims.play("run", true);
      player.setFlipX(false);
      moving = true;
    } else {
      player.setVelocityX(0);
    }

    if ((cursors?.up?.isDown || keys.W.isDown) && player.body.blocked.down) {
      player.setVelocityY(-400);
      if (!isAttacking) player.anims.play("jump", true);
    }

    if (!player.body.blocked.down && player.body.velocity.y > 0) {
      if (!isAttacking) player.anims.play("fall", true);
    }

    if (!isAttacking && !moving && player.body.blocked.down) {
      player.anims.play("idle", true);
    }

    if (!attackBody.enable) {
      attackHitBox.x = player.flipX ? player.x - 20 : player.x + 20;
      attackHitBox.y = player.y;
    }
  });
}
