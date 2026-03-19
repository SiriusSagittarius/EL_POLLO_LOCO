/**
 * Basisklasse für alle beweglichen Objekte auf dem Spielfeld (Charakter, Gegner, Items).
 */
class MovableObject {
  x = 120;
  y = 250;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;
  imageLoaded = false;
  energy = 100;
  lastHit = 0;
  speedY = 0;
  acceleration = 2.5;
  angle = 0;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
  intervalIds = [];

  /**
   * Lädt ein einzelnes Bild anhand des Dateipfads.
   * @param {string} path - Relativer Pfad zum Bild.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.onload = () => {
      this.imageLoaded = true;
    };
    this.img.onerror = () => {
      console.warn("Bild konnte nicht geladen werden:", path);
    };
    this.img.src = path;
  }

  /**
   * Lädt ein Array von Bildern in den Cache (für Animationen).
   * @param {string[]} arr - Array mit Bildpfaden.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Startet ein Intervall und speichert die ID, damit es gestoppt werden kann.
   */
  setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    this.intervalIds.push(id);
  }

  /**
   * Stoppt alle laufenden Intervalle (Animationen/Bewegungen) dieses Objekts.
   */
  stopIntervals() {
    this.intervalIds.forEach(clearInterval);
    this.intervalIds = [];
  }

  /**
   * Wendet Gravitation auf das Objekt an, sodass es nach unten fällt.
   */
  applyGravity() {
    this.setStoppableInterval(() => {
      if ((this.isAboveGround() || this.speedY > 0) && !this.isFlying) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else if (!this.isFlying && this.y >= 150) {
        this.y = 150;
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  /**
   * Prüft, ob sich das Objekt aktuell in der Luft befindet.
   * @returns {boolean} True, wenn sich das Objekt in der Luft befindet.
   */
  isAboveGround() {
    return this.y < 150;
  }

  /**
   * Spielt eine Animation ab, indem es durch ein Array von Bildern iteriert.
   * @param {string[]} images - Array von Bildpfaden für die Animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];

    if (this.imageCache[path]) {
      this.img = this.imageCache[path];
    } else {
      this.img = new Image();
      this.img.src = path;
      this.imageCache[path] = this.img;
    }
    this.currentImage++;
  }

  /**
   * Prüft, ob dieses Objekt mit einem anderen Objekt kollidiert.
   * @param {MovableObject} mo - Das andere Objekt.
   * @returns {boolean} True bei einer Kollision.
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Reduziert die Energie des Objekts, wenn es getroffen wird.
   */
  hit(damage = 5) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Prüft, ob das Objekt gerade erst verletzt wurde (Unverwundbarkeits-Zeitfenster).
   * @returns {boolean} True, wenn kürzlich getroffen.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Prüft, ob das Objekt tot ist (Energie <= 0).
   * @returns {boolean} True, wenn tot.
   */
  isDead() {
    return this.energy == 0;
  }

  drawFrame(ctx) {
    if (
      this instanceof MovableObject &&
      this.constructor.name !== "BackgroundObject" &&
      this.constructor.name !== "Cloud"
    ) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.right - this.offset.left,
        this.height - this.offset.bottom - this.offset.top,
      );
      ctx.stroke();
    }
  }
}
