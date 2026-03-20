/**
 * Repräsentiert die zentrale Spielwelt.
 * Sie verwaltet den Game-Loop, das Rendering auf dem Canvas und verknüpft alle Logik-Komponenten.
 */
class World {
  character;
  enemies = [];
  bullets = [];
  explosions = [];
  casings = [];
  particles = [];
  clouds = [];
  coins = [];
  salsaBottles = [];
  throwableObjects = [];
  backgroundObjects = [];
  energyBalls = [];
  statusBar = new StatusBar();
  coinBar = new CoinBar();
  endbossBar = new EndbossBar();
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  runInterval;
  bossSpawned = false;
  bossDying = false;
  isActive = true;
  score = 0;
  highscore = 0;
  highscoreName = "Anonym";
  volume = 1;
  shake_x = 0;
  shake_y = 0;
  chickenFlashTime = 0;

  levelManager;
  collisionManager;
  combatManager;
  renderer;

  shotgun_sound = new Audio("audio/shotgun.mp3");
  chicken_dead_sound = new Audio("audio/chickenDead.mp3");
  background_sound =
    typeof background_sound !== "undefined"
      ? background_sound
      : new Audio("audio/hauptspiel.wav");
  coin_sound = new Audio("audio/coin.mp3");
  gatling_sound = new Audio("audio/gatlinggun.mp3");
  chickenshot_sound = new Audio("audio/chickenshot.mp3");

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character = new Character();

    this.levelManager = new LevelManager(this);
    this.collisionManager = new CollisionManager(this);
    this.combatManager = new CombatManager(this);
    this.renderer = new WorldRenderer(this, canvas);

    try {
      let storedList = JSON.parse(localStorage.getItem("highscoreList"));
      if (storedList && Array.isArray(storedList) && storedList.length > 0) {
        this.highscore = storedList[0].score;
        this.highscoreName = storedList[0].name;
      }
    } catch (e) {
      console.log("No highscores yet or format change.");
    }

    this.levelManager.startLevelLogic();
    this.levelManager.spawnCoins();
    this.levelManager.spawnSalsaBottles();
    this.levelManager.updateBackground();
    this.levelManager.updateClouds();

