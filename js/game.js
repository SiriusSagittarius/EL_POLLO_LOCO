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
  S: false,
};

let menu_sound = new Audio("audio/menu.mp3");
let background_sound = new Audio("audio/hauptspiel.wav");
let mousePosition = { x: 0, y: 0 };

let globalVolume =
  localStorage.getItem("globalVolume") !== null
    ? parseFloat(localStorage.getItem("globalVolume"))
    : 0.5;
let isMuted = localStorage.getItem("isMuted") === "true";
let gamePaused = false;
let intervalIds = [];

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

  document
    .getElementById("game-container")
    .insertAdjacentHTML("beforeend", renderTouchControls());
  // Hide controls initially, they will be shown when the game starts.
  document.getElementById("touch-controls").style.display = "none";

  document.getElementById("overlay-container").innerHTML = renderAllScreens();

  // Update the toggle icon based on the saved setting.
  let touchEnabled =
    localStorage.getItem("touchControlsEnabled") !== null
      ? localStorage.getItem("touchControlsEnabled") === "true"
      : isMobile();
  updateTouchToggleIcon(touchEnabled);

  document
    .getElementById("overlay-container")
    .insertAdjacentHTML("beforeend", renderLoadingScreen());
  addImprintToOptions();
  startPreloading();

  // Responsive Überschrift zum Startscreen hinzufügen
  const startScreen = document.getElementById("startScreen");
  if (startScreen) {
    startScreen.insertAdjacentHTML(
      "afterbegin",
      '<h1 class="main-title">EL POLLO LOCO</h1>',
    );
  }

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

  bindTouchEvents();

  menu_sound.loop = true;
  menu_sound.volume = isMuted ? 0 : globalVolume;
  menu_sound.play().catch((error) => {
    console.log(
      "Autoplay wurde blockiert - Musik startet erst nach Interaktion",
    );
  });
}

/**
 * Versucht, den Vollbildmodus zu aktivieren.
 * Muss durch eine Benutzerinteraktion ausgelöst werden.
 */
function enterFullscreen() {
  let elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch((err) => {
      console.error(
        `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
      );
    });
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

/**
 * Schaltet die Sichtbarkeit der Touch-Steuerung um und speichert die Einstellung.
 */
function toggleTouchControls() {
  // 1. Bestimmt den NEUEN Zustand, indem der aktuelle aus dem Speicher umgedreht wird.
  let isCurrentlyEnabled =
    localStorage.getItem("touchControlsEnabled") !== null
      ? localStorage.getItem("touchControlsEnabled") === "true"
      : isMobile();
  let newIsEnabled = !isCurrentlyEnabled;

  // 2. Speichert den neuen Zustand.
  localStorage.setItem("touchControlsEnabled", newIsEnabled);

  // 3. Aktualisiert das Icon, um den neuen Zustand widerzuspiegeln.
  updateTouchToggleIcon(newIsEnabled);

  // 4. Wendet den neuen Zustand an (Sichtbarkeit nur ändern, wenn das Spiel gerade läuft).
  const controls = document.getElementById("touch-controls");
  const startScreen = document.getElementById("startScreen");
  const isGameActive = startScreen && startScreen.style.display === "none";

  if (controls && isGameActive) {
    controls.style.display = newIsEnabled ? "flex" : "none";
  }
}

/**
 * Aktualisiert das Aussehen des Toggle-Buttons direkt über Inline-Styles.
 * @param {boolean} isEnabled - Gibt an, ob die Steuerung aktiv ist.
 */
function updateTouchToggleIcon(isEnabled) {
  const icons = document.querySelectorAll(".touch-toggle-btn");
  icons.forEach((icon) => {
    icon.title = isEnabled
      ? "Touch-Steuerung ausblenden"
      : "Touch-Steuerung einblenden";

    // Direkte Anpassung ohne CSS-Klassen
    icon.style.opacity = isEnabled ? "1" : "0.5";
    icon.style.boxShadow = isEnabled ? "none" : "inset 0 0 0 3px red";
  });

  // Aktualisiert den neuen Text-Button im Einstellungsmenü
  const textBtn = document.getElementById("touchToggleTextBtn");
  if (textBtn) {
    textBtn.innerText = isEnabled
      ? "Touch-Steuerung: AN"
      : "Touch-Steuerung: AUS";
  }
}

/**
 * Startet das eigentliche Spiel (erstellt die World-Instanz).
 */
function startGame() {
  if (isMobile()) {
    enterFullscreen();
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
  document.getElementById("btnMenu").style.display = "none";
  hideCrosshair();

  unlockAudio(background_sound);
  playIntroVideo(() => {
    if (!world) {
      world = new World(canvas, keyboard);
      showCrosshair();
      world.updateVolume(isMuted ? 0 : globalVolume);

      // Show touch controls if they are enabled
      let touchEnabled =
        localStorage.getItem("touchControlsEnabled") !== null
          ? localStorage.getItem("touchControlsEnabled") === "true"
          : isMobile();
      if (touchEnabled) {
        document.getElementById("touch-controls").style.display = "flex";
      }
      document.getElementById("btnMenu").style.display = "flex";
      console.log("Spiel neu gestartet!");
      gamePaused = false;
    }
  });
}

/**
 * Prüft am Ende des Spiels und zeigt den entsprechenden Bildschirm.
 */
function checkEndGame(score, won) {
  hideCrosshair();
  document.getElementById("btnMenu").style.display = "none";
  if (won) {
    document.getElementById("winScreen").style.display = "flex";
    if (typeof playOutroVideoAndShowFinish === "function") {
      setTimeout(() => playOutroVideoAndShowFinish(), 3000);
    }
  } else {
    let scoreElement = document.getElementById("gameOverScore");
    if (scoreElement) scoreElement.innerText = "Score: " + score;
    document.getElementById("gameOverScreen").style.display = "flex";
  }
}

/**
 * Lädt die Seite neu.
 */
function finishGameAndReload() {
  location.reload();
}

/**
 * Pausiert das Spiel und zeigt das Pausen- oder Optionsmenü an.
 * @returns {void}
 */
function pauseGame() {
  if (world) {
    gamePaused = true;
    world.background_sound.pause();

    document.getElementById("optionsMenu").style.display = "flex";
    document.getElementById("optionsTitle").style.display = "none";
    document.getElementById("optionsMenuBtn").style.display = "block";
    document.getElementById("optionsCloseBtn").innerText = "Weiter spielen";
    document.getElementById("optionsBgPepe").style.display = "block";
    document.getElementById("optionsBgLaputa").style.display = "block";

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
    document.getElementById("optionsMenu").style.display = "none";
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
  document.getElementById("optionsMenu").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";

  // Hide touch controls when returning to the menu
  document.getElementById("touch-controls").style.display = "none";

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
 * Fügt den Impressum-Button dynamisch in das Optionsmenü ein.
 */
function addImprintToOptions() {
  const closeBtn = document.getElementById("optionsCloseBtn");
  if (closeBtn) {
    const imprintBtn = document.createElement("button");
    imprintBtn.className = "menu-btn";
    imprintBtn.innerText = "Impressum";
    imprintBtn.onclick = () => {
      window.location.href = "imprint.html";
    };

    // Fügt den Button vor dem Schließen-Button ein
    if (closeBtn.parentNode) {
      closeBtn.parentNode.insertBefore(imprintBtn, closeBtn);
    }
  }
}
