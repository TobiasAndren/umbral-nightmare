import { GameAudio } from "./GameAudio";

let gameAudio: GameAudio | null = null;

export function getGameAudio(scene: Phaser.Scene) {
  if (!gameAudio) gameAudio = new GameAudio(scene);
  return gameAudio;
}
