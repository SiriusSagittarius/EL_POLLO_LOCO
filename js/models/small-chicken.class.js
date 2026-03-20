/**
 * @class SmallChicken
 * @description Repräsentiert einen kleinen, schnellen Hühner-Gegner.
 * @extends MovableObject
 */
class SmallChicken extends MovableObject {
  y = 380;
  height = 50;
  width = 50;
  world;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /**
   * Erzeugt eine Instanz eines kleinen Huhns.
   * @param {number} [x] - Optionale Start-X-Position. Wenn nicht angegeben, wird eine zufällige Position gewählt.
   */
  constructor(x) {
    super();
    this.loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");

    if (x !== undefined) {
      this.x = x;
    } else {
      this.x = 400 + Math.random() * 3000;
    }
    this.speed = 1.0 + Math.random() * 2.0;

    this.animate();
  }

  /**
   * Startet die Bewegungs- und Animationslogik für das kleine Huhn.
   * @returns {void}
   */
  animate() {
    this.setStoppableInterval(() => {
      if (
        this.world &&
        this.world.character &&
        !this.world.character.isFlying
      ) {
        if (this.x > this.world.character.x + 50) {
          this.x -= this.speed;
          this.otherDirection = false;
        } else if (this.x < this.world.character.x - 50) {
          this.x += this.speed;
          this.otherDirection = true;
        }
      } else {
        this.x -= this.speed;
      }
    }, 1000 / 60);

    this.setStoppableInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 100);
  }
}
