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
    this.stopGame();
    clearAllIntervals();

    checkEndGame(this.score, false);
  }

  /**
   * Wird aufgerufen, wenn der Endboss stirbt. Beendet das Spiel als gewonnen.
   */
  gameWon() {
    this.stopGame();
    clearAllIntervals();
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
}
