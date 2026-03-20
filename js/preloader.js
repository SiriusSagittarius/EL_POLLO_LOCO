function startPreloading() {
  let startScreen = document.getElementById("startScreen");
  if (startScreen) startScreen.style.display = "none";

  let imagesToLoad = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/3_enemies_chicken/chicken_sven/1_walk/4.png",
    "img/3_enemies_chicken/chicken_sven/1_walk/5.png",
    "img/5_background/layers/1_boden/1.png",
    "img/5_background/layers/1_boden/2.png",
    "img/5_background/layers/2_berge/1.png",
    "img/5_background/layers/2_berge/2.png",
    "img/5_background/layers/3_blum/1.png",
    "img/5_background/layers/3_blum/2.png",
    "img/5_background/layers/3_blum/3.png",
    "img/5_background/layers/3_blum/4.png",
    "img/5_background/layers/3_blum/5.png",
    "img/5_background/layers/3_blum/6.png",
    "img/5_background/layers/3_blum/7.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
    "img/8_coin/coin_1.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/You won, you lost/You Win A.png",
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    "img/2_character_pepe/8_flying/wheel/1.png",
    "img/2_character_pepe/8_flying/wheel/2.png",
    "img/2_character_pepe/8_flying/wheel/3.png",
    "img/2_character_pepe/8_flying/wheel/4.png",
    "img/2_character_pepe/8_flying/wheelfire/1d.png",
    "img/2_character_pepe/8_flying/wheelfire/2d.png",
    "img/2_character_pepe/8_flying/wheelfire/3d.png",
    "img/2_character_pepe/8_flying/wheelfire/4d.png",
    "img/2_character_pepe/8_flying/wheelfire/5d.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/1/00.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/1/01.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/1/02.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/1/03.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/1/04.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/1/05.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/1/06.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/2/1.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/2/2.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/2/3.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/2/4.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/0.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/1.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/2.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/3.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/4.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/5.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/6.png",
    "img/2_character_pepe/6_shooting/uzi/shotwalk/7.png",
    "img/2_character_pepe/6_shooting/shotgun/1.png",
    "img/2_character_pepe/6_shooting/shotgun/2.png",
    "img/2_character_pepe/6_shooting/shotgun/3.png",
    "img/2_character_pepe/6_shooting/shotgun/4.png",
    "img/2_character_pepe/6_shooting/shotgun/5.png",
    "img/2_character_pepe/6_shooting/shotgun/bullet.png",
  ];

  let loadedCount = 0;
  let totalImages = imagesToLoad.length;
  let loadingBar = document.getElementById("loadingBar");
  let loadingPercent = document.getElementById("loadingPercent");
  let loadingScreen = document.getElementById("loadingScreen");

  const updateProgress = () => {
    loadedCount++;
    let percent = Math.round((loadedCount / totalImages) * 100);

    if (loadingBar) loadingBar.style.width = percent + "%";
    if (loadingPercent) loadingPercent.innerText = percent + "%";

    if (loadedCount >= totalImages) {
      setTimeout(() => {
        if (loadingScreen) loadingScreen.style.display = "none";
        let screen = document.getElementById("startScreen");
        if (screen) screen.style.display = "flex";
      }, 500);
    }
  };

  imagesToLoad.forEach((path) => {
    let img = new Image();
    img.src = path;
    img.onload = updateProgress;
    img.onerror = () => {
      console.warn("Konnte Bild nicht vorladen:", path);
      updateProgress();
    };
  });
}