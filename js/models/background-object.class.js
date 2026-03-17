class BackgroundObject extends MovableObject {
  width = 1902;
  height = 480;
  parallaxFactor;

  constructor(imagePath, x, parallaxFactor = 1) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
    this.parallaxFactor = parallaxFactor;
  }
}
