/**
 * @class MovableObject
 * @description Basisklasse für alle beweglichen Objekte im Spiel (Charakter, Gegner, Items etc.).
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
  acceleration = 1500;
  angle = 0;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
  intervalIds = [];
  animationTimer = 0;
  gravityEnabled = false;

  /**
   * Lädt ein einzelnes Bild anhand des Dateipfads.
   * @param {string} path - Relativer Pfad zum Bild.
   * @returns {void}
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
   * @returns {void}
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Registriert eine Intervallfunktion und speichert deren ID, um sie später stoppen zu können.
   * @param {Function} fn - Die auszuführende Funktion.
   * @param {number} time - Das Intervall in Millisekunden.
   * @returns {void}
   */
  setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    this.intervalIds.push(id);
  }

  /**
   * Stoppt alle laufenden Intervalle (Animationen/Bewegungen) dieses Objekts.
   * @returns {void}
   */
  stopIntervals() {
    this.intervalIds.forEach(clearInterval);
    this.intervalIds = [];
  }

  /**
   * The main update function, to be called every frame from the world loop.
   * @param {number} deltaTime - The time since the last frame in seconds.
   */
  update(deltaTime) {
    if (this.gravityEnabled) {
      this.updateGravity(deltaTime);
    }
  }

  /**
   * Updates the object's vertical position based on gravity.
   * @param {number} deltaTime - The time since the last frame in seconds.
   */
  updateGravity(deltaTime) {
    if (this.isAboveGround() || this.speedY > 0) {
      this.y -= this.speedY * deltaTime;
      this.speedY -= this.acceleration * deltaTime;
    } else if (this.y > 150) {
      this.y = 150;
      this.speedY = 0;
    }
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
   * @returns {void}
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
   * Verringert die Energie des Objekts um einen bestimmten Betrag.
   * @param {number} [damage=5] - Der zugefügte Schaden.
   * @returns {void}
   */
  hit(damage = 5) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    }
    this.lastHit = new Date().getTime();
  }

  /**
   * Prüft, ob das Objekt gerade erst verletzt wurde (Unverwundbarkeits-Zeitfenster).
   * @returns {boolean} True, wenn seit dem letzten Treffer weniger als 1 Sekunde vergangen ist.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Prüft, ob das Objekt tot ist (Energie <= 0).
   * @returns {boolean} True, wenn die Energie 0 ist.
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Zeichnet einen Debug-Rahmen (Hitbox) um das Objekt.
   * @param {CanvasRenderingContext2D} ctx - Der 2D-Rendering-Kontext des Canvas.
   * @returns {void}
   */
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
