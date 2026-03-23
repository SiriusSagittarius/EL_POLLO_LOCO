/**
 * Zeigt den Story-Bildschirm an.
 * @returns {void}
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
 * Spielt das Intro-Video ab.
 * @param {Function} onComplete - Callback-Funktion, die aufgerufen wird, wenn das Video beendet ist.
 * @returns {void}
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
 * Spielt das Outro-Video ab und zeigt anschließend den Finish-Bildschirm an.
 * @returns {void}
 */
function playOutroVideoAndShowFinish() {
  document.getElementById("winScreen").style.display = "none";
  playOutroVideo(() => showFinishScreen());
}

/**
 * Spielt das Outro-Video ab.
 * @param {Function} onComplete - Callback-Funktion, die aufgerufen wird, wenn das Video beendet ist.
 * @returns {void}
 */
function playOutroVideo(onComplete) {
  if (world && world.background_sound) world.background_sound.pause();
  createAndPlayVideo(
    "outroVideo",
    "video/win.mp4",
    "Video überspringen ⏭",
    2000,
    onComplete,
  );
}

/**
 * Erstellt ein Video-Element und spielt es ab.
 * @param {string} videoId - Die ID des Video-Elements.
 * @param {string} src - Der Dateipfad zum Video.
 * @param {string} skipText - Der Text für den Überspringen-Button.
 * @param {number} zIndex - Der z-Index des Videos.
 * @param {Function} onComplete - Callback-Funktion, die aufgerufen wird, wenn das Video beendet ist.
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

  if (typeof isMuted !== "undefined") {
    video.muted = isMuted;
  }
  if (typeof globalVolume !== "undefined") {
    video.volume = globalVolume;
  }

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
  video.play().catch((e) => finishVideo());
}

/**
 * Zeigt das Fadenkreuz an und versteckt den Mauszeiger.
 * @returns {void}
 */
function showCrosshair() {
  if (crosshair) crosshair.style.display = "block";
  if (canvas) canvas.style.cursor = "none";
}

/**
 * Versteckt das Fadenkreuz und zeigt den Mauszeiger an.
 * @returns {void}
 */
function hideCrosshair() {
  if (crosshair) crosshair.style.display = "none";
  if (canvas) canvas.style.cursor = "default";
}

/**
 * Zeigt den "Finish"-Bildschirm an.
 * @returns {void}
 */
function showFinishScreen() {
  let finishScreen = document.getElementById("finishScreen");
  if (finishScreen) {
    finishScreen.style.display = "flex";
  }
}

/**
 * Schaltet die Anzeige des Hilfemenüs um.
 * @returns {void}
 */
function toggleHelp() {
  let help = document.getElementById("helpMenu");
  help.style.display = help.style.display === "flex" ? "none" : "flex";
}

/**
 * Zeigt das Optionsmenü an.
 * @returns {void}
 */
function showOptions() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("optionsMenu").style.display = "flex";
  document.getElementById("optionsTitle").style.display = "block";
  document.getElementById("optionsTitle").innerText = "Einstellungen";
  document.getElementById("optionsMenuBtn").style.display = "none";
  document.getElementById("optionsCloseBtn").innerText = "Zurück";
  if (document.getElementById("optionsBgPepe"))
    document.getElementById("optionsBgPepe").style.display = "block";
  if (document.getElementById("optionsBgLaputa"))
    document.getElementById("optionsBgLaputa").style.display = "block";
}

/**
 * Schließt das Optionsmenü.
 * @returns {void}
 */
function closeOptions() {
  document.getElementById("optionsMenu").style.display = "none";
  if (typeof gamePaused !== "undefined" && gamePaused) {
    resumeGame();
  } else {
    document.getElementById("startScreen").style.display = "flex";
  }
}

/**
 * Beendet das Spiel und schließt den Tab (sofern möglich).
 * @returns {void}
 */
function exitGame() {
  window.close();
  alert("Das Spiel wird beendet. Bitte schließe den Tab.");
  location.reload();
}

/**
 * Schaltet zwischen Vollbild und Fenstermodus um.
 * @returns {void}
 */
function toggleFullscreen() {
  let container = document.getElementById("game-container");
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}
