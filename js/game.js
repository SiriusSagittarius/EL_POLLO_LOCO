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

let globalVolume =
  localStorage.getItem("globalVolume") !== null
    ? parseFloat(localStorage.getItem("globalVolume"))
    : 0.5;
let isMuted = localStorage.getItem("isMuted") === "true";
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

  updateVolumeUI();

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
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;

    mousePosition.x = (e.clientX - rect.left) * scaleX;
    mousePosition.y = (e.clientY - rect.top) * scaleY;

    if (crosshair && crosshair.style.display === "block") {
      let displayX = e.clientX - rect.left;
      let displayY = e.clientY - rect.top;
      crosshair.style.left = displayX - crosshair.offsetWidth / 2 + "px";
      crosshair.style.top = displayY - crosshair.offsetHeight / 2 + "px";
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
 * Startet das eigentliche Spiel (erstellt die World-Instanz).
 */
function startGame() {
  let inputName = document.getElementById("startNameInput").value;
  if (inputName && inputName.trim() !== "") {
    currentPlayerName = inputName.trim();
  }

  menu_sound.pause();
  document.getElementById("startScreen").style.display = "none";
  startGameSequence();
}

/**
 * Startet das Spiel neu, indem die Seite komplett neu geladen wird.
 * Wird vom "Restart"-Button im Game-Over-Screen aufgerufen.
 */
function restartGame() {
  location.reload();
}

/**
 * Initialisiert die Spiellogik, spielt das Intro und startet die World.
 * Wird beim ersten Spielstart vom Menü aus aufgerufen.
 */
function startGameSequence() {
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

      setTimeout(() => {
        if (world && world.isActive) {
          world.showPepistolTip = true;
          setTimeout(() => {
            if (world) {
              world.showPepistolTip = false;
            }
          }, 8000);
        }
      }, 2000);
    }
  });
}

/**
 * Löscht den Speicher außer dem Highscore und lädt die Seite neu.
 */
function finishGameAndReload() {
  const highscore = localStorage.getItem("highscoreList");
  localStorage.clear();
  if (highscore) {
    localStorage.setItem("highscoreList", highscore);
  }
  location.reload();
}

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
