/**
 * @class WorldRenderer
 * @description Lagert die gesamte Render-Logik (das Zeichnen auf den Canvas) aus der World-Klasse aus.
 */
class WorldRenderer {
  /**
   * @param {World} world - Referenz auf die Spielwelt (für Daten und Objekte).
   * @param {HTMLCanvasElement} canvas - Das HTML-Canvas-Element.
   */
  constructor(world, canvas) {
    this.world = world;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.flashImage = new Image();
    this.flashImage.src =
      "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png";
    this.bottleIcon = new Image();
    this.bottleIcon.src = "img/6_salsa_bottle/1_salsa_bottle_on_ground.png";
  }

  /**
   * Die zentrale Render-Schleife. Zeichnet jeden Frame alle Objekte neu auf das Canvas.
   * @returns {void}
   */
  draw() {
    if (!this.world.isActive) return;

    this.prepareFrame();
    this.drawWorldElements();
    this.drawGameObjects();
    this.finalizeFrame();
    this.drawUI();
    this.updateCamera();
  }

  /**
   * Bereitet den Frame vor (Canvas leeren, Kamera verschieben).
   */
  prepareFrame() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(
      this.world.camera_x + this.world.shake_x,
      this.world.shake_y,
    );
  }

  /**
   * Zeichnet alle statischen und parallax-scrollenden Hintergrundelemente.
   */
  drawWorldElements() {
    this.drawObjectsWithParallax(this.world.backgroundObjects);
    this.drawObjectsWithParallax(this.world.clouds);
  }

  /**
   * Zeichnet alle interaktiven Spielobjekte.
   */
  drawGameObjects() {
    if (this.world.character.imageLoaded) this.addToMap(this.world.character);
    this.drawObjects(this.world.enemies);
    this.drawObjects(this.world.bullets);
    this.drawObjects(this.world.casings);
    this.drawObjects(this.world.explosions);
    this.drawObjects(this.world.throwableObjects);
    this.drawParticles();
    this.drawObjects(this.world.coins);
    this.drawObjects(this.world.salsaBottles);
    this.drawObjects(this.world.energyBalls);
  }

  /**
   * Setzt die Kamera-Transformation zurück.
   */
  finalizeFrame() {
    this.ctx.translate(
      -this.world.camera_x - this.world.shake_x,
      -this.world.shake_y,
    );
  }

  /**
   * Zeichnet alle Elemente der Benutzeroberfläche (UI).
   */
  drawUI() {
    this.addToMap(this.world.statusBar);
    this.drawHealthBarPercentage();
    this.addToMap(this.world.coinBar);
    this.drawScoreAndBottles();
    this.drawLevelInfo();
    if (this.world.isShowingWrongWay) this.drawWrongWayMessage();
    this.drawIngameTip();
  }

  /**
   * Zeichnet den prozentualen Lebenswert auf die Lebensleiste.
   */
  drawHealthBarPercentage() {
    const healthPercentage = Math.round(this.world.character.energy);
    const text = `${healthPercentage}%`;

    this.ctx.font = "20px sans-serif";
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";

    const bar = this.world.statusBar;
    this.ctx.fillText(text, bar.x + bar.width / 2, bar.y + bar.height / 2 + 17);

    this.ctx.textAlign = "start";
  }

  /**
   * Aktualisiert die Kameraposition.
   */
  updateCamera() {
    this.world.camera_x = -this.world.character.x + 100;
  }

  /**
   * Zeichnet den In-Game-Tipp, falls er aktiv ist.
   * @returns {void}
   */
  drawIngameTip() {
    if (!this.world.showPepistolTip) return;

    const tipText1 =
      'Tipp: Durch die magischen Uzis verwandelt sich Pepe beim Schießen in "Pepistol".';
    const tipText2 =
      "Er vollführt wilde Aktionen, wenn man das Mausrad bewegt!";

    this.ctx.save();

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    const boxWidth = 800;
    const boxHeight = 100;
    const boxX = (this.canvas.width - boxWidth) / 2;
    const boxY = this.canvas.height - boxHeight - 20;
    this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 16px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText(tipText1, this.canvas.width / 2, boxY + 40);
    this.ctx.font = "16px sans-serif";
    this.ctx.fillText(tipText2, this.canvas.width / 2, boxY + 70);

    this.ctx.restore();
  }

  /**
   * Hilfsfunktion zum Zeichnen von Objekt-Arrays.
   * @param {MovableObject[]} objects - Das zu zeichnende Array.
   */
  drawObjects(objects) {
    objects.forEach((obj) => {
      if (obj.imageLoaded !== false && this.isVisible(obj)) {
        this.addToMap(obj);
      }
    });
  }

  /**
   * Hilfsfunktion zum Zeichnen von Objekt-Arrays mit Parallax-Effekt.
   * @param {BackgroundObject[]} objects - Das zu zeichnende Array.
   */
  drawObjectsWithParallax(objects) {
    objects.forEach((bgo) => {
      if (this.isVisible(bgo) && bgo.img) {
        const parallaxOffset = this.world.camera_x * (bgo.parallaxFactor - 1);
        this.ctx.drawImage(
          bgo.img,
          bgo.x + parallaxOffset,
          bgo.y,
          bgo.width,
          bgo.height,
        );
      }
    });
  }

  /**
   * Zeichnet Partikel, die eine eigene `draw`-Methode haben.
   */
  drawParticles() {
    this.world.particles.forEach((particle) => {
      if (this.isVisible(particle)) particle.draw(this.ctx);
    });
  }

  /**
   * Zeichnet den Punktestand und die Anzahl der Flaschen.
   */
  drawScoreAndBottles() {
    this.ctx.font = "40px sans-serif";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("+ " + this.world.score, 320, 100);
    if (this.bottleIcon.complete)
      this.ctx.drawImage(this.bottleIcon, 30, 105, 35, 35);
    this.ctx.font = "28px sans-serif";
    this.ctx.fillText("x " + this.world.character.bottles, 75, 133);
  }

  /**
   * Zeichnet die Level- und Zeitinformationen oder die Boss-Lebensleiste.
   */
  drawLevelInfo() {
    if (this.world.levelManager.bossSpawned) {
      this.addToMap(this.world.endbossBar);
    } else {
      this.ctx.font = "30px sans-serif";
      this.ctx.textAlign = "center";
      const time =
        this.world.levelManager.maxLevelTime -
        this.world.levelManager.levelTimer;
      this.ctx.fillText(
        `Level: ${this.world.levelManager.level} | Zeit: ${time}s`,
        360,
        50,
      );
      this.ctx.textAlign = "start";
    }
  }

  drawWrongWayMessage() {
    this.ctx.save();
    this.ctx.font = "bold 40px sans-serif";
    this.ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.textAlign = "center";
    const text = "FALSCHE RICHTUNG!";
    this.ctx.strokeText(text, this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.restore();
  }

  /**
   * Prüft, ob ein Objekt aktuell im sichtbaren Bereich der Kamera ist.
   * @param {MovableObject} mo - Das zu prüfende Objekt.
   * @returns {boolean} True, wenn das Objekt sichtbar ist.
   */
  isVisible(mo) {
    const parallax = mo.parallaxFactor !== undefined ? mo.parallaxFactor : 1;
    const screenX = mo.x + this.world.camera_x * parallax;
    return screenX + mo.width > -100 && screenX < this.canvas.width + 100;
  }

  /**
   * Zeichnet ein Objekt auf die Karte, inkl. möglicher Spiegelung und Rotation.
   * @param {MovableObject} mo - Das zu zeichnende Objekt.
   * @returns {void}
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    let rotate = mo.angle && mo.angle !== 0;

    if (rotate) {
      this.ctx.save();
      this.ctx.translate(mo.x + mo.width / 2, mo.y + mo.height / 2);

      if (mo instanceof Character && mo.isUpsideDown) {
        this.ctx.scale(1, -1);
      }

      this.ctx.rotate(mo.angle);

      if (mo instanceof Character && mo.impaledChicken) {
        this.ctx.save();
        this.ctx.translate(120, 1);

        let isFlashing =
          new Date().getTime() - this.world.chickenFlashTime < 100;
        if (isFlashing) this.ctx.filter = "brightness(200%)";

        let chickenAnimIndex =
          Math.floor(new Date().getTime() / 500) %
          mo.IMPALED_CHICKEN_IMAGES.length;
        let chickenImgPath = mo.IMPALED_CHICKEN_IMAGES[chickenAnimIndex];
        let chickenImg = mo.imageCache[chickenImgPath];

        if (chickenImg) {
          this.ctx.save();
          this.ctx.scale(-1, 1);
          this.ctx.drawImage(chickenImg, -75, -75, 150, 150);
          this.ctx.restore();
        }
        this.ctx.filter = "none";

        if (isFlashing && this.flashImage.complete) {
          this.ctx.drawImage(this.flashImage, -40, -40, 80, 80);
        }
        this.ctx.restore();
      }
    }

    try {
      if (mo.img) {
        if (rotate) {
          this.ctx.drawImage(
            mo.img,
            -mo.width / 2,
            -mo.height / 2,
            mo.width,
            mo.height,
          );
        } else {
          this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        }
      }
    } catch (e) {
      console.warn("Fehler beim Zeichnen:", e);
    }

    if (rotate) this.ctx.restore();
    if (mo.otherDirection) this.flipImageBack(mo);

    if (
      !rotate &&
      (mo instanceof Chicken ||
        mo instanceof SmallChicken ||
        mo instanceof Endboss) &&
      !mo.isDead()
    ) {
      this.drawEnemyHealthBar(mo);
    }
  }

  /**
   * Zeichnet einen dynamischen Lebensbalken direkt über gewöhnlichen Feinden oder den großen Bossbalken.
   * @param {MovableObject} mo - Das Gegner-Objekt.
   * @returns {void}
   */
  drawEnemyHealthBar(mo) {
    if (!this.ctx) return;
    if (mo instanceof Endboss) {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(mo.x + 20, mo.y + 40, mo.width - 40, 15);
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(mo.x + 22, mo.y + 42, mo.width - 44, 11);
      this.ctx.fillStyle = "#ffae00";
      let healthPercent = mo.energy / 100;
      if (healthPercent < 0) healthPercent = 0;
      this.ctx.fillRect(
        mo.x + 22,
        mo.y + 42,
        (mo.width - 44) * healthPercent,
        11,
      );
    } else {
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(mo.x, mo.y - 10, mo.width, 5);
      this.ctx.fillStyle = "limegreen";
      let healthPercent = mo.energy / 100;
      if (healthPercent < 0) healthPercent = 0;
      this.ctx.fillRect(mo.x, mo.y - 10, mo.width * healthPercent, 5);
    }
  }

  /**
   * Spiegelt den Canvas horizontal, damit Objekte in die entgegengesetzte Richtung schauen.
   * @param {MovableObject} mo - Das zu spiegelnde Objekt.
   * @returns {void}
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Setzt die Canvas-Spiegelung für nachfolgende Objekte zurück.
   * @param {MovableObject} mo - Das zuvor gespiegelte Objekt.
   * @returns {void}
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
