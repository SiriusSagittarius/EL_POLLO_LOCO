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
    this.gravityEnabled = true;
    this.speedY = 500;
  }

  /**
   * Main update loop for the bottle.
   * @param {number} deltaTime - Time since last frame.
   */
  update(deltaTime) {
    super.update(deltaTime);
    this.updateMovement(deltaTime);
    this.updateAnimation(deltaTime);
  }

  /**
   * Überschreibt die Schwerkraft-Logik für Flaschen, damit sie tiefer fallen (auf Bodenhöhe der Hühner).
   */
  updateGravity(deltaTime) {
    if (this.isAboveGround() || this.speedY > 0) {
      this.y -= this.speedY * deltaTime;
      this.speedY -= this.acceleration * deltaTime;
    }
  }

  isAboveGround() {
    // Bodenhöhe für Flaschen (ca. 360), damit sie die Gegner erreichen
    return this.y < 360;
  }

  /**
   * Aktualisiert die horizontale Bewegung der Flasche.
   * @param {number} deltaTime - Die Zeit seit dem letzten Frame.
   * @returns {void}
   */
  updateMovement(deltaTime) {
    const horizontalSpeed = 300;
    this.x +=
      (this.otherDirection ? -horizontalSpeed : horizontalSpeed) * deltaTime;
  }

  /**
   * Aktualisiert die Rotations-Animation der Flasche.
   * @param {number} deltaTime - Die Zeit seit dem letzten Frame.
   * @returns {void}
   */
  updateAnimation(deltaTime) {
    this.animationTimer += deltaTime;
    if (this.animationTimer > 1 / 25) {
      this.playAnimation(this.IMAGES_ROTATION);
      this.animationTimer = 0;
    }
  }
}
