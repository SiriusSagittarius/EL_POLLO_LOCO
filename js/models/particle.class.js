/**
 * @class Particle
 * @description Repräsentiert ein kleines Partikel für visuelle Effekte wie Staub, Rauch oder Funken.
 * @extends MovableObject
 */
class Particle extends MovableObject {
  /**
   * @param {number} x - Die Start-X-Position des Partikels.
   * @param {number} y - Die Start-Y-Position des Partikels.
   * @param {string} [color="rgba(160, 82, 45, 1)"] - Die Farbe des Partikels.
   */
  constructor(x, y, color = "rgba(160, 82, 45, 1)") {
    super();
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = Math.random() * 10 + 5;
    this.height = this.width;

    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * 2 + 1;

    this.alpha = 1;
    this.animate();
  }

  /**
   * Startet die Animation des Partikels (Bewegung und Ausblenden).
   * @returns {void}
   */
  animate() {
    let interval = setInterval(() => {
      this.x += this.speedX;
      this.y -= this.speedY;
      this.alpha -= 0.05;
      if (this.alpha <= 0) {
        clearInterval(interval);
        this.toDelete = true;
      }
    }, 1000 / 60);
  }

  /**
   * Zeichnet das Partikel auf den Canvas.
   * @param {CanvasRenderingContext2D} ctx - Der 2D-Rendering-Kontext.
   * @returns {void}
   */
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
}
