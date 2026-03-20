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
    this.speed = 0.15 + Math.random() * 0.5;

    this.animate();
  }

  /**
   * Startet die Bewegungs- und Animationslogik für das Huhn.
   * @returns {void}
   */
  animate() {
    this.setStoppableInterval(() => {
      if (this.world && this.world.character) {
        if (this.x > this.world.character.x + 20) {
          this.x -= this.speed;
          this.otherDirection = false;
        } else if (this.x < this.world.character.x - 20) {
          this.x += this.speed;
          this.otherDirection = true;
        }
      } else {
        this.x -= this.speed;
      }
    }, 1000 / 60);

    this.setStoppableInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }
}
