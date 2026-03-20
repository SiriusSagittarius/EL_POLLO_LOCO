/**
 * @class BackgroundObject
 * @description Repräsentiert ein statisches oder parallax-scrollendes Hintergrundobjekt.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  width = 1902;
  height = 480;
  parallaxFactor;

  /**
   * @param {string} imagePath - Der Pfad zum Bild des Hintergrundobjekts.
   * @param {number} x - Die anfängliche X-Position.
   * @param {number} [parallaxFactor=1] - Der Faktor für den Parallax-Scrolling-Effekt.
   */
  constructor(imagePath, x, parallaxFactor = 1) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
    this.parallaxFactor = parallaxFactor;
  }
}
