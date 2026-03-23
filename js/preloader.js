/**
 * Startet den Ladevorgang (Preloading) für alle Bilder im Spiel.
 * @returns {void}
 */
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
    "img/5_background/layers/1_first_layer/1.png",
    "img/5_background/layers/1_first_layer/2.png",
    "img/5_background/layers/2_second_layer/1.png",
    "img/5_background/layers/2_second_layer/2.png",
    "img/5_background/layers/3_third_layer/1.png",
    "img/5_background/layers/3_third_layer/2.png",
    "img/5_background/layers/air.png",
    "img/5_background/layers/4_clouds/1.png",
    "img/5_background/layers/4_clouds/2.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
    "img/8_coin/coin_1.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/You won, you lost/You Win A.png",
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
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
