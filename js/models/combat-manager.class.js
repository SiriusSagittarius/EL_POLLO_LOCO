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
    this.handleGroundShooting(currentTime);
  }

  /**
   * Behandelt das Schießen vom Boden aus.
   * @param {number} currentTime - Der aktuelle Zeitstempel in Millisekunden.
   * @returns {void}
   */
  handleGroundShooting(currentTime) {
    if (currentTime - this.lastShootTime > 200) {
      if (this.world.character.shoot()) this.fireShotgun(currentTime);
    }
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
}
