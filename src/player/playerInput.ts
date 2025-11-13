import Phaser from "phaser";
import { getActivePreset } from "../config/controllerConfig";

export function setupPlayerInput(scene: Phaser.Scene) {
  const cursors = scene.input.keyboard!.createCursorKeys();
  const keys = scene.input.keyboard!.addKeys({
    W: Phaser.Input.Keyboard.KeyCodes.W,
    A: Phaser.Input.Keyboard.KeyCodes.A,
    S: Phaser.Input.Keyboard.KeyCodes.S,
    D: Phaser.Input.Keyboard.KeyCodes.D,
    SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
    ESC: Phaser.Input.Keyboard.KeyCodes.ESC,
    P: Phaser.Input.Keyboard.KeyCodes.P,
  }) as { [key: string]: Phaser.Input.Keyboard.Key };

  let mouseWasDown = false;

  return {
    cursors,
    keys,

    isJumpPressed: () => {
      const preset = getActivePreset();
      if (preset.jump === "W") {
        return keys.W.isDown || cursors.up.isDown;
      }
      if (preset.jump === "SPACE") {
        return keys.SPACE.isDown;
      }
      return false;
    },

    isAttackPressed: () => {
      const preset = getActivePreset();

      if (preset.attack === "SPACE") {
        return Phaser.Input.Keyboard.JustDown(keys.SPACE);
      }

      if (preset.attack === "MOUSE_LEFT_BUTTON") {
        const pointer = scene.input.activePointer;
        const justDown = pointer.leftButtonDown() && !mouseWasDown;
        mouseWasDown = pointer.leftButtonDown();
        return justDown;
      }

      return false;
    },
  };
}
