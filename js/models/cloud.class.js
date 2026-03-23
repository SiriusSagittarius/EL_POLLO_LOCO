/**
 * @class Cloud
 * @description Repräsentiert eine sich bewegende Wolke im Hintergrund.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;
  parallaxFactor = 0.15;
  speed = 0.15;

  /**
   * @param {number} x - Die anfängliche X-Position der Wolke.
   */
  constructor(x) {
    super();
    let randomImage = Math.random() < 0.5 ? "1.png" : "2.png";
    this.loadImage(`img/5_background/layers/4_clouds/${randomImage}`);

    this.x = x + Math.random() * 500;
    this.y = Math.random() * 50;
    this.speed = 0.1 + Math.random() * 0.2;
  }

  /**
   * Aktualisiert die Position der Wolke in jedem Frame.
   * @param {number} deltaTime - Die Zeit seit dem letzten Frame in Sekunden.
   * @returns {void}
   */
  update(deltaTime) {
    // Die Geschwindigkeit wird mit deltaTime multipliziert, um sie Frame-unabhängig zu machen.
    this.x -= this.speed * deltaTime * 60;
  }
}
