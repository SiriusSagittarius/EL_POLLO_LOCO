class Explosion extends MovableObject {
  IMAGES_EXPLOSION = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y) {
    super();
    this.loadImage(this.IMAGES_EXPLOSION[0]);
    this.loadImages(this.IMAGES_EXPLOSION);
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
    this.animate();
  }

  animate() {
    let interval = setInterval(() => {
      this.playAnimation(this.IMAGES_EXPLOSION);
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      this.toDelete = true;
    }, 300);
  }
}
