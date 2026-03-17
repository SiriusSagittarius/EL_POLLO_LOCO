let canvas;
let world;
let crosshair;
let keyboard = {
  RIGHT: false,
  LEFT: false,
  UP: false,
  DOWN: false,
  SPACE: false,
  D: false,
  F: false,
  U: false,
  S: false,
  B: false,
};

let menu_sound = new Audio("audio/menu.mp3");
let background_sound = new Audio("audio/hauptspiel.wav");
let mousePosition = { x: 0, y: 0 };

let globalVolume = 0.5;
let isMuted = false;
let tempScore = 0;
let gamePaused = false;
let intervalIds = [];
let currentPlayerName = "Anonym";

const originalSetInterval = window.setInterval;
const originalClearInterval = window.clearInterval;

window.setInterval = (fn, delay) => {
  const id = originalSetInterval(() => {
    if (!gamePaused) {
      fn();
    }
  }, delay);
  intervalIds.push(id);
  return id;
};

window.clearInterval = (id) => {
  originalClearInterval(id);
  intervalIds = intervalIds.filter((storedId) => storedId !== id);
};

/**
 * Entsperrt ein Audio-Objekt durch stummes Anspielen beim Klick (wichtig für Safari/Mobile).
 */
function unlockAudio(audio) {
  audio.volume = 0;
  let playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
      })
      .catch(() => {});
  }
}

/**
 * Initialisiert das Spiel, lädt HTML-Templates und startet den Preloader.
 */
