/**
 * Der LevelManager kontrolliert den Spielablauf, den Timer und das Spawnen
 * von Gegnern, Münzen, Flaschen sowie das kontinuierliche Generieren des Hintergrunds.
 */
class LevelManager {
  constructor(world) {
    this.world = world;
    this.level = 1;
    this.levelTimer = 0;
    this.maxLevelTime = 120;
    this.endlessMode = false;
    this.bossSpawned = false;
    this.spawnIntervalId = null;
    this.timerIntervalId = null;

    this.lastBackgroundX = -1522;
    this.bgWidth = 1522;
    this.lastCloudX = -500;
  }

  /**
   * Startet den Level-Timer und den Intervall zum Spawnen von Hühnern.
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
   */
  spawnSalsaBottles() {
    for (let i = 0; i < 10; i++) {
      this.world.salsaBottles.push(new SalsaBottle());
    }
  }

  /**
   * Generiert dynamisch lückenlose Hintergrund-Ebenen (Himmel, Berge, Boden, Pflanzen)
   * passend zur Fortbewegung des Spielers.
   */
  updateBackground() {
    if (!this.world.character) return;

    while (this.lastBackgroundX < this.world.character.x + 2000) {
      this.lastBackgroundX += this.bgWidth;
      let x = this.lastBackgroundX;
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
      let cactusCount = 4 + Math.floor(Math.random() * 5);

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

    this.world.backgroundObjects = this.world.backgroundObjects.filter(
      (bgo) => {
        const parallax =
          bgo.parallaxFactor !== undefined ? bgo.parallaxFactor : 1;
        const screenX = bgo.x + this.world.camera_x * parallax;
        const keep = screenX + bgo.width > -200;
        if (!keep) bgo.stopIntervals();
        return keep;
      },
    );
  }

  updateClouds() {
    if (!this.world.character) return;
    while (this.lastCloudX < this.world.character.x + 2000) {
      this.lastCloudX += 500;
      this.world.clouds.push(new Cloud(this.lastCloudX));
    }
    this.world.clouds = this.world.clouds.filter((cloud) => {
      const parallax =
        cloud.parallaxFactor !== undefined ? cloud.parallaxFactor : 1;
      const screenX = cloud.x + this.world.camera_x * parallax;
      const keep = screenX + cloud.width > -200;
      if (!keep) cloud.stopIntervals();
      return keep;
    });
  }

  /**
   * Stoppt die Timer und Spawn-Intervalle des Level-Managers.
   */
  stop() {
    clearInterval(this.spawnIntervalId);
    clearInterval(this.timerIntervalId);
  }
}
