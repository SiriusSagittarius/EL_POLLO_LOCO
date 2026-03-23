/**
 * @class Character
 * Repräsentiert die Hauptfigur (Pepe) und steuert deren Status, Eingaben und Animationen.
 * @extends MovableObject
 */
class Character extends MovableObject {
  height = 280;
  width = 250;
  y = 150;
  speed = 200; // pixels per second
  otherDirection = false;
  isShooting = false;
  bottles = 0;
  offset = {
    top: 120,
    bottom: 30,
    left: 40,
    right: 30,
  };

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_SHOOTING = [
    "img/2_character_pepe/6_shooting/shotgun/1.png",
    "img/2_character_pepe/6_shooting/shotgun/2.png",
    "img/2_character_pepe/6_shooting/shotgun/3.png",
    "img/2_character_pepe/6_shooting/shotgun/4.png",
    "img/2_character_pepe/6_shooting/shotgun/5.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  jump_sound = new Audio("audio/jump.mp3");
  hurt_sound = new Audio("audio/hurt.mp3");

  /**
   * Erzeugt eine Instanz des Spielcharakters.
   */
  constructor() {
    super();
    this.loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_IDLE);
    this.gravityEnabled = true;
  }

  /**
   * Main update loop for the character.
   * @param {number} deltaTime - Time since last frame.
   */
  update(deltaTime) {
    super.update(deltaTime); // Handles gravity
    this.updateMovement(deltaTime);
    this.updateAnimation(deltaTime);
  }

  /**
   * Aktualisiert die Spielerbewegung basierend auf Tastatureingaben.
   * @param {number} deltaTime - Die Zeit seit dem letzten Frame.
   */
  updateMovement(deltaTime) {
    this.handleGroundMovement(deltaTime);
  }

  /**
   * Behandelt die Bewegung am Boden und Sprünge.
   * @param {number} deltaTime - Die Zeit seit dem letzten Frame.
   */
  handleGroundMovement(deltaTime) {
    if (this.world && this.world.keyboard.RIGHT) {
      this.x += this.speed * deltaTime;
      this.otherDirection = false;
    }
    if (this.world && this.world.keyboard.LEFT) {
      this.x -= this.speed * deltaTime;
      this.otherDirection = true;
    }
    if (this.world && this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
    }
  }

  /**
   * Wählt die passende Animation aus und spielt sie ab.
   * @param {number} deltaTime - Die Zeit seit dem letzten Frame.
   */
  updateAnimation(deltaTime) {
    this.animationTimer += deltaTime;
    if (this.animationTimer >= 0.1) {
      // 10fps
      const images = this.getAnimationImages();
      this.playAnimation(images);
      this.animationTimer = 0;
    }
  }

  /**
   * Ermittelt das passende Animations-Array basierend auf dem Charakterstatus.
   * @returns {string[]} Das Array mit den Bildpfaden für die Animation.
   */
  getAnimationImages() {
    if (this.isDead()) return this.IMAGES_DEAD;
    if (this.isHurt()) return this.IMAGES_HURT;
    if (this.isAboveGround()) return this.IMAGES_JUMPING;
    return this.getGroundAnimationImages();
  }

  /**
   * Ermittelt die Animation für den Bodenkampf.
   * @returns {string[]} Das Array mit den Bildpfaden für die Animation.
   */
  getGroundAnimationImages() {
    if (this.isShooting) return this.IMAGES_SHOOTING;
    if (this.world && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
      return this.IMAGES_WALKING;
    }
    return this.IMAGES_IDLE;
  }

  /**
   * Lässt den Charakter springen.
   * @returns {void}
   */
  jump() {
    this.speedY = 700; // pixels per second
    this.jump_sound.play().catch(() => {});
  }

  /**
   * Zieht bei einem Treffer Energie ab und spielt einen Sound ab.
   * @returns {void}
   */
  hit() {
    this.hurt_sound.play().catch(() => {});
    super.hit();
  }

  /**
   * Aktualisiert die Spiellautstärke für die Effekte des Charakters.
   * @param {number} volume - Lautstärkewert (0.0 bis 1.0).
   * @returns {void}
   */
  updateVolume(volume) {
    this.jump_sound.volume = volume;
    this.hurt_sound.volume = volume;
  }

  /**
   * Führt einen Standard-Schuss aus, sofern kein Cooldown aktiv ist.
   * @returns {boolean} True, wenn erfolgreich geschossen wurde.
   */
  shoot() {
    if (!this.isShooting) {
      this.isShooting = true;
      this.currentImage = 0;

      setTimeout(() => {
        this.isShooting = false;
      }, 500);
      return true;
    }
  }
}
