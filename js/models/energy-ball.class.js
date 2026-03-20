/**
 * @class EnergyBall
 * @description Repräsentiert einen Energieball, der als einsammelbares Item dient, um Leben wiederherzustellen.
 * @extends MovableObject
 */
class EnergyBall extends MovableObject {
  width = 100;
  height = 100;

  /**
   * @param {number} x - Die X-Startposition des Energieballs.
   * @param {number} y - Die Y-Startposition des Energieballs.
   * @param {boolean} direction - Die anfängliche Bewegungsrichtung.
   */
  constructor(x, y, direction) {
    super();
    this.loadImage("img/effects/energy_ball.png");
    this.x = x;
    this.y = y;
    this.otherDirection = direction;
    this.shoot();
  }

  /**
   * Startet die Bewegung des Energieballs.
   * @returns {void}
   */
  shoot() {
    let speed = 15;
    this.setStoppableInterval(() => {
      if (this.otherDirection) {
        this.x -= speed;
      } else {
        this.x += speed;
      }
    }, 1000 / 60);
  }
}
