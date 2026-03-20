class KamehamehaWave extends MovableObject {
  width = 100;
  height = 100;

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y, direction) {
    super();
    this.loadImage(this.IMAGES_SPLASH[0]);
    this.loadImages(this.IMAGES_SPLASH);

    this.x = x;
    this.y = y;
    this.otherDirection = direction;
    this.shoot();
    this.animate();
  }

  shoot() {
    let speed = 40;
    this.setStoppableInterval(() => {
      if (this.otherDirection) {
        this.x -= speed;
      } else {
        this.x += speed;
      }
    }, 1000 / 60);
  }

  animate() {
    this.setStoppableInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH);
    }, 50);
  }
}
