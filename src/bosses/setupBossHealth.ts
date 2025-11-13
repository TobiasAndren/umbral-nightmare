import Phaser from "phaser";
import Boss from "./Boss";

export function setupBossHealth(
  boss: Boss,
  scene: Phaser.Scene,
  maxHealth: number = 20,
  heartPosX: number = 830,
  heartPosY: number = 185,
  heartsPerRow: number = 10,
  spacing: number = 24,
  rowSpacing: number = 20
) {
  const hearts: Phaser.GameObjects.Image[] = [];

  for (let i = 0; i < maxHealth; i++) {
    const row = Math.floor(i / heartsPerRow);
    const col = i % heartsPerRow;

    const heart = scene.add
      .image(
        heartPosX + col * spacing,
        heartPosY + row * rowSpacing,
        "boss_full_heart"
      )
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(0.02);
    hearts.push(heart);
  }

  boss.setData("health", maxHealth);
  boss.setData("maxHealth", maxHealth);

  function updateHearts(currentHealth: number) {
    for (let i = 0; i < hearts.length; i++) {
      if (i < currentHealth) {
        hearts[i].setTexture("boss_full_heart");
      } else {
        if (hearts[i].texture.key !== "empty_heart") {
          scene.tweens.killTweensOf(hearts[i]);

          hearts[i].setTexture("empty_heart");

          scene.tweens.add({
            targets: hearts[i],
            scale: { from: 0.02, to: 0.015 },
            angle: { from: -5, to: 5 },
            yoyo: true,
            repeat: 2,
            duration: 100,
            ease: "Sine.easeInOut",
            onComplete: () => hearts[i].setAngle(0),
          });
        }
      }
    }
  }

  boss.on("takeDamage", (amount: number) => {
    const oldHealth = boss.getData("health");
    const newHealth = Math.max(0, oldHealth - amount);
    boss.setData("health", newHealth);
    updateHearts(newHealth);
  });

  return { updateHearts };
}