function init() {
  canvas = document.getElementById("canvas");
  crosshair = document.getElementById("crosshair");
  document
    .getElementById("game-container")
    .insertAdjacentHTML("beforeend", renderOverlay());

  if (isMobile()) {
    document
      .getElementById("game-container")
      .insertAdjacentHTML("beforeend", renderTouchControls());
  }

  document.getElementById("overlay-container").innerHTML = renderAllScreens();
  document
    .getElementById("overlay-container")
    .insertAdjacentHTML("beforeend", renderLoadingScreen());
  startPreloading();

  document.addEventListener("fullscreenchange", () => {
    let icons = [
      document.getElementById("fullscreenIcon"),
      document.getElementById("fullscreenIconStart"),
    ];
    let isFullscreen = document.fullscreenElement;
    let enterIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
    let exitIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`;

    icons.forEach((icon) => {
      if (icon) {
        icon.innerHTML = isFullscreen ? exitIcon : enterIcon;
      }
    });
  });

  canvas.addEventListener("mousemove", (e) => {
    let rect = canvas.getBoundingClientRect();
    mousePosition.x = e.clientX - rect.left;
    mousePosition.y = e.clientY - rect.top;

    if (crosshair && crosshair.style.display === "block") {
      crosshair.style.left = mousePosition.x - crosshair.offsetWidth / 2 + "px";
      crosshair.style.top = mousePosition.y - crosshair.offsetHeight / 2 + "px";
    }
  });

  if (isMobile()) {
    bindTouchEvents();
  }

  menu_sound.loop = true;
  menu_sound.volume = isMuted ? 0 : globalVolume;
  menu_sound.play().catch((error) => {
    console.log(
      "Autoplay wurde blockiert - Musik startet erst nach Interaktion",
    );
  });
}

/**
 * Prüft, ob das Gerät ein mobiles Gerät ist.
 * @returns {boolean} True bei mobilem User-Agent.
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/**
 * Bindet Touch-Events für die mobile Steuerung an die Buttons.
 */
function bindTouchEvents() {
  const bindBtn = (id, key) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard[key] = true;
    });
    btn.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });
  };

  bindBtn("btnLeft", "LEFT");
  bindBtn("btnRight", "RIGHT");
  bindBtn("btnJump", "SPACE");
  bindBtn("btnShoot", "D");
  bindBtn("btnThrow", "S");

  const bindAction = (id, action) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      action();
    });
  };

  bindAction("btnUzi", () => {
    if (world && world.character) {
      world.character.currentWeapon = "uzi";
      if (world.character.isFlying) world.character.toggleFlying();
    }
  });

  bindAction("btnShotgun", () => {
    if (world && world.character) {
      world.character.currentWeapon = "shotgun";
      if (world.character.isFlying) world.character.toggleFlying();
    }
  });

  bindAction("btnBroom", () => {
    if (world && world.character) {
      if (world.character.isFlying) {
        world.character.toggleFlying();
        world.character.currentWeapon = "uzi";
      } else if (world.coinBar.percentage > 0) {
        world.character.currentWeapon = "broom";
        world.character.toggleFlying();
      }
    }
  });

  bindAction("btnSpecial", () => {
    if (world && world.character) {
      if (world.character.isFlying) {
        world.character.triggerWheelAnimation(100);
      } else if (world.character.currentWeapon === "uzi") {
        world.triggerUziWheelAttack(100);
      }
    }
  });
}

/**
 * Startet das eigentliche Spiel (erstellt die World-Instanz).
 */
function startGame() {
  let inputName = document.getElementById("startNameInput").value;
  if (inputName && inputName.trim() !== "") {
    currentPlayerName = inputName.trim();
  }

  menu_sound.pause();
  unlockAudio(background_sound);
  document.getElementById("startScreen").style.display = "none";

  showStoryScreen();
}

/**
 * Zeigt den Story-Textbildschirm an, bevor das Intro-Video und das Spiel starten.
 */
function showStoryScreen() {
  let container = document.getElementById("game-container");
  let storyScreen = document.getElementById("storyScreen");

  if (!storyScreen) {
    storyScreen = document.createElement("div");
    storyScreen.id = "storyScreen";
    storyScreen.style.position = "absolute";
    storyScreen.style.left = "0";
    storyScreen.style.top = "0";
    storyScreen.style.width = "100%";
    storyScreen.style.height = "100%";
    storyScreen.style.backgroundColor = "black";
    storyScreen.style.zIndex = "100";
    storyScreen.style.display = "flex";
    storyScreen.style.flexDirection = "column";
    storyScreen.style.justifyContent = "center";
    storyScreen.style.alignItems = "center";
    storyScreen.style.padding = "40px";
    storyScreen.style.boxSizing = "border-box";
    storyScreen.style.textAlign = "center";

    storyScreen.innerHTML = `
      <div style="background-color: rgba(60, 60, 60, 0.95); padding: 30px; border-radius: 20px; border: 2px solid white; max-width: 700px; max-height: 90%; overflow-y: auto; box-shadow: 0 0 20px black; display: flex; flex-direction: column; align-items: center;">
        <h2 style="color: orange; font-family: sans-serif; font-size: 28px; margin-top: 0; margin-bottom: 20px;">Pepe und der Raub der La Puta Perdita Durango</h2>
        <p style="color: white; font-family: sans-serif; font-size: 16px; line-height: 1.5; margin-bottom: 30px; white-space: pre-line; text-align: left;">
In der trockende Wüste von Memegard lebte Pepe, ein Mann von edler Gestalt und melancholischem Blick. Sein Herz gehörte einzig und allein der wunderschönen La Puta Perdita Durango. Ihr Name klang wie ein Sommergedicht, ihre Anwesenheit war wie das sanfte Quaken im Mondschein. Doch die Idylle wurde jäh zerstört.

Die Entführung

Das Böse Oberhuhn, ein gefiedertes Monstrum mit einer Krone aus Maiskolben und einem Blick, der Steine zu Rührei verwandeln konnte, hatte La Puta Perdita Durango entführt. Warum? Weil das Oberhuhn ein Faible für schlechte Wortwitze hatte. In seinem Turm aus Eierschalen verkündete es lautstark:

„Diese La Puta Perdita Durango ist einfach viel zu... gut zu vögeln!“

Pepe wusste, was das bedeutete. Das Oberhuhn wollte sie in seinen Harem aus Singvögeln aufnehmen, um sie dort mit unendlichem Gegackere und Körnerfutter zu quälen. Das konnte er nicht zulassen.
        </p>
        <button id="proceedToIntroBtn" class="menu-btn" style="background-color: orange; color: white; border: none; padding: 15px 30px; font-size: 20px; border-radius: 10px; cursor: pointer;">Zum Intro</button>
      </div>
    `;
    container.appendChild(storyScreen);

    document.getElementById("proceedToIntroBtn").onclick = () => {
      storyScreen.style.display = "none";
      playIntroVideo(() => {
        document.getElementById("btnMenu").style.display = "flex";
        world = new World(canvas, keyboard);
        showCrosshair();
        world.updateVolume(isMuted ? 0 : globalVolume);
        console.log("Spiel gestartet!");
      });
    };
  } else {
    storyScreen.style.display = "flex";
  }
}

/**
 * Startet das Spiel neu (Reset).
 */
function restartGame() {
  if (world) {
    world.stopGame();
    world = null;
  }
  clearAllIntervals();
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
  document.getElementById("newHighscoreMenu").style.display = "none";
  document.getElementById("btnMenu").style.display = "none";
  hideCrosshair();

  unlockAudio(background_sound);
  playIntroVideo(() => {
    if (!world) {
      world = new World(canvas, keyboard);
      showCrosshair();
      world.updateVolume(isMuted ? 0 : globalVolume);
      document.getElementById("btnMenu").style.display = "flex";
      console.log("Spiel neu gestartet!");
      gamePaused = false;
    }
  });
}

/**
 * Spielt das Intro-Video ab und führt danach einen Callback aus.
 */
function playIntroVideo(onComplete) {
  createAndPlayVideo(
    "introVideo",
    "video/intro.mp4",
    "Intro überspringen ⏭",
    100,
    onComplete,
  );
}

/**
 * Startet das Outro-Video und kehrt danach zum Menü zurück.
 */
function playOutroVideoAndRestart() {
  document.getElementById("winScreen").style.display = "none";
  playOutroVideo(() => {
    backToMenu();
  });
}

/**
 * Spielt das Outro-Video ab und führt danach einen Callback aus.
 */
function playOutroVideo(onComplete) {
  if (world && world.background_sound) {
    world.background_sound.pause();
  }
  createAndPlayVideo(
    "outroVideo",
    "video/win.mp4",
    "Video überspringen ⏭",
    2000,
    onComplete,
  );
}

/**
 * Hilfsfunktion zum Erstellen und Abspielen von Videos (Intro/Outro).
 */
function createAndPlayVideo(videoId, src, skipText, zIndex, onComplete) {
  let container = document.getElementById("game-container");
  let video = document.getElementById(videoId);
  let skipBtn = document.getElementById(videoId + "SkipBtn");

  if (!video) {
    video = document.createElement("video");
    video.id = videoId;
    video.src = src;
    video.style.position = "absolute";
    video.style.top = "0";
    video.style.left = "0";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.zIndex = zIndex.toString();
    video.style.objectFit = "cover";
    video.style.pointerEvents = "none";
    container.appendChild(video);
  }

  if (!skipBtn) {
    skipBtn = document.createElement("button");
    skipBtn.id = videoId + "SkipBtn";
    skipBtn.innerText = skipText;
    skipBtn.style.position = "absolute";
    skipBtn.style.bottom = "30px";
    skipBtn.style.right = "30px";
    skipBtn.style.zIndex = (zIndex + 1).toString();
    skipBtn.style.padding = "10px 20px";
    skipBtn.style.fontSize = "18px";
    skipBtn.style.fontFamily = "sans-serif";
    skipBtn.style.color = "white";
    skipBtn.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    skipBtn.style.border = "2px solid white";
    skipBtn.style.borderRadius = "10px";
    skipBtn.style.cursor = "pointer";
    container.appendChild(skipBtn);
  }

  video.style.display = "block";
  video.style.opacity = "1";
  video.currentTime = 0;
  skipBtn.style.display = "block";

  let finished = false;
  const finishVideo = () => {
    if (!finished) {
      finished = true;
      video.style.display = "none";
      skipBtn.style.display = "none";
      if (onComplete) onComplete();
    }
  };

  skipBtn.onclick = () => {
    video.pause();
    video.ontimeupdate = null;
    finishVideo();
  };

  video.ontimeupdate = () => {
    if (video.duration && video.currentTime >= video.duration - 0.1) {
      video.pause();
      video.ontimeupdate = null;
      finishVideo();
    }
  };

  video.onerror = finishVideo;
  video.onended = finishVideo;

  video.play().catch((e) => {
    console.warn("Video konnte nicht automatisch starten:", e);
    finishVideo();
  });
}

/**
 * Pausiert das Spiel.
 */
function pauseGame() {
  if (world) {
    gamePaused = true;
    world.background_sound.pause();
    if (world.character && world.character.isFlying)
      world.character.broom_sound.pause();
    document.getElementById("pauseMenu").style.display = "flex";
    document.getElementById("btnMenu").style.display = "none";
  }
}

/**
 * Setzt das Spiel nach Pause fort.
 */
function resumeGame() {
  if (world) {
    gamePaused = false;
    world.background_sound.play();
    if (world.character && world.character.isFlying)
      world.character.broom_sound.play().catch(() => {});
    document.getElementById("pauseMenu").style.display = "none";
    document.getElementById("btnMenu").style.display = "flex";
  }
}

/**
 * Kehrt zum Hauptmenü zurück.
 */
function backToMenu() {
  if (world) {
    world.stopGame();
  }
  document.getElementById("pauseMenu").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("btnMenu").style.display = "none";
  clearAllIntervals();
  hideCrosshair();
  world = null;
  menu_sound.play();
}

/**
 * Löscht alle aktiven Intervalle (Game Loop, Animationen).
 */
function clearAllIntervals() {
  intervalIds.forEach((id) => originalClearInterval(id));
  intervalIds = [];
}

/**
 * Shows the custom crosshair and hides the default cursor.
 */
function showCrosshair() {
  if (crosshair) crosshair.style.display = "block";
  if (canvas) canvas.style.cursor = "none";
}

/**
 * Hides the custom crosshair and shows the default cursor.
 */
function hideCrosshair() {
  if (crosshair) crosshair.style.display = "none";
  if (canvas) canvas.style.cursor = "default";
}

/**
 * Zeigt oder versteckt das Hilfemenü.
 */
function toggleHelp() {
  let help = document.getElementById("helpMenu");
  if (help.style.display === "flex") {
    help.style.display = "none";
  } else {
    help.style.display = "flex";
  }
}

/**
 * Zeigt das Optionsmenü.
 */
function showOptions() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("optionsMenu").style.display = "flex";
}

/**
 * Schließt das Optionsmenü.
 */
function closeOptions() {
  document.getElementById("optionsMenu").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
}

/**
 * Zeigt die Highscore-Liste an.
 */
function showHighscore() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("highscoreMenu").style.display = "flex";

  let list = getHighscores();
  let listHTML = '<ol style="padding-left: 20px; text-align: left;">';

  list.forEach((entry) => {
    listHTML += `<li>${entry.name}: ${entry.score}</li>`;
  });
  listHTML += "</ol>";

  document.getElementById("highscoreNameDisplay").style.display = "none";
  document.getElementById("highscoreValue").innerHTML = listHTML;
}

/**
 * Schließt die Highscore-Liste.
 */
function closeHighscore() {
  document.getElementById("highscoreMenu").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("highscoreNameDisplay").style.display = "block";
}

/**
 * Beendet das Spiel (schließt Tab).
 */
function exitGame() {
  window.close();
  alert("Das Spiel wird beendet. Bitte schließe den Tab.");
  location.reload();
}

/**
 * Ändert die globale Lautstärke.
 * @param {number} amount - Änderungswert (z.B. +0.1 oder -0.1).
 */
function changeVolume(amount) {
  globalVolume += amount;
  if (globalVolume > 1) globalVolume = 1;
  if (globalVolume < 0) globalVolume = 0;

  document.getElementById("volDisplay").innerText =
    Math.round(globalVolume * 100) + "%";

  let volOptions = document.getElementById("volDisplayOptions");
  if (volOptions) volOptions.innerText = Math.round(globalVolume * 100) + "%";

  menu_sound.volume = isMuted ? 0 : globalVolume;

  if (world && !isMuted) {
    world.updateVolume(globalVolume);
  }
}

/**
 * Schaltet den Ton an/aus (Mute).
 */
function toggleMute() {
  isMuted = !isMuted;
  document.getElementById("muteBtn").innerText = isMuted ? "🔇" : "🔊";
  menu_sound.volume = isMuted ? 0 : globalVolume;
  if (world) {
    world.updateVolume(isMuted ? 0 : globalVolume);
  }
}

/**
 * Prüft am Ende des Spiels, ob ein neuer Highscore erreicht wurde.
 * @param {number} score - Erreichter Punktestand.
 * @param {boolean} won - Ob das Spiel gewonnen wurde.
 */
function checkEndGame(score, won) {
  hideCrosshair();
  let highscores = getHighscores();

  let isNewHighscore =
    highscores.length < 5 || score > highscores[highscores.length - 1].score;

  if (isNewHighscore) {
    tempScore = score;
    let name = currentPlayerName && currentPlayerName.trim() !== "" ? currentPlayerName : "Anonym";
    highscores.push({ name: name, score: score });
    highscores.sort((a, b) => b.score - a.score);
    highscores = highscores.slice(0, 5);
    localStorage.setItem("highscoreList", JSON.stringify(highscores));
  }

  document.getElementById("btnMenu").style.display = "none";
  if (won) {
    document.getElementById("winScreen").style.display = "flex";
    setTimeout(() => {
      playOutroVideoAndRestart();
    }, 4000);
  } else {
    let scoreElement = document.getElementById("gameOverScore");
    if (scoreElement) {
      scoreElement.innerText = "Score: " + score;
    }
    document.getElementById("gameOverScreen").style.display = "flex";
  }
}

/**
 * Speichert den Highscore im LocalStorage.
 */
function saveHighscore() {
  // Wird nun automatisch in checkEndGame() erledigt.
}

/**
 * Hilfsfunktion: Lädt die Highscore-Liste sicher aus dem LocalStorage.
 */
function getHighscores() {
  let stored = localStorage.getItem("highscoreList");
  try {
    let parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

/**
 * Schaltet den Vollbildmodus um.
 */
function toggleFullscreen() {
  let container = document.getElementById("game-container");
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch((err) => {
      console.log(
        `Error attempting to enable full-screen mode: ${err.message}`,
      );
    });
  } else {
    document.exitFullscreen();
  }
}

window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight") {
    keyboard.RIGHT = true;
  }
  if (e.code === "ArrowLeft") {
    keyboard.LEFT = true;
  }
  if (e.code === "ArrowUp") {
    keyboard.UP = true;
  }
  if (e.code === "ArrowDown") {
    keyboard.DOWN = true;
  }
  if (e.code === "Space") {
    keyboard.SPACE = true;
  }
  if (e.code === "KeyD") {
    keyboard.D = true;
  }
  if (e.code === "KeyF") {
    keyboard.F = true;
  }
  if (e.code === "KeyB") {
    if (world && world.character) {
      if (world.character.isFlying) {
        world.character.toggleFlying();
        world.character.currentWeapon = "shotgun";
      } else if (world.coinBar.percentage > 0) {
        world.character.currentWeapon = "broom";
        world.character.toggleFlying();
      }
    }
  }
  if (e.code === "KeyU") {
    if (world && world.character) {
      world.character.currentWeapon = "uzi";
      if (world.character.isFlying) world.character.toggleFlying();
    }
  }
  if (e.code === "KeyS") {
    keyboard.S = true;
  }
  if (e.code === "KeyW") {
    if (world && world.character) {
      world.character.currentWeapon = "shotgun";
      if (world.character.isFlying) world.character.toggleFlying();
    }
  }

  if (e.code === "Escape" || e.code === "KeyP") {
    if (world) {
      if (document.getElementById("pauseMenu").style.display === "flex") {
        resumeGame();
      } else {
        pauseGame();
      }
    }
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowRight") {
    keyboard.RIGHT = false;
  }
  if (e.code === "ArrowLeft") {
    keyboard.LEFT = false;
  }
  if (e.code === "ArrowUp") {
    keyboard.UP = false;
  }
  if (e.code === "ArrowDown") {
    keyboard.DOWN = false;
  }
  if (e.code === "Space") {
    keyboard.SPACE = false;
  }
  if (e.code === "KeyD") {
    keyboard.D = false;
  }
  if (e.code === "KeyF") {
    keyboard.F = false;
  }
  if (e.code === "KeyS") {
    keyboard.S = false;
  }
});

window.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    keyboard.D = true;
  }
  if (e.button === 2) {
    keyboard.SPACE = true;
  }
});

window.addEventListener("mouseup", (e) => {
  if (e.button === 0) {
    keyboard.D = false;
  }
  if (e.button === 2) {
    keyboard.SPACE = false;
  }
});

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

window.addEventListener("wheel", (e) => {
  if (world && world.character) {
    if (world.character.isFlying) {
      e.preventDefault();
      world.character.triggerWheelAnimation(e.deltaY);
    } else if (world.character.currentWeapon === "uzi") {
      e.preventDefault();
      world.triggerUziWheelAttack(e.deltaY);
    }
  }
});

/**
 * Startet das Vorladen der wichtigsten Bilder, um Ruckler zu vermeiden.
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

    "img/2_character_pepe/6_shooting/uzi/wheel/01.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/02.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/03.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/04.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/05.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/06.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/07.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/08.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/09.png",
    "img/2_character_pepe/6_shooting/uzi/wheel/10.png",

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
