/**
 * @class CombatManager
 * @description Verarbeitet die gesamte Kampflogik der Spielwelt (Schießen, Werfen, Spezialangriffe).
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
   * @returns {void}
   */
  checkShooting() {
    if (!this.world.keyboard.D) return;
    const currentTime = new Date().getTime();
    if (this.world.character.isFlying) {
      this.handleFlyingShooting(currentTime);
    } else {
      this.handleGroundShooting(currentTime);
    }
  }

  handleFlyingShooting(currentTime) {
    if (currentTime - this.lastShootTime > 100) this.fireGatling(currentTime);
  }

  handleGroundShooting(currentTime) {
    const isUzi = this.world.character.currentWeapon === "uzi";
    const cooldown = isUzi ? 100 : 200;
    if (currentTime - this.lastShootTime > cooldown)
      this.executeGroundShot(isUzi, currentTime);
  }

  executeGroundShot(isUzi, currentTime) {
    if (isUzi) this.fireUzi(currentTime);
    else if (this.world.character.shoot()) this.fireShotgun(currentTime);
  }

  /**
   * Feuert die Gatling-Gun ab (Standardangriff im Flug).
   * @param {number} currentTime - Der aktuelle Zeitstempel.
   * @returns {void}
   */
  fireGatling(currentTime) {
    this.lastShootTime = currentTime;
    this.world.character.shoot();
    const ammo = this.getChickenAmmo();
    const startPos = this.getShotStartPosition();
    const nearestEnemy = this.findNearestEnemy(startPos.x, startPos.y);
    this.playGatlingSound(ammo.isChickenShot);
    const bullet = this.createGatlingBullet(startPos, nearestEnemy, ammo);
    if (ammo.isChickenShot) this.enhanceChickenShot(bullet, startPos);
    this.world.bullets.push(bullet);
    this.spawnShellCasing();
  }

  getChickenAmmo() {
    let ammoImage = null;
    let isChickenShot = false;
    const char = this.world.character;
    if (char.impaledChicken) {
      char.shotsWithChicken++;
      if (char.shotsWithChicken > 10) {
        const imgPath = char.IMPALED_CHICKEN_IMAGES[char.shotsWithChicken % 2];
        ammoImage = char.imageCache[imgPath] || null;
        char.impaledChicken = false;
        char.shotsWithChicken = 0;
        isChickenShot = true;
      }
    }
    return { ammoImage, isChickenShot };
  }

  getShotStartPosition() {
    const char = this.world.character;
    return {
      x: char.otherDirection ? char.x - 20 : char.x + 200,
      y: char.y + 150,
    };
  }

  playGatlingSound(isChickenShot) {
    let sound;
    if (this.world.character.impaledChicken || isChickenShot) {
      sound = this.world.chickenshot_sound.cloneNode(true);
      this.world.chickenFlashTime = new Date().getTime();
    } else {
      sound = this.world.gatling_sound.cloneNode(true);
    }
    sound.volume = this.world.volume;
    sound.play().catch(() => {});
  }

  createGatlingBullet(startPos, target, ammo) {
    const spread = Math.random() * 20 - 10;
    return new GatlingBullet(
      startPos.x,
      startPos.y,
      this.world.character.otherDirection,
      spread,
      target,
      this.world,
      ammo.ammoImage,
    );
  }

  enhanceChickenShot(bullet, startPos) {
    bullet.width = 60;
    bullet.height = 60;
    bullet.isSpinning = true;
    this.spawnFeatherParticles(startPos);
  }

  spawnFeatherParticles(startPos) {
    for (let i = 0; i < 20; i++) {
      const color =
        Math.random() > 0.5 ? "rgba(255, 255, 255, 1)" : "rgba(139, 69, 19, 1)";
      const pX = startPos.x + Math.random() * 40 - 20;
      const pY = startPos.y + Math.random() * 40 - 20;
      this.world.particles.push(new Particle(pX, pY, color));
    }
  }

  /**
   * Feuert die Uzi am Boden ab.
   * @param {number} currentTime - Der aktuelle Zeitstempel.
   * @returns {void}
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
      new GatlingBullet(
        startX,
        startY,
        this.world.character.otherDirection,
        spread,
        nearestEnemy,
        this.world,
      ),
    );
    this.spawnShellCasing();
  }

  /**
   * Feuert die Schrotflinte (mehrere Projektile gleichzeitig).
   * @param {number} currentTime - Der aktuelle Zeitstempel.
   * @returns {void}
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
      new Bullet(
        startX,
        startY,
        this.world.character.otherDirection,
        -20,
        nearestEnemy,
        this.world,
      ),
      new Bullet(
        startX,
        startY,
        this.world.character.otherDirection,
        -40,
        nearestEnemy,
        this.world,
      ),
      new Bullet(
        startX,
        startY,
        this.world.character.otherDirection,
        0,
        nearestEnemy,
        this.world,
      ),
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
   * @returns {void}
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
   * @returns {void}
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
   * @returns {void}
   */
  triggerUziWheelAttack(deltaY) {
    if (
      this.world.character.isUziWheelUp ||
      this.world.character.isUziWheelDown
    )
      return;
    this.world.character.triggerUziWheelAnimation(deltaY);

    let sound = this.world.gatling_sound.cloneNode(true);
    sound.volume = this.world.volume;
    sound.play().catch(() => {});

    let startX = this.world.character.x + this.world.character.width / 2;
    let startY = this.world.character.y + this.world.character.height / 2;
    let numBullets = 16;

    for (let i = 0; i < numBullets; i++) {
      let angle = (i * (Math.PI * 2)) / numBullets;
      let bullet = new GatlingBullet(
        startX,
        startY,
        false,
        0,
        null,
        this.world,
      );
      const wheelAttackSpeed = 1500; // pixels per second
      bullet.speedX = Math.cos(angle) * wheelAttackSpeed;
      bullet.speedY = Math.sin(angle) * wheelAttackSpeed;
      if (bullet.speedX < 0) {
        bullet.otherDirection = true;
      }
      this.world.bullets.push(bullet);
    }
  }
}
