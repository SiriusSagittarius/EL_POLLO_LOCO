function renderNewHighscoreMenu() {
  return `
    <!-- New Highscore Input Overlay -->
    <div id="newHighscoreMenu" style="display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9); z-index: 1003; flex-direction: column; justify-content: center; align-items: center;">
        <h2 style="color: orange; font-family: sans-serif;">NEUER REKORD!</h2>
        <input type="text" id="playerName" placeholder="Dein Name" style="font-size: 20px; padding: 10px; margin: 20px; text-align: center;" maxlength="10">
        <button onclick="saveHighscore()" class="menu-btn">Speichern</button>
    </div>
  `;
}