    this.setWorld();
    this.renderer.draw();
    this.run();
    this.background_sound.loop = true;
    this.background_sound.currentTime = 0;
    this.background_sound.play().catch(() => {});
  }

  /**
   * Verknüpft die Welt mit den Objekten, damit diese Zugriff auf die Welt haben.
   */
  setWorld() {
    this.character.world = this;
    this.enemies.forEach((enemy) => (enemy.world = this));
  }

  /**
   * Startet die Haupt-Spielschleife (Game Loop).
   */
  run() {
    this.runInterval = setInterval(() => {
      this.combatManager.checkShooting();
      this.combatManager.checkThrowing();
      this.collisionManager.checkCollisions();
      this.levelManager.checkBossSpawn();
      this.checkExplosions();
      this.checkCasings();
      this.checkParticles();
      this.levelManager.updateBackground();
      this.levelManager.updateClouds();
      this.updateCharacterAngle();
      this.updateFuel();
      this.cleanupResources();
    }, 1000 / 60);
  }

  /**
   * Pausiert das Spiel und stoppt alle aktiven Game-Loops.
   */
  stopGame() {
    clearInterval(this.runInterval);
    this.levelManager.stop();
    this.background_sound.pause();
    this.character.stopIntervals();
    this.isActive = false;
  }

  /**
   * Aktualisiert den Treibstoff (Münzleiste) während des Fliegens.
   * Wenn der Treibstoff leer ist, fällt Pepe automatisch zu Boden.
   */
  updateFuel() {
    if (this.character.isFlying) {
      let currentFuel = this.coinBar.percentage;
      currentFuel -= 0.0375;
      if (currentFuel <= 0) {
        currentFuel = 0;
        if (this.character.isFlying) {
          this.character.toggleFlying();
        }
        if (this.character.currentWeapon === "broom") {
          this.character.currentWeapon = "uzi";
        }
      }
      this.coinBar.setPercentage(currentFuel);
    }
  }

  /**
   * Richtet den fliegenden Charakter in Richtung des Mauszeigers (Fadenkreuz) aus.
   */
  updateCharacterAngle() {
    if (this.character.isFlying) {
      let worldMouseX = mousePosition.x - this.camera_x - this.shake_x;
      let worldMouseY = mousePosition.y - this.shake_y;

      let charCenterX = this.character.x + this.character.width / 2;
      let charCenterY = this.character.y + this.character.height / 2;

      let dx = worldMouseX - charCenterX;
      let dy = worldMouseY - charCenterY;

      this.character.worldAngle = Math.atan2(dy, dx);
      this.character.otherDirection = dx < 0;

      if (this.character.otherDirection) {
        this.character.angle = Math.atan2(dy, -dx);
      } else {
        this.character.angle = Math.atan2(dy, dx);
      }
    }
  }

  /**
   * Aktualisiert die allgemeine Spiellautstärke.
   * @param {number} volume - Der neue Lautstärke-Wert.
   */
  updateVolume(volume) {
    this.volume = volume;
    this.background_sound.volume = volume;
    this.shotgun_sound.volume = volume;
    this.chicken_dead_sound.volume = volume;
    this.coin_sound.volume = volume;
    this.gatling_sound.volume = volume;

    if (this.character) {
      this.character.updateVolume(volume);
    }

    this.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.updateVolume(volume);
      }
    });
  }

  /**
   * Sammelt eine Münze auf und füllt damit den Flugbesen-Treibstoff.
   * @param {number} index - Index der Münze im Welt-Array.
   */
  collectCoin(index) {
    this.coins.splice(index, 1);
    this.score += 50;
    this.checkHighscore();

    let sound = this.coin_sound.cloneNode(true);
    sound.volume = this.volume;
    sound.play().catch(() => {});

    let newPercentage = this.coinBar.percentage + 20;

    if (newPercentage >= 100) {
      newPercentage = 100;
      if (!this.character.isFlying) {
        this.character.currentWeapon = "broom";
        this.character.toggleFlying();
      }
    }

    this.coinBar.setPercentage(newPercentage);
    console.log("Münze gesammelt! Neuer Stand:", newPercentage);
  }

  /**
   * Entfernt Objekte (Feinde, Münzen, Items), die weit hinter dem Spieler liegen,
   * um Speicherplatz und Rechenleistung (Performance) zu sparen.
   */
  cleanupResources() {
    let leftBoundary = this.character.x - 800;

    this.coins = this.coins.filter((c) => {
      const keep = c.x > leftBoundary;
      if (!keep) c.stopIntervals();
      return keep;
    });

    this.salsaBottles = this.salsaBottles.filter((s) => {
      const keep = s.x > leftBoundary;
      if (!keep) s.stopIntervals();
      return keep;
    });

    this.enemies = this.enemies.filter((e) => {
      if (e instanceof Endboss) return true;
      const keep = e.x > leftBoundary;
      if (!keep) e.stopIntervals();
      return keep;
    });

    this.throwableObjects = this.throwableObjects.filter((b) => {
      const keep = b.x > leftBoundary && b.y < 600 && !b.toDelete;
      if (!keep) b.stopIntervals();
      return keep;
    });
  }

  /**
   * Bereinigt gelöschte oder abgelaufene Explosionen aus dem Array.
   */
  checkExplosions() {
    this.explosions = this.explosions.filter((e) => !e.toDelete);
  }

  /**
   * Bereinigt gelöschte oder abgelaufene Patronenhülsen aus dem Array.
   */
  checkCasings() {
    this.casings = this.casings.filter((casing) => !casing.toDelete);
  }

  /**
   * Aktualisiert und zeichnet Lauf-Partikel (Staub) am Boden und entfernt alte Partikel.
   */
  checkParticles() {
    this.particles = this.particles.filter((p) => !p.toDelete);

    if (
      (this.keyboard.RIGHT || this.keyboard.LEFT) &&
      !this.character.isAboveGround()
    ) {
      let x =
        this.character.x + this.character.width / 2 + (Math.random() * 20 - 10);
      let y = this.character.y + this.character.height - 10;

      this.particles.push(new Particle(x, y));
    }
  }

  /**
   * Prüft kontinuierlich, ob der aktuelle Punktestand den Highscore übersteigt.
   */
  checkHighscore() {
    if (this.score > this.highscore) {
      this.highscore = this.score;
    }
  }

  /**
   * Wird aufgerufen, wenn die HP des Charakters auf 0 fallen. Beendet den Game Loop.
   */
  gameOver() {
    console.log("Game Over");
    clearInterval(this.runInterval);
    this.background_sound.pause();

    checkEndGame(this.score, false);
  }

  /**
   * Wird aufgerufen, wenn der Endboss stirbt. Beendet das Spiel als gewonnen.
   */
  gameWon() {
    checkEndGame(this.score, true);
  }

  /**
   * Erzeugt einen Screen-Shake-Effekt (Wackeln der Kamera), z.B. bei einem Treffer des Bosses.
   * @param {number} intensity - Stärke des Wackelns in Pixel.
   * @param {number} duration - Dauer des Effekts in Millisekunden.
   */
  shake(intensity, duration) {
    let interval = setInterval(() => {
      this.shake_x = Math.random() * intensity - intensity / 2;
      this.shake_y = Math.random() * intensity - intensity / 2;
    }, 1000 / 60);

    setTimeout(() => {
      clearInterval(interval);
      this.shake_x = 0;
      this.shake_y = 0;
    }, duration);
  }

  /**
   * Die zentrale Render-Schleife. Zeichnet jeden Frame alle Objekte neu auf das Canvas.
   */
  draw() {
    if (!this.isActive) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x + this.shake_x, this.shake_y);

    this.backgroundObjects.forEach((bgo) => {
      if (this.isVisible(bgo)) {
        const parallaxOffset = this.camera_x * (bgo.parallaxFactor - 1);
        if (bgo.img) {
          this.ctx.drawImage(
            bgo.img,
            bgo.x + parallaxOffset,
            bgo.y,
            bgo.width,
            bgo.height,
          );
        }
      }
    });

    this.clouds.forEach((cloud) => {
      if (this.isVisible(cloud)) {
        const parallaxOffset = this.camera_x * (cloud.parallaxFactor - 1);
        if (cloud.img) {
          this.ctx.drawImage(
            cloud.img,
            cloud.x + parallaxOffset,
            cloud.y,
            cloud.width,
            cloud.height,
          );
        }
      }
    });

    if (this.character.imageLoaded) {
      this.addToMap(this.character);
    }

    this.enemies.forEach((enemy) => {
      if (enemy.imageLoaded && this.isVisible(enemy)) {
        this.addToMap(enemy);
      }
    });

    this.bullets.forEach((bullet) => {
      if (bullet.imageLoaded && this.isVisible(bullet)) {
        this.addToMap(bullet);
      }
    });

    this.casings.forEach((casing) => {
      if (casing.imageLoaded && this.isVisible(casing)) {
        this.addToMap(casing);
      }
    });

    this.explosions.forEach((explosion) => {
      if (this.isVisible(explosion)) {
        this.addToMap(explosion);
      }
    });

    this.throwableObjects.forEach((bottle) => {
      if (bottle.imageLoaded && this.isVisible(bottle)) {
        this.addToMap(bottle);
      }
    });

    this.particles.forEach((particle) => {
      if (this.isVisible(particle)) {
        particle.draw(this.ctx);
      }
    });

    this.coins.forEach((coin) => {
      if (this.isVisible(coin)) {
        this.addToMap(coin);
      }
    });

    this.salsaBottles.forEach((bottle) => {
      if (bottle.imageLoaded && this.isVisible(bottle)) {
        this.addToMap(bottle);
      }
    });

    this.energyBalls.forEach((ball) => {
      if (this.isVisible(ball)) {
        this.addToMap(ball);
      }
    });

    this.ctx.translate(-this.camera_x - this.shake_x, -this.shake_y);

    this.addToMap(this.statusBar);
    this.addToMap(this.coinBar);

    this.ctx.font = "40px sans-serif";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("+ " + this.score, 320, 100);

    if (this.bottleIcon.complete) {
      this.ctx.drawImage(this.bottleIcon, 30, 105, 35, 35);
    }
    this.ctx.font = "28px sans-serif";
    this.ctx.fillText("x " + this.character.bottles, 75, 133);

    this.ctx.font = "30px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "Level: " +
        this.levelManager.level +
        " | Zeit: " +
        (this.levelManager.maxLevelTime - this.levelManager.levelTimer) +
        "s",
      360,
      50,
    );
    this.ctx.textAlign = "start";

    if (this.levelManager.bossSpawned) {
      this.addToMap(this.endbossBar);
    }

    this.camera_x = -this.character.x + 100;

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Prüft, ob ein Objekt aktuell im sichtbaren Bereich der Kamera ist.
   * @param {MovableObject} mo - Das zu überprüfende Objekt.
   * @returns {boolean}
   */
  isVisible(mo) {
    const parallax = mo.parallaxFactor !== undefined ? mo.parallaxFactor : 1;
    const screenX = mo.x + this.camera_x * parallax;

    return screenX + mo.width > -100 && screenX < this.canvas.width + 100;
  }

  /**
   * Zeichnet ein Objekt auf die Karte, inkl. möglicher Spiegelung und Rotation.
   * @param {MovableObject} mo - Das zu zeichnende Objekt.
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

        let isFlashing = new Date().getTime() - this.chickenFlashTime < 100;

        if (isFlashing) {
          this.ctx.filter = "brightness(200%)";
        }

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

    if (rotate) {
      this.ctx.restore();
    }

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }

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
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
