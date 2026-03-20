/**
 * Verarbeitet die gesamte Kampflogik der Spielwelt (Schießen, Werfen, Spezialangriffe).
 */
class CombatManager {
  /**
   * @param {World} world - Referenz auf die Hauptspielwelt.
   */
  constructor(world) {
    this.world = world;
    this.lastShootTime = 0;
    this.lastThrowTime = 0;
  }

  /**
   * Überprüft, ob der Spieler die Schusstaste (D) drückt und führt entsprechende Angriffe aus.
   */
  checkShooting() {
    if (!this.world.keyboard.D) return;

    let currentTime = new Date().getTime();

    if (this.world.character.isFlying && currentTime - this.lastShootTime > 100) {
      this.fireGatling(currentTime);
    } else if (!this.world.character.isFlying) {
      let isUzi = this.world.character.currentWeapon === "uzi";
      let cooldown = isUzi ? 100 : 200;

      if (currentTime - this.lastShootTime > cooldown) {
        if (isUzi) {
          this.fireUzi(currentTime);
        } else if (this.world.character.shoot()) {
          this.fireShotgun(currentTime);
        }
      }
    }
  }

  /**
   * Feuert die Gatling-Gun ab (Standardangriff im Flug).
   * @param {number} currentTime - Der aktuelle Zeitstempel.
   */
  fireGatling(currentTime) {
    this.lastShootTime = currentTime;
    this.world.character.shoot();

    let ammoImage = null;
    let isChickenShot = false;

    if (this.world.character.impaledChicken) {
      this.world.character.shotsWithChicken++;
      if (this.world.character.shotsWithChicken > 10) {
        let imgPath =
          this.world.character.IMPALED_CHICKEN_IMAGES[
            this.world.character.shotsWithChicken % 2
          ];
        if (this.world.character.imageCache[imgPath])
          ammoImage = this.world.character.imageCache[imgPath];
        this.world.character.impaledChicken = false;
        this.world.character.shotsWithChicken = 0;
        isChickenShot = true;
      }
    }

    let startX = this.world.character.otherDirection
      ? this.world.character.x - 20
      : this.world.character.x + 200;
    let startY = this.world.character.y + 150;
    let nearestEnemy = this.findNearestEnemy(startX, startY);
    let spread = Math.random() * 20 - 10;

    let sound;
    if (this.world.character.impaledChicken || isChickenShot) {
      sound = this.world.chickenshot_sound.cloneNode(true);
      this.world.chickenFlashTime = new Date().getTime();
    } else {
      sound = this.world.gatling_sound.cloneNode(true);
    }
    sound.volume = this.world.volume;
    sound.play().catch(() => {});

    let bullet = new GatlingBullet(
      startX,
      startY,
      this.world.character.otherDirection,
      spread,
      nearestEnemy,
      this.world,
      ammoImage,
    );

    if (isChickenShot) {
      bullet.width = 60;
      bullet.height = 60;
      bullet.isSpinning = true;

      for (let i = 0; i < 20; i++) {
        let color =
          Math.random() > 0.5
            ? "rgba(255, 255, 255, 1)"
            : "rgba(139, 69, 19, 1)";
        this.world.particles.push(
          new Particle(
            startX + Math.random() * 40 - 20,
            startY + Math.random() * 40 - 20,
            color,
          ),
        );
      }
    }

    this.world.bullets.push(bullet);
    this.spawnShellCasing();
  }

  /**
   * Feuert die Uzi am Boden ab.
   * @param {number} currentTime - Der aktuelle Zeitstempel.
   */
  fireUzi(currentTime) {
    this.lastShootTime = currentTime;
    this.world.character.shootUziForward();

    let sound = this.world.gatling_sound.cloneNode(true);
    sound.volume = this.world.volume;
    sound.play().catch(() => {});

    let startX = this.world.character.otherDirection
      ? this.world.character.x
      : this.world.character.x + 100;
    let startY = this.world.character.y + 140;
    let nearestEnemy = this.findNearestEnemy(startX, startY);
    let spread = Math.random() * 10 - 5;

    this.world.bullets.push(
      new GatlingBullet(startX, startY, this.world.character.otherDirection, spread, nearestEnemy, this.world)
    );
    this.spawnShellCasing();
  }

