/**
 * @class CollisionManager
 * @description Übernimmt die gesamte Kollisionslogik zwischen dem Charakter, Gegnern, Projektilen und Items.
 */
class CollisionManager {
  /**
   * Erzeugt eine Instanz des CollisionManagers.
   * @param {World} world - Referenz auf die Spielwelt.
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Führt pro Frame alle Arten von Kollisionsprüfungen aus.
   * @returns {void}
   */
  checkCollisions() {
    this.checkBulletCollisions();
    this.checkBottleCollisions();
    this.checkCharacterEnemyCollisions();
    this.checkCollectibles();
  }

  /**
   * Prüft, ob Projektile (Kugeln) Gegner treffen oder zu weit geflogen sind.
   * @returns {void}
   */
  checkBulletCollisions() {
    for (let i = this.world.bullets.length - 1; i >= 0; i--) {
      const bullet = this.world.bullets[i];

      if (Math.abs(bullet.x - this.world.character.x) > 2000) {
        bullet.stopIntervals();
        this.world.bullets.splice(i, 1);
        continue;
      }

      if (this.checkProjectileHit(bullet)) {
        bullet.stopIntervals();
        this.world.bullets.splice(i, 1);
      }
    }
  }

  /**
   * Prüft, ob geworfene Flaschen einen Gegner treffen.
   * @returns {void}
   */
  checkBottleCollisions() {
    if (!this.world.throwableObjects) return;
    for (let i = this.world.throwableObjects.length - 1; i >= 0; i--) {
      const bottle = this.world.throwableObjects[i];
      if (this.checkProjectileHit(bottle)) {
        bottle.stopIntervals();
        this.world.explosions.push(new Explosion(bottle.x, bottle.y));
        this.world.throwableObjects.splice(i, 1);
      }
    }
  }

  /**
   * Hilfsfunktion: Überprüft für ein bestimmtes Projektil, ob es einen Gegner trifft.
   * @param {MovableObject} projectile - Die Kugel oder Flasche.
   * @returns {boolean} True, wenn ein Treffer registriert wurde.
   */
  checkProjectileHit(projectile) {
    for (let j = this.world.enemies.length - 1; j >= 0; j--) {
      const enemy = this.world.enemies[j];
      if (projectile.isColliding(enemy)) {
        let damage = projectile instanceof ThrowableBottle ? 20 : 5;
        if (enemy instanceof Endboss) {
          this.handleBossHit(enemy, damage);
        } else {
          this.handleEnemyHit(enemy, j);
        }
        return true;
      }
    }
    return false;
  }

  /**
   * Verarbeitet einen Treffer beim Endboss (Schaden, Hit-Effekt, Sterben).
   * @param {Endboss} enemy - Das Endboss-Objekt.
   * @param {number} [damage=5] - Die Höhe des Schadens.
   * @returns {void}
   */
  handleBossHit(enemy, damage) {
    enemy.hit(damage);
    this.world.shake(5, 100);
    this.world.endbossBar.setPercentage(enemy.energy);

    if (enemy.isDead() && !this.world.bossDying) {
      this.world.bossDying = true;
      if (!enemy.playedDeathSound) {
        enemy.dead_sound.play().catch(() => {});
        enemy.playedDeathSound = true;
      }
      enemy.stopIntervals();
      this.world.score += 500;
      this.world.gameWon();
    }
  }

  /**
   * Verarbeitet einen Treffer bei einem normalen Gegner.
   * @param {MovableObject} enemy - Das getroffene Gegner-Objekt.
   * @param {number} enemyIndex - Der Index des Gegners im Array.
   * @returns {void}
   */
  handleEnemyHit(enemy, enemyIndex) {
    let sound = this.world.chicken_dead_sound.cloneNode(true);
    sound.volume = this.world.volume;
    sound.play().catch(() => {});
    this.world.score += 20;
    enemy.energy = 0;
    enemy.stopIntervals();
    this.world.enemies.splice(enemyIndex, 1);
  }

  /**
   * Prüft Kollisionen zwischen dem Hauptcharakter (Pepe) und Feinden.
   * @returns {void}
   */
  checkCharacterEnemyCollisions() {
    this.world.enemies.forEach((enemy, i) => {
      if (this.world.character.isColliding(enemy)) {
        this.evaluateCharacterCollision(enemy, i);
      }
    });

    if (this.world.character.isDead()) {
      this.world.gameOver();
    }
  }

  /**
   * Bewertet die Kollision zwischen dem Charakter und einem Gegner.
   * @param {MovableObject} enemy - Das Gegner-Objekt.
   * @param {number} i - Der Index des Gegners im Array.
   * @returns {void}
   */
  evaluateCharacterCollision(enemy, i) {
    if (this.isStomping(enemy)) {
      this.handleStomp(enemy, i);
    } else if (this.canTakeDamage()) {
      this.handleDamage();
    }
  }

  /**
   * Prüft, ob der Charakter von oben auf den Gegner springt.
   * @param {MovableObject} enemy - Das Gegner-Objekt.
   * @returns {boolean} True, wenn es ein Sprungangriff ist.
   */
  isStomping(enemy) {
    const char = this.world.character;
    const isFallingOnEnemy = char.speedY < 0;
    const isVerticallyAligned =
      char.y + char.height - char.offset.bottom < enemy.y + enemy.height / 2;
    return isFallingOnEnemy && isVerticallyAligned;
  }

  /**
   * Verarbeitet einen erfolgreichen Sprungangriff auf einen Gegner.
   * @param {MovableObject} enemy - Das Gegner-Objekt.
   * @param {number} i - Der Index des Gegners.
   * @returns {void}
   */
  handleStomp(enemy, i) {
    if (enemy instanceof Endboss) {
      this.handleBossHit(enemy, 10);
    } else {
      this.handleEnemyHit(enemy, i);
    }
    this.world.character.jump();
  }

  /**
   * Prüft, ob der Charakter Schaden nehmen kann.
   * @returns {boolean} True, wenn der Charakter verletzbar ist.
   */
  canTakeDamage() {
    const char = this.world.character;
    return !char.isHurt() && !char.isAboveGround();
  }

  /**
   * Verarbeitet den erlittenen Schaden durch einen Gegner.
   * @returns {void}
   */
  handleDamage() {
    this.world.character.hit();
    this.world.statusBar.setPercentage(this.world.character.energy);
  }

  /**
   * Überprüft, ob der Charakter einsammelbare Items berührt.
   * @returns {void}
   */
  checkCollectibles() {
    this.collectItems(
      this.world.coins,
      (item, i) => this.collectCoin(i),
      false,
    );
    this.collectItems(
      this.world.salsaBottles,
      () => this.collectBottle(),
      true,
    );
  }

  /**
   * Sammelt eine Münze auf.
   * @param {number} index - Der Index der Münze.
   * @returns {void}
   */
  collectCoin(index) {
    this.world.collectCoin(index);
  }

  /**
   * Sammelt eine Flasche auf.
   * @returns {void}
   */
  collectBottle() {
    this.world.character.bottles++;
  }

  /**
   * Allgemeine Hilfsfunktion zum Aufsammeln von Items.
   * @param {MovableObject[]} items - Array der Items (z.B. Münzen, Flaschen).
   * @param {Function} action - Die auszuführende Aktion beim Aufsammeln.
   * @param {boolean} doSplice - True, wenn das Item aus dem Array gelöscht werden soll.
   * @returns {void}
   */
  collectItems(items, action, doSplice) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (this.world.character.isColliding(items[i])) {
        items[i].stopIntervals();
        action(items[i], i);
        if (doSplice) items.splice(i, 1);
      }
    }
  }
}
