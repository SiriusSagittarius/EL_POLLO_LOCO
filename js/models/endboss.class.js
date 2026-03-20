/**
 * @class Endboss
 * Repräsentiert den Endboss des Spiels.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  speed = 2.5;

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  attack_sound = new Audio("audio/boss_attack.mp3");
  dead_sound = new Audio("audio/boss_dead.mp3");
  playedDeathSound = false;

  /**
   * Initialisiert den Endboss.
   * @returns {void}
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_ALERT[0]);
    this.x = 2500;
    this.energy = 100;
    this.animate();
  }

  /**
   * Startet die Animations- und Bewegungsintervalle des Endbosses.
   * @returns {void}
   */
  animate() {
    this.setStoppableInterval(() => {
      if (
        this.world &&
        this.world.character &&
        !this.isHurt() &&
        !this.isDead()
      ) {
        this.moveTowardsPepe();
      }
    }, 1000 / 60);

    this.setStoppableInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
        if (!this.playedDeathSound) {
          this.dead_sound.play().catch(() => {});
          this.playedDeathSound = true;
        }
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.world && this.world.character && this.isPlayerClose()) {
        this.playAnimation(this.IMAGES_ATTACK);

        if (this.attack_sound.paused) {
          this.attack_sound.play().catch(() => {});
        }
      } else {
        this.playAnimation(this.IMAGES_ALERT);
      }
    }, 200);
  }

  /**
   * Aktualisiert die Spiellautstärke für die Effekte des Bosses.
   * @param {number} volume - Lautstärkewert (0.0 bis 1.0).
   * @returns {void}
   */
  updateVolume(volume) {
    this.attack_sound.volume = volume;
    this.dead_sound.volume = volume;
  }

  /**
   * Bewegt den Endboss in Richtung des Spielers.
   * @returns {void}
   */
  moveTowardsPepe() {
    if (this.x > this.world.character.x) {
      this.x -= this.speed;
      this.otherDirection = false;
    } else {
      this.x += this.speed;
      this.otherDirection = true;
    }
  }

  /**
   * Prüft, ob der Spieler sich in Reichweite für einen Angriff befindet.
   * @returns {boolean} True, wenn der Spieler nah genug ist.
   */
  isPlayerClose() {
    if (!this.world || !this.world.character) return false;
    return Math.abs(this.x - this.world.character.x) < 900;
  }
}
