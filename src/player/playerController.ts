import Phaser from "phaser";
import { setupPlayerInput } from "./playerInput";
import { handleMovement } from "./playerMovement";
import { setupPlayerAttack } from "./playerAttack";
import { GameAudio } from "../helpers/gameAudio/GameAudio";

export function setupPlayerControls(
  player: Phaser.Physics.Arcade.Sprite,
  scene: Phaser.Scene,
  enemies?: Phaser.Physics.Arcade.Group,
  audio?: GameAudio
) {
  const { cursors, keys } = setupPlayerInput(scene);
  const attack = setupPlayerAttack(player, scene, enemies, audio);

  scene.events.on("update", () => {
    if (!player.body || player.getData("isDead")) return;

    if (
      Phaser.Input.Keyboard.JustDown(keys.ESC) ||
      Phaser.Input.Keyboard.JustDown(keys.P)
    ) {
      if (scene.scene.isActive("PauseMenuScene")) {
        scene.scene.stop("PauseMenuScene");
        scene.scene.resume(scene.scene.key);
      } else {
        scene.scene.launch("PauseMenuScene", {
          previousSceneKey: scene.scene.key,
        });
        scene.scene.pause();
      }
    }

    const isKnockedBack = player.getData("isKnockedBack");

    if (Phaser.Input.Keyboard.JustDown(cursors.space || keys.SPACE)) {
      attack.queueAttack();
    }

    handleMovement(
      player,
      cursors,
      keys,
      attack.state.isAttacking,
      isKnockedBack,
      audio
    );

    if (attack.state.isAttacking) {
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
