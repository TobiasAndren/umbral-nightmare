import Phaser from "phaser";
import Boss from "./Boss";

export default class UndeadExecutioner extends Boss {
  private attackCooldown = false;
  private attackTimer?: Phaser.Time.TimerEvent;
  private projectileGroup!: Phaser.Physics.Arcade.Group;
  private currentAttackTimers: Phaser.Time.TimerEvent[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "boss_idle");

    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    this.projectileGroup = this.scene.physics.add.group({
      allowGravity: false,
    });
  }

  update() {
    super.update();
    if (this.isDead) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.velocity.x < 0) {
      this.setFlipX(true);
    } else if (body.velocity.x > 0) {
      this.setFlipX(false);
    }

    switch (this.state) {
      case "idle":
        this.idleLogic();
        break;
      case "attacking":
        break;
    }
  }

  private idleLogic() {
    if (this.attackCooldown || this.state === "attacking") return;

    const randomX = Phaser.Math.Between(300, 700);
    const randomY = Phaser.Math.Between(200, 400);
    this.scene.physics.moveTo(this, randomX, randomY, 80);

    this.scene.time.delayedCall(1000, () => {
      this.setVelocity(0, 0);
    });

    this.attackCooldown = true;
    this.state = "attacking";

    const pattern = Phaser.Math.RND.pick(["melee", "skill", "summon"]);

    switch (pattern) {
      case "melee":
        this.performMeleeAttack();
        break;
      case "skill":
        this.performSkillMove();
        break;
      case "summon":
        this.performSummon();
        break;
    }
  }

  private endAttack(delay: number = 4000) {
    const timer = this.scene.time.delayedCall(delay, () => {
      this.clearAttackTimers();
      this.state = "idle";
      this.attackCooldown = false;
      this.setVelocity(0, 0);
      this.play("boss_idle", true);
    });
    this.currentAttackTimers.push(timer);
  }

  private clearAttackTimers() {
    this.currentAttackTimers.forEach((t) => t.remove());
    this.currentAttackTimers = [];
  }

  private performMeleeAttack() {
    if (!this.player) return;

    this.clearAttackTimers();
    this.state = "attacking";

    const playerX = this.player.x;
    const direction = playerX < this.x ? -1 : 1;

    const attackRange = 100;
    const speed = 200;

    const checkDistance = () => {
      if (!this.player) return;
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.player.x,
        this.player.y
      );

      if (distance > attackRange) {
        this.scene.physics.moveToObject(this, this.player, speed);
        this.scene.time.delayedCall(50, checkDistance);
      } else {
        this.setVelocity(0, 0);
        this.play("boss_attack", true);

        const hit1 = this.scene.time.delayedCall(600, () =>
          this.triggerMeleeHit()
        );
        const hit2 = this.scene.time.delayedCall(900, () =>
          this.triggerMeleeHit()
        );
        this.currentAttackTimers.push(hit1, hit2);

        this.endAttack(2200);
      }
    };

    checkDistance();
  }

  private triggerMeleeHit() {
    console.log("Boss melee hit triggered");
  }

  private performSkillMove() {
    this.clearAttackTimers();

    const midX = 500;
    const move = this.scene.time.delayedCall(0, () => {
      this.scene.physics.moveTo(this, midX, this.y, 200);
    });

    const stop = this.scene.time.delayedCall(1000, () => {
      this.setVelocity(0, 0);
      this.play("boss_skill", true);

      for (let i = 0; i < 8; i++) {
        const ringTimer = this.scene.time.delayedCall(i * 300, () =>
          this.spawnProjectileRing()
        );
        this.currentAttackTimers.push(ringTimer);
      }
    });

    this.currentAttackTimers.push(move, stop);
    this.endAttack(4000);
  }

  private spawnProjectileRing() {
    const origin = new Phaser.Math.Vector2(this.x, this.y);
    for (let angle = 0; angle < 360; angle += 45) {
      const velocity = this.scene.physics.velocityFromAngle(angle, 200);
      const proj = this.projectileGroup.create(
        origin.x,
        origin.y,
        "boss_projectile"
      ) as Phaser.Physics.Arcade.Sprite;
      proj.setVelocity(velocity.x, velocity.y);
      proj.setScale(0.8);
      const destroyTimer = this.scene.time.delayedCall(3000, () =>
        proj.destroy()
      );
      this.currentAttackTimers.push(destroyTimer);
    }
  }

  private performSummon() {
    this.clearAttackTimers();
    this.setVelocity(0, 0);
    this.play("boss_summon", true);

    const summonInterval = this.scene.time.addEvent({
      delay: 2000,
      callback: () => this.spawnDemon(),
      loop: true,
    });

    const endTimer = this.scene.time.delayedCall(6000, () => {
      summonInterval.remove();
      this.state = "idle";
      this.attackCooldown = false;
      this.play("boss_idle", true);
    });

    this.currentAttackTimers.push(endTimer);
  }

  private spawnDemon() {
    const demon = this.scene.physics.add.sprite(this.x, this.y, "demon_idle");
    demon.setVelocityY(100);
    const destroy = this.scene.time.delayedCall(5000, () => demon.destroy());
    this.currentAttackTimers.push(destroy);
  }
}
