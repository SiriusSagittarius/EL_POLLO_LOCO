class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;
  parallaxFactor = 0.15;
  speed = 0.15;

  constructor(x) {
    super();
    let randomImage = Math.random() < 0.5 ? "1.png" : "2.png";
    this.loadImage(`img/5_background/layers/4_clouds/${randomImage}`);

    this.x = x + Math.random() * 500;
    this.y = Math.random() * 50;
    this.speed = 0.1 + Math.random() * 0.2;
    this.animate();
  }

  animate() {
    this.setStoppableInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
