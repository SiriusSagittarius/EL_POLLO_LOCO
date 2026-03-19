/**
 * Übernimmt die gesamte Kollisionslogik zwischen dem Charakter, Gegnern, Projektilen und Items.
 */
class CollisionManager {
  constructor(world) {
    this.world = world;
  }

  /**
   * Führt jeden Frame alle Arten von Kollisionsprüfungen nacheinander aus.
   */
  checkCollisions() {
    this.checkBulletCollisions();
    this.checkBottleCollisions();
    this.checkCharacterEnemyCollisions();
    this.checkCollectibles();
  }

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

  handleBossHit(enemy, damage = 5) {
    enemy.hit(damage);
    this.world.shake(5, 100);
    this.world.endbossBar.setPercentage(enemy.energy);

    if (enemy.isDead() && !this.world.bossDying) {
      this.world.bossDying = true;
      setTimeout(() => {
        enemy.stopIntervals();
        this.world.enemies = this.world.enemies.filter((e) => e !== enemy);
        this.world.score += 500;
        this.world.checkHighscore();
        this.world.gameWon();
      }, 1000);
    }
  }

  handleEnemyHit(enemy, enemyIndex) {
    let sound = this.world.chicken_dead_sound.cloneNode(true);
    sound.volume = this.world.volume;
    sound.play().catch(() => {});
    this.world.score += 20;
    this.world.checkHighscore();
    enemy.energy = 0;
    enemy.stopIntervals();
    this.world.enemies.splice(enemyIndex, 1);
  }

  checkCharacterEnemyCollisions() {
    for (let i = this.world.enemies.length - 1; i >= 0; i--) {
      const enemy = this.world.enemies[i];

      if (!this.world.character.isColliding(enemy)) continue;

      if (
        this.world.character.isFlying &&
        !this.world.character.impaledChicken &&
        (enemy instanceof Chicken || enemy instanceof SmallChicken)
      ) {
        this.world.character.impaledChicken = true;
        this.world.character.shotsWithChicken = 0;
        enemy.energy = 0;
        enemy.toDelete = true;
        this.world.enemies.splice(i, 1);
      } else if (
        !this.world.character.isFlying &&
        this.world.character.speedY < 0 &&
        this.world.character.y +
          this.world.character.height -
          this.world.character.offset.bottom <
          enemy.y + enemy.height / 2 + 40
      ) {
        if (enemy instanceof Endboss) {
          this.handleBossHit(enemy, 10);
        } else if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
          this.handleEnemyHit(enemy, i);
        }
        this.world.character.jump();
      } else if (
        !this.world.character.isFlying &&
        !this.world.character.isHurt()
      ) {
        this.world.character.hit();
        this.world.statusBar.setPercentage(this.world.character.energy);
      }
    }

    if (this.world.character.isDead()) {
      this.world.gameOver();
    }
  }

  checkCollectibles() {
    this.collectItems(
      this.world.coins,
      (item, i) => this.world.collectCoin(i),
      false,
    );
    this.collectItems(
      this.world.salsaBottles,
      () => this.world.character.bottles++,
      true,
    );
    this.collectItems(
      this.world.energyBalls,
      () => {
        this.world.character.energy = Math.min(
          this.world.character.energy + 20,
          100,
        );
        this.world.statusBar.setPercentage(this.world.character.energy);
      },
      true,
    );
  }

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
