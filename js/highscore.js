/**
 * Prüft am Ende des Spiels, ob ein neuer Highscore erreicht wurde.
 */
function checkEndGame(score, won) {
  hideCrosshair();
  let highscores = getHighscores();

  let isNewHighscore = highscores.length < 5 || score > highscores[highscores.length - 1].score;

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
    setTimeout(() => playOutroVideoAndRestart(), 4000);
  } else {
    let scoreElement = document.getElementById("gameOverScore");
    if (scoreElement) scoreElement.innerText = "Score: " + score;
    document.getElementById("gameOverScreen").style.display = "flex";
  }
}

function saveHighscore() {} // Wird automatisch in checkEndGame() erledigt.

function getHighscores() {
  let stored = localStorage.getItem("highscoreList");
  try {
    let parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}