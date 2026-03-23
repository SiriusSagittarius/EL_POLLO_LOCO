/**
 * @class LevelManager
 * @description Kontrolliert den Spielablauf, den Timer und das Spawnen
 * von Gegnern, Münzen, Flaschen sowie das kontinuierliche Generieren des Hintergrunds.
 */
class LevelManager {
  /**
   * @param {World} world - Eine Referenz auf die Haupt-Spielwelt.
   */
  constructor(world) {
    this.world = world;
    this.level = 1;
    this.levelTimer = 0;
    this.maxLevelTime = 60;
    this.endlessMode = false;
    this.bossSpawned = false;
    this.spawnIntervalId = null;
    this.timerIntervalId = null;

    this.bgWidth = 1522;
  }

  /**
   * Startet den Level-Timer und den Intervall zum Spawnen von Hühnern.
   * @returns {void}
   */
  startLevelLogic() {
    this.levelTimer = 0;
    this.bossSpawned = false;
    this.world.bossDying = false;
    this.startTimer();
    this.startSpawning();
  }

  /**
   * Startet den Timer des Levels.
   * @returns {void}
   */
  startTimer() {
    this.timerIntervalId = setInterval(() => {
      this.levelTimer++;
    }, 1000);
  }

  /**
   * Startet das Intervall zum Spawnen von Feinden.
   * @returns {void}
   */
  startSpawning() {
    const spawnRate = this.level === 1 ? 3000 : 1500;
    this.spawnIntervalId = setInterval(() => {
      this.spawnEnemies();
      this.cleanupDistantEnemies();
    }, spawnRate);
  }

  /**
   * Spawnt neue Gegner in der Welt.
   * @returns {void}
   */
  spawnEnemies() {
    const count = 1;
    for (let i = 0; i < count; i++) {
      const spawnX = this.world.character.x + 600 + Math.random() * 600;
      const enemy =
        Math.random() < 0.5 ? new Chicken(spawnX) : new SmallChicken(spawnX);
      enemy.world = this.world;
      this.world.enemies.push(enemy);
    }
  }

  /**
   * Entfernt Feinde, die zu weit vom Charakter entfernt sind.
   * @returns {void}
   */
  cleanupDistantEnemies() {
    this.world.enemies = this.world.enemies.filter((e) => {
      const keep = Math.abs(e.x - this.world.character.x) < 2000;
      if (!keep) e.stopIntervals();
      return keep;
    });
  }

  /**
   * Prüft, ob die Level-Zeit abgelaufen ist und triggert ggf. das
   * Erscheinen des Endbosses.
   * @returns {void}
   */
  checkBossSpawn() {
    if (this.endlessMode) return;

    if (this.levelTimer >= this.maxLevelTime && !this.bossSpawned) {
      console.log("ZEIT ABGELAUFEN! Endboss erscheint!");
      clearInterval(this.spawnIntervalId);
      clearInterval(this.timerIntervalId);

      const endboss = new Endboss();
      endboss.x = this.world.character.x + 800;
      this.world.enemies.push(endboss);
      endboss.world = this.world;
      endboss.updateVolume(this.world.volume);
      this.bossSpawned = true;
    }
  }

  /**
   * Verteilt zufällig Münzen in der Welt.
   * @returns {void}
   */
  spawnCoins() {
    for (let i = 0; i < 20; i++) {
      let coin = new Coin();
      coin.x = 200 + Math.random() * 3000;
      this.world.coins.push(coin);
    }
  }

  /**
   * Verteilt zufällig Salsa-Flaschen in der Welt.
   * @returns {void}
   */
  spawnSalsaBottles() {
    for (let i = 0; i < 10; i++) {
      this.world.salsaBottles.push(new SalsaBottle());
    }
  }

