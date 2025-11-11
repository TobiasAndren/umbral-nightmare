import Phaser from "phaser";
import Boss from "../Boss";
import { moveToAndWait, handleMovementUpdate } from "./logic/movementLogic";
import { performMeleeAttack } from "./logic/meleeAttack";
import { performSkillMove } from "./logic/skillAttack";
import { performSummon } from "./logic/summonAttack";
import type { GameAudio } from "../../helpers/gameAudio/GameAudio";

export default class UndeadExecutioner extends Boss {
  public attackCooldown = false;
  public projectileGroup!: Phaser.Physics.Arcade.Group;
  public currentAttackTimers: Phaser.Time.TimerEvent[] = [];
  public moveTarget?: Phaser.Math.Vector2;
  public moveCallback?: () => void;
  public moveHasStarted: boolean = false;
  private lastAttack: string = "";

  public meleeHitBox!: Phaser.GameObjects.Rectangle;
  public meleeBody!: Phaser.Physics.Arcade.Body;
  public meleeOverlapAdded: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, audio?: GameAudio) {
    super(scene, x, y, "boss_idle");

    this.audio = audio;

    this.projectileGroup = this.scene.physics.add.group({
      allowGravity: false,
    });

    this.meleeHitBox = scene.add.rectangle(
      this.x,
      this.y,
      80,
      150,
      0xff0000,
      0
    );
    scene.physics.add.existing(this.meleeHitBox);
    this.meleeBody = this.meleeHitBox.body as Phaser.Physics.Arcade.Body;
    this.meleeBody.enable = false;
    this.meleeBody.allowGravity = false;
  }

  update() {
    super.update();
    if (this.isDead) return;

    handleMovementUpdate(this);

    if (this.state === "idle") this.idleLogic();
  }

  private idleLogic() {
    if (!this.active || this.isDead) return;
    if (this.attackCooldown || this.state === "attacking") return;

    this.attackCooldown = true;
    this.state = "attacking";

    let pattern: "melee" | "skill" | "summon";

    do {
      pattern = Phaser.Math.RND.pick(["melee", "skill", "summon"]);
    } while (pattern === this.lastAttack);

    this.lastAttack = pattern;

    switch (pattern) {
      case "melee":
        performMeleeAttack(this);
        break;
      case "skill":
        performSkillMove(this);
        break;
      case "summon":
        performSummon(this);
        break;
    }
  }

  public endAttack(delay: number = 2000) {
    if (!this.active || this.isDead) return;

    const timer = this.scene.time.delayedCall(delay, () => {
      this.clearAttackTimers();
      this.state = "idle";
      this.attackCooldown = false;
      this.setVelocity(0, 0);
      this.play("boss_idle", true);
    });
    this.currentAttackTimers.push(timer);
  }

  public clearAttackTimers() {
    this.currentAttackTimers.forEach((t) => t.remove());
    this.currentAttackTimers = [];
  }

  public moveToAndWait = moveToAndWait.bind(this);

  protected onDeath() {
    this.clearAttackTimers();
    this.setVelocity(0, 0);
  }
}
