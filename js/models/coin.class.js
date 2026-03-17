class Coin extends MovableObject {
  IMAGES_COIN = [
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png",
  ];

  constructor() {
    super();
    this.loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COIN);
    this.x = 200 + Math.random() * 500;
    this.y = 100 + Math.random() * 150;
    this.width = 100;
    this.height = 100;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 200);
  }
}
