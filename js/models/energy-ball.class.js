class EnergyBall extends MovableObject {
  width = 100;
  height = 100;

  constructor(x, y, direction) {
    super();
    this.loadImage("img/effects/energy_ball.png");
    this.x = x;
    this.y = y;
    this.otherDirection = direction;
    this.shoot();
  }

  shoot() {
    let speed = 15;
    this.setStoppableInterval(() => {
      if (this.otherDirection) {
        this.x -= speed;
      } else {
        this.x += speed;
      }
    }, 1000 / 60);
  }
}
