/**
 * @class Chicken
 * @description Repräsentiert einen normalen Hühner-Gegner.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
  y = 350;
  height = 80;
  width = 80;
  world;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/4_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/5_w.png",
  ];

  /**
   * Erzeugt eine Instanz eines Huhns.
   * @param {number} [x] - Optionale Start-X-Position. Wenn nicht angegeben, wird eine zufällige Position gewählt.
   */
  constructor(x) {
    super();
    this.loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");

    if (x !== undefined) {
      this.x = x;
    } else {
      this.x = 400 + Math.random() * 2000;
    }
    this.speed = 15 + Math.random() * 30; // pixels per second
  }

  /**
   * Main update loop for the chicken.
   * @param {number} deltaTime - Time since last frame.
   */
  update(deltaTime) {
    this.updateMovement(deltaTime);
    this.updateAnimation(deltaTime);
  }

  /**
   * Aktualisiert die horizontale Bewegung des Huhns.
   * @param {number} deltaTime - Die Zeit seit dem letzten Frame in Sekunden.
   * @returns {void}
   */
  updateMovement(deltaTime) {
    if (this.world && this.world.character) {
      if (this.x > this.world.character.x + 20) {
        this.x -= this.speed * deltaTime;
        this.otherDirection = false;
      } else if (this.x < this.world.character.x - 20) {
        this.x += this.speed * deltaTime;
        this.otherDirection = true;
      }
    }
  }

  /**
   * Aktualisiert die Animation des Huhns.
   * @param {number} deltaTime - Die Zeit seit dem letzten Frame in Sekunden.
   * @returns {void}
   */
  updateAnimation(deltaTime) {
    this.animationTimer += deltaTime;
    if (this.animationTimer > 0.2) {
      // 5fps
      this.playAnimation(this.IMAGES_WALKING);
      this.animationTimer = 0;
    }
  }
}
