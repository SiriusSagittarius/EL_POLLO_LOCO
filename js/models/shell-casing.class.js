class ShellCasing extends MovableObject {
  constructor(x, y, characterDirection) {
    super();
    this.loadImage(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYGBg+A8AAQQBAHAgZQsAAAAASUVORK5CYII=",
    );
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 5;

    this.speedY = 5 + Math.random() * 3;
    this.speedX = characterDirection
      ? 2 + Math.random() * 2
      : -2 - Math.random() * 2;
    this.angularVelocity = (Math.random() - 0.5) * 0.5;

    this.applyShellGravity();
    this.fadeOut();
  }

  applyShellGravity() {
    const gravityInterval = setInterval(() => {
      this.y -= this.speedY;
      this.speedY -= 0.4;
      this.x += this.speedX;
      this.angle += this.angularVelocity;

      if (this.y > 420) {
        clearInterval(gravityInterval);
      }
    }, 1000 / 60);
  }

  fadeOut() {
    setTimeout(() => {
      this.toDelete = true;
    }, 2000);
  }
}
