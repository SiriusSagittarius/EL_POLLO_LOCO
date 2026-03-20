/**
 * Rendert das HTML für den Startbildschirm.
 * @returns {string} Der HTML-String für den Startbildschirm.
 */
function renderStartScreen() {
  return `
    <!-- Start Screen -->
    <div id="startScreen" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('img/5_background/layers/2_berge/1.png') center/cover; display: flex; justify-content: center; align-items: center; flex-direction: column; z-index: 999; border-radius: 20px; overflow: hidden;">
        <!-- Docs Button -->
        <a href="docs/index.html" target="_blank" title="JSDoc Dokumentation" style="position: absolute; top: 20px; left: 20px; cursor: pointer; width: 50px; height: 50px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; justify-content: center; align-items: center; text-decoration: none;">
            <span style="color: white; font-size: 24px;">📖</span>
        </a>

        <!-- Settings Button -->
        <div onclick="showOptions()" title="Einstellungen" style="position: absolute; top: 20px; right: 20px; cursor: pointer; width: 50px; height: 50px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
        </div>

        <img src="img/2_character_pepe/1_idle/idle/I-1.png" style="position: absolute; left: 20px; bottom: 20px; height: 350px;">
        <img src="img/5_background/laputa.png" style="position: absolute; right: 20px; bottom: 20px; height: 210px;">
        <h2 style="color: white; font-family: sans-serif; font-size: 40px; text-align: center;">El Pollo Loco</h2>
        <input type="text" id="startNameInput" placeholder="Dein Name" style="font-size: 20px; padding: 10px; margin: 20px; text-align: center;" maxlength="15">
        <button onclick="startGame()" class="menu-btn">Start Game</button>
        <button onclick="showHighscore()" class="menu-btn">Highscore</button>
        <button onclick="exitGame()" class="menu-btn" style="background-color: #ff4444">Beenden</button>

        <div style="position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); background-color: rgba(0,0,0,0.6); color: white; padding: 15px; border-radius: 10px; font-family: sans-serif; text-align: center; max-width: 90%; font-size: 14px; border: 1px solid rgba(255,255,255,0.3);">
            <b>Tipp:</b> Durch die magischen Uzis verwandelt sich Pepe beim Schießen in "Pepistol", den Revolverhelden.
            Deswegen sieht er anders aus und vollführt wilde Aktionen, wenn man das Mausrad bewegt!
        </div>

        <a href="imprint.html" class="imprint-link">Imprint & Privacy Policy</a>
    </div>
  `;
}
