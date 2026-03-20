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
  isFlying = false;
  isUpsideDown = false;
  isRotating = false;
  currentWeapon = "uzi";
  isUziForward = false;
  isUziWheelUp = false;
  isUziWheelDown = false;
  hasUzi = false;
  bottles = 0;
  impaledChicken = false;
  shotsWithChicken = 0;
  isWheelUp = false;
  isWheelDown = false;
  worldAngle = 0;
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

  IMAGES_UZI_SHOT = [
    "img/2_character_pepe/6_shooting/uzi/shot/1.png",
    "img/2_character_pepe/6_shooting/uzi/shot/2.png",
  ];
  IMAGES_UZI_SHOTWALK = [
    "img/2_character_pepe/6_shooting/uzi/shotwalk/0.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/1.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/2.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/3.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/4.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/5.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/6.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/7.png",
  ];
  IMAGES_UZI_WHEEL_UP = [
    "img/2_character_pepe/6_shooting/uzi/wheel/1/00.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/1/01.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/1/02.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/1/03.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/1/04.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/1/05.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/1/06.png",
  ];
  IMAGES_UZI_WHEEL_DOWN = [
    "img/2_character_pepe/6_shooting/uzi/wheel/2/1.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/2/2.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/2/3.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/2/4.png",
  ];

  IMAGES_FLYING = ["img/2_character_pepe/8_flying/fly/fly.png"];
  IMAGES_FLYING_FIRE = [
    "img/2_character_pepe/8_flying/flyfire/1.png",
    "img/2_character_pepe/8_flying/flyfire/2.png",
    "img/2_character_pepe/8_flying/flyfire/4.png",
    "img/2_character_pepe/8_flying/flyfire/5.png",
  ];
  IMAGES_FLYING_UP = ["img/2_character_pepe/8_flying/fly/up.png"];
  IMAGES_FLYING_DOWN = ["img/2_character_pepe/8_flying/fly/down.png"];

  IMPALED_CHICKEN_IMAGES = [
    "img/3_enemies_chicken/chicken_sven/3_shot/1.png",
    "img/3_enemies_chicken/chicken_sven/3_shot/2.png",
  ];

  IMAGES_WHEEL_UP = [
    "img/2_character_pepe/8_flying/wheel/1.png",
    "img/2_character_pepe/8_flying/wheel/2.png",
    "img/2_character_pepe/8_flying/wheel/3.png",
    "img/2_character_pepe/8_flying/wheel/4.png",
  ];
  IMAGES_WHEEL_DOWN = [
    "img/2_character_pepe/8_flying/wheelfire/1d.png",
    "img/2_character_pepe/8_flying/wheelfire/2d.png",
    "img/2_character_pepe/8_flying/wheelfire/3d.png",
    "img/2_character_pepe/8_flying/wheelfire/4d.png",
    "img/2_character_pepe/8_flying/wheelfire/5d.png",
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
  broom_sound = new Audio("audio/besenpower.mp3");

  constructor() {
    /**
     * Erzeugt eine Instanz des Spielcharakters.
     */
    super();
    this.loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_FLYING_FIRE);
    this.broom_sound.loop = true;
    this.loadImages(this.IMAGES_FLYING_UP);
    this.loadImages(this.IMAGES_FLYING_DOWN);
    this.loadImages(this.IMAGES_WHEEL_UP);
    this.loadImages(this.IMAGES_WHEEL_DOWN);
    this.loadImages(this.IMPALED_CHICKEN_IMAGES);
    this.loadImages(this.IMAGES_UZI_SHOT);
    this.loadImages(this.IMAGES_UZI_SHOTWALK);
    this.loadImages(this.IMAGES_UZI_WHEEL_UP);
    this.loadImages(this.IMAGES_UZI_WHEEL_DOWN);
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
    if (this.isFlying) this.handleFlyingMovement(deltaTime);
    else this.handleGroundMovement(deltaTime);
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
   * Behandelt die Bewegung in der Luft (Flugmodus).
   * @param {number} deltaTime - Die Zeit seit dem letzten Frame.
   */
  handleFlyingMovement(deltaTime) {
    if (this.world && this.world.keyboard.SPACE) {
      this.x += Math.cos(this.worldAngle) * this.speed * 2 * deltaTime;
      this.y += Math.sin(this.worldAngle) * this.speed * 2 * deltaTime;
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
    if (this.isFlying) return this.getFlyingAnimationImages();
    if (this.isAboveGround()) return this.IMAGES_JUMPING;
    return this.getGroundAnimationImages();
  }

  /**
   * Ermittelt die Animation für den Flugmodus.
   * @returns {string[]} Das Array mit den Bildpfaden für die Animation.
   */
  getFlyingAnimationImages() {
    if (this.isWheelUp) return this.IMAGES_WHEEL_UP;
    if (this.isWheelDown) return this.IMAGES_WHEEL_DOWN;
    if (this.isShooting) return this.IMAGES_FLYING_FIRE;
    if (this.world && this.world.keyboard.SPACE) {
      const vDir = Math.sin(this.worldAngle);
      if (vDir < -0.1) return this.IMAGES_FLYING_UP;
      if (vDir > 0.1) return this.IMAGES_FLYING_DOWN;
    }
    return this.IMAGES_FLYING;
  }

  /**
   * Ermittelt die Animation für den Bodenkampf.
   * @returns {string[]} Das Array mit den Bildpfaden für die Animation.
   */
  getGroundAnimationImages() {
    if (this.isUziWheelUp) return this.IMAGES_UZI_WHEEL_UP;
    if (this.isUziWheelDown) return this.IMAGES_UZI_WHEEL_DOWN;
    if (this.isUziForward) {
      const isMoving =
        this.world && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT);
      return isMoving ? this.IMAGES_UZI_SHOTWALK : this.IMAGES_UZI_SHOT;
    }
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
    this.broom_sound.volume = volume;
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

  /**
   * Löst eine Feuerrad-Animation auf dem Besen aus (auf oder ab).
   * @param {number} deltaY - Die Scroll-Richtung des Mausrads.
   * @returns {void}
   */
  triggerWheelAnimation(deltaY) {
    if (this.isWheelUp || this.isWheelDown || this.isRotating) return;

    this.currentImage = 0;
    if (deltaY < 0) {
      this.isWheelUp = true;
      setTimeout(() => (this.isWheelUp = false), 400);
    } else {
      this.isWheelDown = true;
      setTimeout(() => (this.isWheelDown = false), 500);
    }
  }

  /**
   * Löst die Uzi-Rundumschlag-Animation aus.
   * @param {number} deltaY - Die Scroll-Richtung des Mausrads.
   * @returns {void}
   */
  triggerUziWheelAnimation(deltaY) {
    if (this.isUziWheelUp || this.isUziWheelDown) return;

    this.currentImage = 0;
    if (deltaY < 0) {
      this.isUziWheelUp = true;
      setTimeout(() => (this.isUziWheelUp = false), 700);
    } else {
      this.isUziWheelDown = true;
      setTimeout(() => (this.isUziWheelDown = false), 400);
    }
  }

  /**
   * Lässt den Charakter rotieren (z.B. bei speziellen Ausweichmanövern).
   * @returns {void}
   */
  rotate() {
    if (!this.isRotating) {
      this.isRotating = true;
      this.currentImage = 0;
      setTimeout(() => {
        this.isRotating = false;
        this.isUpsideDown = false;
      }, 1900);
    }
  }

  /**
   * Schaltet den Flugmodus (Besen) an oder aus.
   * @returns {void}
   */
  toggleFlying() {
    this.isFlying = !this.isFlying;
    if (!this.isFlying) {
      this.angle = 0;
      this.currentImage = 0;
      this.broom_sound.pause();
    } else {
      if (this.world) this.broom_sound.volume = this.world.volume;
      this.broom_sound.play().catch(() => {});
    }
  }

  /**
   * Schaltet zwischen den primären Boden-Waffen (Uzi, Shotgun) um.
   * @returns {void}
   */
  cycleWeapon() {
    // Definiere die verfügbaren Waffen
    const groundWeapons = ["uzi", "shotgun"];
    const allWeapons = ["uzi", "shotgun", "broom"];

    // Prüfe, ob der Besen Treibstoff hat
    let availableWeapons = groundWeapons;
    if (this.world && this.world.coinBar.percentage > 0) {
      availableWeapons = allWeapons;
    }

    let currentIndex = availableWeapons.indexOf(this.currentWeapon);
    if (currentIndex === -1) {
      currentIndex = 0; // Fallback, falls die aktuelle Waffe nicht verfügbar ist
    }

    let nextIndex = (currentIndex + 1) % availableWeapons.length;
    this.currentWeapon = availableWeapons[nextIndex];

    // Sorge dafür, dass der Flugstatus zur Waffe passt
    if (this.currentWeapon === "broom" && !this.isFlying) {
      this.toggleFlying();
    } else if (this.currentWeapon !== "broom" && this.isFlying) {
      this.toggleFlying();
    }
  }

  /**
   * Führt einen schnellen Schuss mit der Uzi nach vorne aus.
   * @returns {void}
   */
  shootUziForward() {
    if (!this.isUziForward) {
      this.isUziForward = true;
      this.currentImage = 0;
      setTimeout(() => {
        this.isUziForward = false;
      }, 200);
    }
  }
}
