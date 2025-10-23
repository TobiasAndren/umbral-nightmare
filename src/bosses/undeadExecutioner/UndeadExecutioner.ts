import Phaser from "phaser";
import Boss from "../Boss";
import { moveToAndWait, handleMovementUpdate } from "./logic/movementLogic";
import { performMeleeAttack } from "./logic/meleeAttack";
import { performSkillMove } from "./logic/skillAttack";
import { performSummon } from "./logic/summonAttack";

export default class UndeadExecutioner extends Boss {
  public attackCooldown = false;
  public projectileGroup!: Phaser.Physics.Arcade.Group;
  public currentAttackTimers: Phaser.Time.TimerEvent[] = [];
  public moveTarget?: Phaser.Math.Vector2;
  public moveCallback?: () => void;
  public moveHasStarted: boolean = false;

  public meleeHitBox!: Phaser.GameObjects.Rectangle;
  public meleeBody!: Phaser.Physics.Arcade.Body;
  public meleeOverlapAdded: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "boss_idle");
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

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
    if (this.attackCooldown || this.state === "attacking") return;

    this.attackCooldown = true;
    this.state = "attacking";

    const pattern = Phaser.Math.RND.pick(["melee"]);

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

  public endAttack(delay: number = 4000) {
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
}
