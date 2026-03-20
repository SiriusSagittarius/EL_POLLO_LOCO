/**
 * Rendert das HTML für das Highscore-Menü.
 * @returns {string} Der HTML-String für das Highscore-Menü.
 */
function renderHighscoreMenu() {
  return `
    <!-- Highscore Overlay -->
    <div id="highscoreMenu" style="display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9); z-index: 1002; flex-direction: column; justify-content: center; align-items: center;">
        <h2 style="color: orange; font-family: sans-serif; font-size: 40px">HIGHSCORE</h2>
        <span id="highscoreNameDisplay" style="color: yellow; font-family: sans-serif; font-size: 30px;">Unbekannt</span>
        <span id="highscoreValue" style="color: white; font-family: sans-serif; font-size: 60px; margin: 20px;">0</span>
        <button onclick="closeHighscore()" class="menu-btn">Zurück</button>
    </div>
  `;
}
