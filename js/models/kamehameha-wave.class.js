/**
 * @class KamehamehaWave
 * @description Repräsentiert ein spezielles Projektil, das visuell einer Energiewelle ähnelt.
 * @extends MovableObject
 */
class KamehamehaWave extends MovableObject {
  width = 100;
  height = 100;

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * @param {number} x - Die Start-X-Position der Welle.
   * @param {number} y - Die Start-Y-Position der Welle.
   * @param {boolean} direction - Die Bewegungsrichtung (true für links, false für rechts).
   */
  constructor(x, y, direction) {
    super();
    this.loadImage(this.IMAGES_SPLASH[0]);
    this.loadImages(this.IMAGES_SPLASH);

    this.x = x;
    this.y = y;
    this.otherDirection = direction;
    this.shoot();
    this.animate();
  }

  /**
   * Startet die horizontale Bewegung des Projektils.
   * @returns {void}
   */
  shoot() {
    let speed = 40;
    this.setStoppableInterval(() => {
      if (this.otherDirection) {
        this.x -= speed;
      } else {
        this.x += speed;
      }
    }, 1000 / 60);
  }

  /**
   * Startet die Animationsschleife für das Projektil.
   * @returns {void}
   */
  animate() {
    this.setStoppableInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH);
    }, 50);
  }
}
