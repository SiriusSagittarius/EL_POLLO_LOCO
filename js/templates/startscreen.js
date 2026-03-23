/**
 * Rendert das HTML für den Startbildschirm.
 * @returns {string} Der HTML-String für den Startbildschirm.
 */
function renderStartScreen() {
  return `
    <!-- Start Screen -->
    <div id="startScreen" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('img/5_background/layers/air.png') center/cover; display: flex; justify-content: center; align-items: center; flex-direction: column; z-index: 999; border-radius: 20px; overflow: hidden;">
        <img src="img/2_character_pepe/1_idle/idle/I-1.png" style="position: absolute; left: 20px; bottom: 20px; height: 350px;">
        <img src="img/5_background/laputa.png" style="position: absolute; right: 20px; bottom: 20px; height: 210px;">
        
        <button onclick="startGame()" class="menu-btn">Start Game</button>
        <button onclick="showOptions()" class="menu-btn">Optionen</button>
        <button onclick="window.location.href='imprint.html'" class="menu-btn">Impressum</button>
        <button onclick="exitGame()" class="menu-btn" style="background-color: #ff4444">Beenden</button>
    </div>
  `;
}
