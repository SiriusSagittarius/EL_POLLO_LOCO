/**
 * @class ThrowableBottle
 * @description Repräsentiert eine werfbare Salsa-Flasche, die als Waffe genutzt werden kann.
 */
class ThrowableBottle extends MovableObject {
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * @param {number} x - Die Start-X-Position der Flasche.
   * @param {number} y - Die Start-Y-Position der Flasche.
   * @param {boolean} direction - Die Wurfrichtung (true für links, false für rechts).
   */
  constructor(x, y, direction) {
    super();
    this.loadImage(this.IMAGES_ROTATION[0]);
    this.loadImages(this.IMAGES_ROTATION);
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 70;
    this.otherDirection = direction;
    this.throw();
  }

  /**
   * Wendet Gravitation auf die Flasche an, sodass sie in einer ballistischen Kurve fliegt.
   * @returns {void}
   */
  applyGravity() {
    this.setStoppableInterval(() => {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
    }, 1000 / 25);
  }

  /**
   * Führt die Wurf-Aktion (inklusive Gravitation, Bewegung und Rotation) aus.
   * @returns {void}
   */
  throw() {
    this.speedY = 20;
    this.applyGravity();
    this.setStoppableInterval(() => {
      this.x += this.otherDirection ? -12 : 12;
      this.playAnimation(this.IMAGES_ROTATION);
    }, 1000 / 25);
  }
}
