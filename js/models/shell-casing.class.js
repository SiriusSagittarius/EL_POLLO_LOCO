/**
 * @class ShellCasing
 * @description Repräsentiert eine ausgeworfene Patronenhülse als visuellen Effekt beim Schießen.
 * @extends MovableObject
 */
class ShellCasing extends MovableObject {
  /**
   * @param {number} x - Die Start-X-Position der Hülse.
   * @param {number} y - Die Start-Y-Position der Hülse.
   * @param {boolean} characterDirection - Die Richtung des Charakters, um die Auswurfrichtung zu bestimmen.
   */
  constructor(x, y, characterDirection) {
    super();
    this.loadImage(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYGBg+A8AAQQBAHAgZQsAAAAASUVORK5CYII=",
    );
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 5;

    this.speedY = 5 + Math.random() * 3;
    this.speedX = characterDirection
      ? 2 + Math.random() * 2
      : -2 - Math.random() * 2;
    this.angularVelocity = (Math.random() - 0.5) * 0.5;

    this.applyShellGravity();
    this.fadeOut();
  }

  /**
   * Wendet eine Gravitationssimulation auf die Hülse an, damit sie zu Boden fällt.
   * @returns {void}
   */
  applyShellGravity() {
    const gravityInterval = setInterval(() => {
      this.y -= this.speedY;
      this.speedY -= 0.4;
      this.x += this.speedX;
      this.angle += this.angularVelocity;

      if (this.y > 420) {
        clearInterval(gravityInterval);
      }
    }, 1000 / 60);
  }

  /**
   * Markiert die Hülse nach einer Verzögerung zum Löschen.
   * @returns {void}
   */
  fadeOut() {
    setTimeout(() => {
      this.toDelete = true;
    }, 2000);
  }
}
