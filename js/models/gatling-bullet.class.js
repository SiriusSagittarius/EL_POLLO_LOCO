class GatlingBullet extends MovableObject {
  width = 15;
  height = 10;
  speedX = 0;
  speedY = 0;
  target = null;
  world = null;
  isSpinning = false;

  constructor(
    x,
    y,
    direction,
    yOffset = 0,
    target = null,
    world = null,
    customImage = null,
  ) {
    super();
    if (customImage) {
      this.img = customImage;
    } else {
      this.loadImage("img/2_character_pepe/6_shooting/gatling_bullet.png");
    }

    this.x = x;
    this.y = y + yOffset;
    this.target = target;
    this.world = world;

    let bulletSpeed = 50;

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

  shoot() {
    this.setStoppableInterval(() => {
      if (this.target && !this.target.isDead()) {
        let bulletSpeed = 50;
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

      if (this.isSpinning) {
        this.angle += this.speedX > 0 ? 0.3 : -0.3;
      }

      if (this.world) {
        this.world.particles.push(
          new Particle(
            this.x + this.width / 2,
            this.y + this.height / 2,
            "rgba(255, 100, 0, 0.5)",
          ),
        );
      }
    }, 1000 / 60);
  }
}
