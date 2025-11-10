import Phaser from "phaser";

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

  return { cursors, keys };
}
