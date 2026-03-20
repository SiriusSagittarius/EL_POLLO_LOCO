/**
 * @class Bullet
 * @description Repräsentiert ein einzelnes Projektil, z.B. von einer Schrotflinte.
 * @extends MovableObject
 */
class Bullet extends MovableObject {
  width = 40;
  height = 30;
  speedX = 0;
  speedY = 0;
  target = null;
  world = null;

  /**
   * @param {number} x - Die Start-X-Position des Projektils.
   * @param {number} y - Die Start-Y-Position des Projektils.
   * @param {boolean} direction - Die Schussrichtung (true für links, false für rechts).
   * @param {number} [yOffset=0] - Ein vertikaler Versatz zur Startposition.
   * @param {MovableObject|null} [target=null] - Ein optionales Ziel für zielsuchende Projektile.
   * @param {World|null} [world=null] - Eine Referenz zur Spielwelt für Effekte.
   */
  constructor(x, y, direction, yOffset = 0, target = null, world = null) {
    super();
    this.loadImage("img/2_character_pepe/6_shooting/shotgun/bullet.png");

    this.x = x;
    this.y = y + yOffset;
    this.target = target;
    this.world = world;

    let bulletSpeed = 35;

    if (target) {
      let targetX = target.x + target.width / 2;
      let targetY = target.y + target.height / 2;
      let dx = targetX - this.x;
      let dy = targetY - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      this.speedX = (dx / distance) * bulletSpeed;
      this.speedY = (dy / distance) * bulletSpeed;
      this.otherDirection = this.speedX < 0;
    } else {
      this.speedX = direction ? -bulletSpeed : bulletSpeed;
      this.speedY = 0;
      this.otherDirection = direction;
    }

    this.shoot();
  }

  /**
   * Startet die Bewegungslogik des Projektils.
   * @returns {void}
   */
  shoot() {
    this.setStoppableInterval(() => {
      if (this.target && !this.target.isDead()) {
        let bulletSpeed = 35;
        let targetX = this.target.x + this.target.width / 2;
        let targetY = this.target.y + this.target.height / 2;
        let dx = targetX - this.x;
        let dy = targetY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          this.speedX = (dx / distance) * bulletSpeed;
          this.speedY = (dy / distance) * bulletSpeed;
          this.otherDirection = this.speedX < 0;
        }
      }

      this.x += this.speedX;
      this.y += this.speedY;

      if (this.width < 60) {
        this.width += 0.5;
        this.height += 0.5;
      }

      if (this.world) {
        this.world.particles.push(
          new Particle(
            this.x + this.width / 2,
            this.y + this.height / 2,
            "rgba(200, 200, 200, 0.5)",
          ),
        );
      }
    }, 1000 / 60);
  }
}
