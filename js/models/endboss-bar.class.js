/**
 * @class EndbossBar
 * @description Repräsentiert die Lebensleiste des Endbosses, die oben im Bild angezeigt wird.
 */
class EndbossBar extends MovableObject {
  IMAGES = [
    "img/7_statusbars/2_statusbar_endboss/orange/0.png",
    "img/7_statusbars/2_statusbar_endboss/orange/20.png",
    "img/7_statusbars/2_statusbar_endboss/orange/40.png",
    "img/7_statusbars/2_statusbar_endboss/orange/60.png",
    "img/7_statusbars/2_statusbar_endboss/orange/80.png",
    "img/7_statusbars/2_statusbar_endboss/orange/100.png",
  ];

  percentage = 100;

  /**
   * Erzeugt eine Instanz der Endboss-Lebensleiste.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 500;
    this.y = 10;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Setzt den Füllstand der Leiste in Prozent und aktualisiert das angezeigte Bild.
   * @param {number} percentage - Der neue Prozentwert (0-100).
   * @returns {void}
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    if (this.imageCache[path]) {
      this.img = this.imageCache[path];
    }
  }

  /**
   * Ermittelt den Index des zu verwendenden Bildes basierend auf dem aktuellen Prozentwert.
   * @returns {number} Der Index des Bildes im `IMAGES`-Array.
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
