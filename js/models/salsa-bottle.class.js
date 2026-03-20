/**
 * @class SalsaBottle
 * @description Repräsentiert eine auf dem Boden liegende, einsammelbare Salsa-Flasche.
 * @extends MovableObject
 */
class SalsaBottle extends MovableObject {
  height = 60;
  width = 60;
  y = 370;

  /**
   * Erzeugt eine Instanz einer Salsa-Flasche an einer zufälligen Position.
   */
  constructor() {
    super();
    this.loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.x = 200 + Math.random() * 2000;
    this.offset = {
      top: 10,
      bottom: 10,
      left: 20,
      right: 20,
    };
  }
}
