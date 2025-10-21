import Phaser from "phaser";
import { setupPlayerInput } from "./playerInput";
import { handleMovement } from "./playerMovement";
import { setupPlayerAttack } from "./playerAttack";

export function setupPlayerControls(
  player: Phaser.Physics.Arcade.Sprite,
  scene: Phaser.Scene,
  enemies?: Phaser.Physics.Arcade.Group
) {
  const { cursors, keys } = setupPlayerInput(scene);
  const attack = setupPlayerAttack(player, scene, enemies);

  scene.events.on("update", () => {
    if (!player.body) return;

    const isKnockedBack = player.getData("isKnockedBack");

    if (Phaser.Input.Keyboard.JustDown(cursors.space || keys.SPACE)) {
      attack.queueAttack();
    }

    handleMovement(
      player,
      cursors,
      keys,
      attack.state.isAttacking,
      isKnockedBack
    );

    if (attack.state.isAttacking) {
      // Om man vill kan man låta attack-animation “override” movement animation
      if (!player.anims.isPlaying || player.anims.getName() !== "attack") {
        player.anims.play("attack", true);
      }
    }

    if (!attack.state.isAttacking) {
      attack.attackHitBox.x = player.flipX ? player.x - 20 : player.x + 20;
      attack.attackHitBox.y = player.y;
    }
  });
}
