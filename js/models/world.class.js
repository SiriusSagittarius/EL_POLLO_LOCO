/**
 * @class World
 * @description Repräsentiert die zentrale Spielwelt.
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
  lastTime = 0;
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
  isShowingWrongWay = false;
  isPushingBack = false;
  backwardRunTime = 0;

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

  /**
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element, auf dem das Spiel gezeichnet wird.
   * @param {Keyboard} keyboard - Das Keyboard-Objekt zur Abfrage von Tastatureingaben.
   */
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
    this.gameLoop(0); // Startet die neue, optimierte Spielschleife
    this.background_sound.loop = true;
    this.background_sound.currentTime = 0;
    this.background_sound.play().catch(() => {});
  }

  /**
   * Die zentrale, optimierte Spielschleife.
   * @param {number} timestamp - Der von requestAnimationFrame bereitgestellte Zeitstempel.
   */
  gameLoop(timestamp) {
    if (!this.isActive) return;

    // Berechnet die Zeit, die seit dem letzten Frame vergangen ist (in Sekunden).
    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    // 1. Alle Logik-Updates durchführen
    this.updateLogic(deltaTime);

    // 2. Alle Objekte auf dem Canvas zeichnen
    this.renderer.draw();

    // Den nächsten Frame anfordern
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  /**
   * Führt alle Spiellogik-Updates für einen Frame aus.
   * @param {number} deltaTime - Die vergangene Zeit seit dem letzten Frame.
   */
  updateLogic(deltaTime) {
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
    this.handleBackwardMovement(deltaTime);

    // HINWEIS: Hier müssten nun die .update(deltaTime) Methoden aller
    // beweglichen Objekte aufgerufen werden, nachdem deren `setInterval`
    // entfernt und durch eine `update`-Methode ersetzt wurde.
  }

  /**
   * Weist den relevanten Spielobjekten eine Referenz auf die Welt zu.
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
    this.enemies.forEach((enemy) => (enemy.world = this));
  }

  /**
   * Pausiert das Spiel und stoppt alle aktiven Game-Loops.
   * @returns {void}
   */
  stopGame() {
    this.levelManager.stop();
    this.background_sound.pause();
    this.character.stopIntervals();
    this.isActive = false;
  }

  /**
   * Aktualisiert den Treibstoff (Münzleiste) während des Fliegens.
   * @returns {void}
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
   * @returns {void}
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
   * @returns {void}
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
   * @returns {void}
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
   * @returns {void}
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
   * @returns {void}
   */
  checkExplosions() {
    this.explosions = this.explosions.filter((e) => !e.toDelete);
  }

  /**
   * Bereinigt gelöschte oder abgelaufene Patronenhülsen aus dem Array.
   * @returns {void}
   */
  checkCasings() {
    this.casings = this.casings.filter((casing) => !casing.toDelete);
  }

  /**
   * Erzeugt Lauf-Partikel (Staub) am Boden, wenn der Charakter sich bewegt,
   * und entfernt alte Partikel aus dem Array.
   * @returns {void}
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
   * @returns {void}
   */
  checkHighscore() {
    if (this.score > this.highscore) {
      this.highscore = this.score;
    }
  }

  /**
   * Wird aufgerufen, wenn die HP des Charakters auf 0 fallen. Beendet den Game Loop.
   * @returns {void}
   */
  gameOver() {
    console.log("Game Over");
    this.stopGame();
    clearAllIntervals();

    checkEndGame(this.score, false);
  }

  /**
   * Wird aufgerufen, wenn der Endboss stirbt. Beendet das Spiel als gewonnen.
   * @returns {void}
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
   * @returns {void}
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
   * Behandelt die Logik, wenn der Spieler zu weit rückwärts läuft.
   * Zeigt eine Warnung an und schiebt den Charakter nach vorne.
   * @returns {void}
   */
  handleBackwardMovement(deltaTime) {
    const BACKWARD_LIMIT_X = -100;
    const TIME_LIMIT_MS = 2000;

    if (this.isPushingBack) return;

    if (this.keyboard.LEFT && this.character.x < BACKWARD_LIMIT_X) {
      this.backwardRunTime += deltaTime * 1000; 
    } else {
      this.backwardRunTime = 0;
    }

    if (this.backwardRunTime > TIME_LIMIT_MS) {
      this.isPushingBack = true;
      this.isShowingWrongWay = true;

      setTimeout(() => {
        this.isShowingWrongWay = false;
        this.isPushingBack = false;
        this.character.x += 400;
      }, 1500);
    }
  }
}