  /**
   * Feuert die Schrotflinte (mehrere Projektile gleichzeitig).
   * @param {number} currentTime - Der aktuelle Zeitstempel.
   */
  fireShotgun(currentTime) {
    this.lastShootTime = currentTime;

    let sound = this.world.shotgun_sound.cloneNode(true);
    sound.volume = this.world.volume;
    sound.play().catch(() => {});

    let startX = this.world.character.otherDirection
      ? this.world.character.x
      : this.world.character.x + 80;
    let startY = this.world.character.y + 150;
    let nearestEnemy = this.findNearestEnemy(startX, startY);

    this.world.bullets.push(
      new Bullet(startX, startY, this.world.character.otherDirection, -20, nearestEnemy, this.world),
      new Bullet(startX, startY, this.world.character.otherDirection, -40, nearestEnemy, this.world),
      new Bullet(startX, startY, this.world.character.otherDirection, 0, nearestEnemy, this.world)
    );
    this.spawnShellCasing();
  }

  /**
   * Findet den am nächsten stehenden Gegner innerhalb einer Maximaldistanz (Auto-Aim).
   * @param {number} startX - X-Startkoordinate des Schusses.
   * @param {number} startY - Y-Startkoordinate des Schusses.
   * @param {number} [maxDistance=1000] - Maximale Suchdistanz.
   * @returns {MovableObject|null} Der nächste Gegner oder null.
   */
  findNearestEnemy(startX, startY, maxDistance = 1000) {
    let nearestEnemy = null;
    let minDistance = maxDistance;
    this.world.enemies.forEach((enemy) => {
      if (!enemy.isDead()) {
        let dx = enemy.x + enemy.width / 2 - startX;
        let dy = enemy.y + enemy.height / 2 - startY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
          minDistance = distance;
          nearestEnemy = enemy;
        }
      }
    });
    return nearestEnemy;
  }

  /**
   * Erzeugt eine Patronenhülse, die beim Schießen ausgeworfen wird.
   */
  spawnShellCasing() {
    this.world.casings.push(
      new ShellCasing(
        this.world.character.x + this.world.character.width / 2,
        this.world.character.y + 140,
        this.world.character.otherDirection,
      ),
    );
  }

  /**
   * Überprüft, ob die Taste zum Werfen (S) gedrückt wurde und wirft eine Salsa-Flasche.
   */
  checkThrowing() {
    if (this.world.keyboard.S && this.world.character.bottles > 0) {
      let currentTime = new Date().getTime();
      if (currentTime - this.lastThrowTime > 500) {
        this.lastThrowTime = currentTime;
        this.world.character.bottles--;

        let startX = this.world.character.otherDirection
          ? this.world.character.x - 20
          : this.world.character.x + 50;
        let bottle = new ThrowableBottle(
          startX,
          this.world.character.y + 100,
          this.world.character.otherDirection,
        );
        bottle.world = this.world;
        this.world.throwableObjects.push(bottle);
      }
    }
  }

  /**
   * Löst den Spezial-Radangriff der Uzi aus (Kugeln werden 360° gefeuert).
   * @param {number} deltaY - Die Scroll-Richtung des Mausrads.
   */
  triggerUziWheelAttack(deltaY) {
    if (this.world.character.isUziWheelUp || this.world.character.isUziWheelDown) return;
    this.world.character.triggerUziWheelAnimation(deltaY);

    let sound = this.world.gatling_sound.cloneNode(true);
    sound.volume = this.world.volume;
    sound.play().catch(() => {});

    let startX = this.world.character.x + this.world.character.width / 2;
    let startY = this.world.character.y + this.world.character.height / 2;
    let numBullets = 16;

    for (let i = 0; i < numBullets; i++) {
      let angle = (i * (Math.PI * 2)) / numBullets;
      let bullet = new GatlingBullet(startX, startY, false, 0, null, this.world);
      bullet.speedX = Math.cos(angle) * 30;
      bullet.speedY = Math.sin(angle) * 30;
      if (bullet.speedX < 0) {
        bullet.otherDirection = true;
      }
      this.world.bullets.push(bullet);
    }
  }
}