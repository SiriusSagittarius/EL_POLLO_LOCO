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
  volume = 1;
  shake_x = 0;
  shake_y = 0;
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

  /**
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element, auf dem das Spiel gezeichnet wird.
   * @param {Keyboard} keyboard - Das Keyboard-Objekt zur Abfrage von Tastatureingaben.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.character = new Character();
    this.initComponents();
    this.initLevel();
    this.startGameLoop();
  }

  /**
   * Initialisiert die verschiedenen Manager-Komponenten.
   * @returns {void}
   */
  initComponents() {
    this.levelManager = new LevelManager(this);
    this.collisionManager = new CollisionManager(this);
    this.combatManager = new CombatManager(this);
    this.renderer = new WorldRenderer(this, this.canvas);
  }

  /**
   * Initialisiert das Level und spawnt Objekte.
   * @returns {void}
   */
  initLevel() {
    this.levelManager.startLevelLogic();
    this.levelManager.spawnCoins();
    this.levelManager.spawnSalsaBottles();
    this.levelManager.updateBackground();
    this.levelManager.updateClouds();
  }

  /**
   * Startet die Game-Loop und die Hintergrundmusik.
   * @returns {void}
   */
  startGameLoop() {
    this.setWorld();
    this.gameLoop(0);
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

    if (gamePaused) {
      this.lastTime = timestamp;
      this.renderer.draw();
      requestAnimationFrame(this.gameLoop.bind(this));
      return;
    }

    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    this.updateLogic(deltaTime);

    this.renderer.draw();

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  /**
   * Führt alle Spiellogik-Updates für einen Frame aus.
   * @param {number} deltaTime - Die vergangene Zeit seit dem letzten Frame.
   */
  updateLogic(deltaTime) {
    this.character.update(deltaTime);
    this.enemies.forEach((e) => e.update(deltaTime));
    this.clouds.forEach((c) => c.update(deltaTime));
    this.bullets.forEach((b) => b.update(deltaTime));
    this.throwableObjects.forEach((t) => t.update(deltaTime));
    this.particles.forEach((p) => p.update(deltaTime));
    this.coins.forEach((c) => c.update(deltaTime));
    this.explosions.forEach((e) => e.update(deltaTime));

    this.combatManager.checkShooting();
    this.combatManager.checkThrowing();
    this.collisionManager.checkCollisions();
    this.levelManager.checkBossSpawn();
    this.levelManager.updateBackground();
    this.levelManager.updateClouds();
    this.cleanupResources();
    this.handleBackwardMovement(deltaTime);

    this.checkExplosions();
    this.checkCasings();
    this.checkParticles();
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

    this.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.attack_sound.pause();
        enemy.dead_sound.pause();
      }
    });
    this.isActive = false;
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
    this.playCoinSound();

    let newPercentage = this.coinBar.percentage + 20;
    if (newPercentage >= 100) {
      newPercentage = 0;
      this.character.energy = Math.min(this.character.energy + 25, 100);
      this.statusBar.setPercentage(this.character.energy);
    }
    this.coinBar.setPercentage(newPercentage);
  }

  /**
   * Spielt den Sound ab, der beim Einsammeln einer Münze ertönt.
   * @returns {void}
   */
  playCoinSound() {
    let sound = this.coin_sound.cloneNode(true);
    sound.volume = this.volume;
    sound.play().catch(() => {});
  }

  /**
   * Entfernt Objekte (Feinde, Münzen, Items), die weit hinter dem Spieler liegen,
   * um Speicherplatz und Rechenleistung (Performance) zu sparen.
   * @returns {void}
   */
  cleanupResources() {
    const leftBoundary = this.character.x - 800;
    this.coins = this.filterByBoundary(this.coins, leftBoundary);
    this.salsaBottles = this.filterByBoundary(this.salsaBottles, leftBoundary);
    this.enemies = this.filterEnemiesByBoundary(this.enemies, leftBoundary);
    this.throwableObjects = this.filterThrowableObjects(
      this.throwableObjects,
      leftBoundary,
    );
  }

  /**
   * Filtert ein Array nach einer X-Koordinate, um Objekte außerhalb des Bildschirms zu entfernen.
   * @param {MovableObject[]} array - Das zu filternde Array.
   * @param {number} boundary - Die X-Grenze.
   * @returns {MovableObject[]} Das gefilterte Array.
   */
  filterByBoundary(array, boundary) {
    return array.filter((obj) => {
      const keep = obj.x > boundary;
      if (!keep) obj.stopIntervals();
      return keep;
    });
  }

  /**
   * Filtert Feinde nach einer X-Koordinate (ausgenommen Endboss).
   * @param {MovableObject[]} array - Das zu filternde Gegner-Array.
   * @param {number} boundary - Die X-Grenze.
   * @returns {MovableObject[]} Das gefilterte Array.
   */
  filterEnemiesByBoundary(array, boundary) {
    return array.filter((enemy) => {
      if (enemy instanceof Endboss) return true;
      const keep = enemy.x > boundary;
      if (!keep) enemy.stopIntervals();
      return keep;
    });
  }

  /**
   * Filtert Wurfobjekte, entfernt gelöschte oder abgefallene Flaschen.
   * @param {MovableObject[]} array - Das zu filternde Wurfobjekt-Array.
   * @param {number} boundary - Die X-Grenze.
   * @returns {MovableObject[]} Das gefilterte Array.
   */
  filterThrowableObjects(array, boundary) {
    return array.filter((obj) => {
      const keep = obj.x > boundary && obj.y < 600 && !obj.toDelete;
      if (!keep) obj.stopIntervals();
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
    if (this.isPushingBack) return;
    this.updateBackwardRunTime(deltaTime);
    if (this.backwardRunTime > 1000) {
      this.triggerPushback();
    }
  }

  /**
   * Aktualisiert die Zeit, die der Spieler kontinuierlich rückwärts läuft.
   * @param {number} deltaTime - Die vergangene Zeit seit dem letzten Frame in Sekunden.
   * @returns {void}
   */
  updateBackwardRunTime(deltaTime) {
    const BACKWARD_LIMIT_X = -100;
    if (this.keyboard.LEFT && this.character.x < BACKWARD_LIMIT_X) {
      this.backwardRunTime += deltaTime * 1000;
    } else {
      this.backwardRunTime = 0;
    }
  }

  /**
   * Löst den Pushback-Effekt aus, wenn der Spieler zu lange am linken Rand steht.
   * @returns {void}
   */
  triggerPushback() {
    this.isPushingBack = true;
    this.isShowingWrongWay = true;
    setTimeout(() => {
      this.isShowingWrongWay = false;
      this.isPushingBack = false;
      this.character.x += 400;
    }, 1500);
  }
}
