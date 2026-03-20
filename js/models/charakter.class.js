/**
 * @class Character
 * Repräsentiert die Hauptfigur (Pepe) und steuert deren Status, Eingaben und Animationen.
 * @extends MovableObject
 */
class Character extends MovableObject {
  height = 280;
  width = 250;
  y = 80;
  speed = 3;
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
    this.applyGravity();
    this.animate();
  }

  /**
   * Startet die kontinuierliche Abfrage von Bewegungen und das Abspielen der jeweiligen Animationen.
   * @returns {void}
   */
  animate() {
    setInterval(() => {
      if (this.isFlying) {
        if (this.world && this.world.keyboard.SPACE) {
          this.x += Math.cos(this.worldAngle) * this.speed * 2;
          this.y += Math.sin(this.worldAngle) * this.speed * 2;
        }
      } else {
        if (this.world && this.world.keyboard.RIGHT) {
          this.x += this.speed;
          this.otherDirection = false;
        }
        if (this.world && this.world.keyboard.LEFT) {
          this.x -= this.speed;
          this.otherDirection = true;
        }
        if (this.world && this.world.keyboard.SPACE && !this.isAboveGround()) {
          this.jump();
        }
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isFlying) {
        if (this.isWheelUp) {
          this.playAnimation(this.IMAGES_WHEEL_UP);
        } else if (this.isWheelDown) {
          this.playAnimation(this.IMAGES_WHEEL_DOWN);
        } else if (this.isShooting) {
          this.playAnimation(this.IMAGES_FLYING_FIRE);
        } else if (this.world && this.world.keyboard.SPACE) {
          const verticalDirection = Math.sin(this.worldAngle);
          if (verticalDirection < -0.1) {
            this.playAnimation(this.IMAGES_FLYING_UP);
          } else if (verticalDirection > 0.1) {
            this.playAnimation(this.IMAGES_FLYING_DOWN);
          } else {
            this.playAnimation(this.IMAGES_FLYING);
          }
        } else {
          this.playAnimation(this.IMAGES_FLYING);
        }
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else if (this.isUziWheelUp) {
        this.playAnimation(this.IMAGES_UZI_WHEEL_UP);
      } else if (this.isUziWheelDown) {
        this.playAnimation(this.IMAGES_UZI_WHEEL_DOWN);
      } else if (this.isUziForward) {
        if (
          this.world &&
          (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
        ) {
          this.playAnimation(this.IMAGES_UZI_SHOTWALK);
        } else {
          this.playAnimation(this.IMAGES_UZI_SHOT);
        }
      } else if (this.isShooting) {
        this.playAnimation(this.IMAGES_SHOOTING);
      } else if (
        this.world &&
        (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
      ) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.playAnimation(this.IMAGES_IDLE);
      }
    }, 100);
  }

  /**
   * Lässt den Charakter springen.
   * @returns {void}
   */
  jump() {
    this.speedY = 30;
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
