export class GameState {
  static lastCheckpointIndex: number | null = null;
  static activatedCheckpoints: Set<number> = new Set();
}
