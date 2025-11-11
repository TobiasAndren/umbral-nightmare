import Phaser from "phaser";
import type { GameAudio } from "../helpers/gameAudio/GameAudio";

export function setupPlayerHealth(
  player: Phaser.Physics.Arcade.Sprite,
  scene: Phaser.Scene,
  maxHealth: number = 5,
  heartPosX: number = 410,
  heartPosY: number = 195,
  audio?: GameAudio
) {
  const hearts: Phaser.GameObjects.Image[] = [];
  for (let i = 0; i < maxHealth; i++) {
    const heart = scene.add
      .image(heartPosX + i * 24, heartPosY, "full_heart")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(0.02);
    hearts.push(heart);
  }

  player.setData("health", maxHealth);
  player.setData("isInvincible", false);
  player.setData("maxHealth", maxHealth);

  function updateHearts(currentHealth: number) {
    for (let i = 0; i < hearts.length; i++) {
      if (i < currentHealth) {
        hearts[i].setTexture("full_heart");
      } else {
        if (hearts[i].texture.key !== "empty_heart") {
          scene.tweens.add({
            targets: hearts[i],
            delay: (maxHealth - 1 - i) * 150,
            onStart: () => hearts[i].setTexture("empty_heart"),
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

  player.on("takeDamage", (amount: number, sourceX?: number) => {
    if (player.getData("isInvincible")) return;

    const oldHealth = player.getData("health");
    const newHealth = Math.max(0, oldHealth - amount);
    player.setData("health", newHealth);
    player.emit("healthChanged", newHealth);

    updateHearts(newHealth);

    const direction = sourceX ? Math.sign(player.x - sourceX) : 1;
    const baseKnockback = 1000;
    const knockbackY = -250;

    player.setData("isKnockedBack", true);

    player.setVelocity(baseKnockback * direction, knockbackY);

    scene.tweens.add({
      targets: player.body!.velocity,
      x: 0,
      y: 0,
      ease: "Expo.easeOut",
      duration: 400,
      onComplete: () => {
        player.setData("isKnockedBack", false);
      },
    });

    audio?.playSFX("player_hurt_audio");
    player.anims.play("hurt", true);

    player.setData("isInvincible", true);
    scene.time.delayedCall(500, () => {
      player.setData("isInvincible", false);
    });

    if (newHealth <= 0) {
      handlePlayerDeath();
    }
  });

  function handlePlayerDeath() {
    player.setData("isDead", true);
    player.anims.play("death");
    player.setVelocity(0);
    player.body!.enable = false;

    if (audio) {
      Object.keys(audio.bgMusic).forEach((key) => {
        const music = audio.bgMusic[key];
        if (music.isPlaying) {
          const webAudio = music as Phaser.Sound.WebAudioSound;
          scene.tweens.add({
            targets: music,
            volume: { from: webAudio.volume, to: 0 },
            duration: 1000,
            ease: "Linear",
            onComplete: () => music.stop(),
          });
        }
      });
    }

    const camera = scene.cameras.main;
    camera.fadeOut(2000, 0, 0, 0);

    player.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "death",
      () => {
        scene.time.delayedCall(1000, () => {
          if (audio) {
            audio.stopAllAudio();
          }
          scene.scene.start("DeathMenuScene");
        });
      }
    );
  }

  scene.events.on("update", () => {
    if (player.y > 600 && player.active && !player.getData("isDead")) {
      player.setData("isDead", true);
      player.emit("takeDamage", maxHealth);
    }
  });

  return {
    updateHearts,
  };
}
