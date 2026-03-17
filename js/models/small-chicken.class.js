class SmallChicken extends MovableObject {
  y = 380;
  height = 50;
  width = 50;
  world;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  constructor(x) {
    super();
    this.loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");

    if (x !== undefined) {
      this.x = x;
    } else {
      this.x = 400 + Math.random() * 3000;
    }
    this.speed = 0.5 + Math.random() * 1.5;

    this.animate();
  }

  animate() {
    this.setStoppableInterval(() => {
      if (
        this.world &&
        this.world.character &&
        !this.world.character.isFlying
      ) {
        if (this.x > this.world.character.x + 50) {
          this.x -= this.speed;
          this.otherDirection = false;
        } else if (this.x < this.world.character.x - 50) {
          this.x += this.speed;
          this.otherDirection = true;
        }
      } else {
        this.x -= this.speed;
      }
    }, 1000 / 60);

    this.setStoppableInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 100);
  }
}
