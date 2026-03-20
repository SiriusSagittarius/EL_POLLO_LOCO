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

function playIntroVideo(onComplete) {
  createAndPlayVideo("introVideo", "video/intro.mp4", "Intro überspringen ⏭", 100, onComplete);
}

function playOutroVideoAndRestart() {
  document.getElementById("winScreen").style.display = "none";
  playOutroVideo(() => backToMenu());
}

function playOutroVideo(onComplete) {
  if (world && world.background_sound) world.background_sound.pause();
  createAndPlayVideo("outroVideo", "video/win.mp4", "Video überspringen ⏭", 2000, onComplete);
}

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
  video.play().catch((e) => finishVideo());
}

function showCrosshair() {
  if (crosshair) crosshair.style.display = "block";
  if (canvas) canvas.style.cursor = "none";
}

function hideCrosshair() {
  if (crosshair) crosshair.style.display = "none";
  if (canvas) canvas.style.cursor = "default";
}

function toggleHelp() {
  let help = document.getElementById("helpMenu");
  help.style.display = help.style.display === "flex" ? "none" : "flex";
}

function showOptions() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("optionsMenu").style.display = "flex";
}

function closeOptions() {
  document.getElementById("optionsMenu").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
}

function closeHighscore() {
  document.getElementById("highscoreMenu").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("highscoreNameDisplay").style.display = "block";
}

function exitGame() {
  window.close();
  alert("Das Spiel wird beendet. Bitte schließe den Tab.");
  location.reload();
}

function toggleFullscreen() {
  let container = document.getElementById("game-container");
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

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