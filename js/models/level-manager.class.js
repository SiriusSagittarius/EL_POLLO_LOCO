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

    this.timerIntervalId = setInterval(() => {
      this.levelTimer++;
    }, 1000);

    let spawnRate = this.level === 1 ? 800 : 400;

    this.spawnIntervalId = setInterval(() => {
      let count = Math.random() < 0.3 ? 2 : 1;

      for (let i = 0; i < count; i++) {
        let offset = 600 + Math.random() * 600;
        let spawnX =
          this.world.character.x + (Math.random() < 0.5 ? offset : -offset);
        let enemy;

        if (Math.random() < 0.5) {
          enemy = new Chicken(spawnX);
        } else {
          enemy = new SmallChicken(spawnX);
        }
        enemy.world = this.world;
        this.world.enemies.push(enemy);
      }

      this.world.enemies = this.world.enemies.filter((e) => {
        const keep = Math.abs(e.x - this.world.character.x) < 2000;
        if (!keep) e.stopIntervals();
        return keep;
      });
    }, spawnRate);
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
    if (!this.world.character) return;

    const windowCenter = this.world.character.x - 500;

    let minX = windowCenter - 2000;
    let maxX = windowCenter + 2000;
    let startChunk = Math.floor(minX / this.bgWidth);
    let endChunk = Math.floor(maxX / this.bgWidth);

    for (let i = startChunk; i <= endChunk; i++) {
      let chunkX = i * this.bgWidth;

      let exists = this.world.backgroundObjects.some(
        (bgo) => bgo.x === chunkX && bgo.parallaxFactor === 1 && bgo.y >= 380,
      );

      if (!exists) {
        this.spawnBackgroundChunk(chunkX);
      }
    }

    this.world.backgroundObjects = this.world.backgroundObjects.filter(
      (bgo) => {
        const keep = Math.abs(bgo.x - windowCenter) < 4000;
        if (!keep) bgo.stopIntervals();
        return keep;
      },
    );
  }

  /**
   * Erzeugt einen kompletten Hintergrund-Block (Himmel, Berge, Boden, Kakteen) an einer bestimmten X-Koordinate.
   * @param {number} x - Die X-Position des neuen Blocks.
   * @returns {void}
   */
  spawnBackgroundChunk(x) {
    let relativeIndex = Math.abs(Math.round(x / this.bgWidth)) % 2;
    let imageNames = ["1.png", "2.png"];
    let imageName = imageNames[relativeIndex];

    let air = new BackgroundObject(
      `img/5_background/layers/5_air/${imageName}`,
      x,
      0,
    );
    air.width = this.bgWidth;
    this.world.backgroundObjects.push(air);

    let mountain = new BackgroundObject(
      `img/5_background/layers/2_berge/${imageName}`,
      x,
      0.2,
    );
    mountain.width = this.bgWidth;
    this.world.backgroundObjects.push(mountain);

    let ground = new BackgroundObject(
      `img/5_background/layers/1_boden/${imageName}`,
      x,
      1,
    );
    ground.width = this.bgWidth;
    ground.y += 380;
    this.world.backgroundObjects.push(ground);

    let imageblume = [
      "1.png",
      "2.png",
      "3.png",
      "4.png",
      "5.png",
      "6.png",
      "7.png",
    ];
    let cactusCount = 2 + Math.floor(Math.random() * 3);

    for (let i = 0; i < cactusCount; i++) {
      let randomImage =
        imageblume[Math.floor(Math.random() * imageblume.length)];
      let cactus = new BackgroundObject(
        `img/5_background/layers/3_blum/${randomImage}`,
        x + Math.random() * (this.bgWidth - 100),
        1,
      );

      cactus.height = 60 + Math.random() * 180;
      cactus.width = cactus.height * 1.2;
      let randomBaseY = 380 + Math.random() * 80;
      cactus.y = randomBaseY - cactus.height;
      this.world.backgroundObjects.push(cactus);
    }
  }

  /**
   * Sorgt dafür, dass immer genügend Wolken am Himmel sind und entfernt weit entfernte Wolken.
   * @returns {void}
   */
  updateClouds() {
    if (!this.world.character) return;
    while (this.world.clouds.length < 10) {
      let spawnX =
        this.world.character.x +
        (Math.random() < 0.5 ? -1500 : 1500) +
        (Math.random() * 1000 - 500);
      this.world.clouds.push(new Cloud(spawnX));
    }
    this.world.clouds = this.world.clouds.filter((cloud) => {
      const keep = Math.abs(cloud.x - this.world.character.x) < 4000;
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