  /**
   * Generiert dynamisch lückenlose Hintergrund-Ebenen (Himmel, Berge, Boden, Pflanzen)
   * passend zur Fortbewegung des Spielers (Infinite Scrolling).
   * @returns {void}
   */
  updateBackground() {
    if (!this.world.character || !this.world.canvas) return;

    const layers = [
      {
        path: "img/5_background/layers/3_third_layer/",
        parallax: 0.2,
        yOffset: 0,
      },
      {
        path: "img/5_background/layers/2_second_layer/",
        parallax: 0.5,
        yOffset: 0,
      },
      {
        path: "img/5_background/layers/1_first_layer/",
        parallax: 1,
        yOffset: 0,
      },
    ];

    layers.forEach((layer) => {
      let requiredMinX = -this.bgWidth - this.world.camera_x * layer.parallax;
      let requiredMaxX =
        this.world.canvas.width +
        this.bgWidth -
        this.world.camera_x * layer.parallax;

      let startChunk = Math.floor(requiredMinX / this.bgWidth);
      let endChunk = Math.floor(requiredMaxX / this.bgWidth);

      for (let i = startChunk; i <= endChunk; i++) {
        let chunkX = i * this.bgWidth;

        let exists = this.world.backgroundObjects.some(
          (bgo) => bgo.x === chunkX && bgo.parallaxFactor === layer.parallax,
        );

        if (!exists) {
          const imageName = this.getChunkImageName(chunkX);
          const bgo = new BackgroundObject(
            `${layer.path}${imageName}`,
            chunkX,
            layer.parallax,
          );
          bgo.width = this.bgWidth;
          if (layer.yOffset) bgo.y += layer.yOffset;
          this.world.backgroundObjects.push(bgo);
        }
      }
    });

    this.world.backgroundObjects = this.world.backgroundObjects.filter(
      (bgo) => {
        const parallax =
          bgo.parallaxFactor !== undefined ? bgo.parallaxFactor : 1;
        const screenX = bgo.x + this.world.camera_x * parallax;
        const keep =
          screenX > -this.bgWidth * 2 &&
          screenX < this.world.canvas.width + this.bgWidth * 2;
        if (!keep) bgo.stopIntervals();
        return keep;
      },
    );
  }

  /**
   * Gibt den Dateinamen des Hintergrundbilds basierend auf der X-Position zurück.
   * @param {number} x - Die X-Koordinate.
   * @returns {string} Der Dateiname des Bildes.
   */
  getChunkImageName(x) {
    const relativeIndex = Math.abs(Math.round(x / this.bgWidth)) % 2;
    return ["1.png", "2.png"][relativeIndex];
  }

  /**
   * Sorgt dafür, dass immer genügend Wolken am Himmel sind und entfernt weit entfernte Wolken.
   * @returns {void}
   */
  updateClouds() {
    if (!this.world.character || !this.world.canvas) return;

    if (this.world.clouds.length === 0) {
      for (let i = 0; i < 6; i++) {
        let targetScreenX = Math.random() * this.world.canvas.width;
        let spawnX = targetScreenX - this.world.camera_x * 0.15;
        this.world.clouds.push(new Cloud(spawnX));
      }
    }

    while (this.world.clouds.length < 8) {
      let targetScreenX = this.world.canvas.width + 100 + Math.random() * 800;
      let spawnX = targetScreenX - this.world.camera_x * 0.15;
      this.world.clouds.push(new Cloud(spawnX));
    }

    this.world.clouds = this.world.clouds.filter((cloud) => {
      const screenX = cloud.x + this.world.camera_x * cloud.parallaxFactor;
      const keep = screenX > -1000 && screenX < this.world.canvas.width + 2000;
      if (!keep) cloud.stopIntervals();
      return keep;
    });
  }

  /**
   * Stoppt die Timer und Spawn-Intervalle des Level-Managers.
   * @returns {void}
   */
  stop() {
    clearInterval(this.spawnIntervalId);
    clearInterval(this.timerIntervalId);
  }
}
