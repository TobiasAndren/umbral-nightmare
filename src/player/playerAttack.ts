import Phaser from "phaser";
import Enemy from "../enemies/Enemy";

export function setupPlayerAttack(
  player: Phaser.Physics.Arcade.Sprite,
  scene: Phaser.Scene,
  enemies?: Phaser.Physics.Arcade.Group,
  playerSounds?: Record<string, Phaser.Sound.BaseSound>
) {
  const attackHitBox = scene.add.rectangle(
    player.x,
    player.y,
    35,
    25,
    0xff0000,
    0
  );
  scene.physics.add.existing(attackHitBox);
  const attackBody = attackHitBox.body as Phaser.Physics.Arcade.Body;
  attackBody.enable = false;
  attackBody.allowGravity = false;

  const state = { isAttacking: false, attackQueued: false };
  const hasHitEnemy = new Set<Enemy>();

  if (enemies) {
    scene.physics.add.overlap(
      attackHitBox,
      enemies,
      (_hitbox, enemyGO) => {
        const enemy = enemyGO as Enemy;
        if ("takeDamage" in enemyGO && !hasHitEnemy.has(enemy)) {
          (enemyGO as any).takeDamage(1, player.x);
          hasHitEnemy.add(enemy);
        }
      },
      undefined,
      scene
    );
  }

  function startAttack() {
    if (state.isAttacking) return;
    state.isAttacking = true;
    state.attackQueued = false;

    if (playerSounds?.player_attack_audio) {
      playerSounds.player_attack_audio.play({ volume: 0.3 });
    }

    player.anims.play("attack", true);

    const startFrame = 2;
    const endFrame = 4;

    const onFrameUpdate = (
      _anim: Phaser.Animations.Animation,
      frame: Phaser.Animations.AnimationFrame
    ) => {
      attackBody.enable = frame.index >= startFrame && frame.index <= endFrame;
      attackHitBox.x = player.flipX ? player.x - 20 : player.x + 20;
      attackHitBox.y = player.y;
    };

    player.on(Phaser.Animations.Events.ANIMATION_UPDATE, onFrameUpdate);

    const onComplete = () => {
      attackBody.enable = false;
      state.isAttacking = false;
      player.off(Phaser.Animations.Events.ANIMATION_UPDATE, onFrameUpdate);
      hasHitEnemy.clear();

      if (player.body?.velocity.x === 0 && player.body?.blocked.down) {
        player.anims.play("idle", true);
      }

      if (state.attackQueued) {
        startAttack();
      }
    };

    player.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "attack",
      onComplete
    );
  }

  function queueAttack() {
    if (state.isAttacking) state.attackQueued = true;
    else startAttack();
  }

  return { attackHitBox, startAttack, queueAttack, state };
}
