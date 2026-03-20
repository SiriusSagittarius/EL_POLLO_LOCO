/**
 * Rendert das HTML für das Einstellungsmenü.
 * @returns {string} Der HTML-String für das Einstellungsmenü.
 */
function renderOptionsMenu() {
  return `
    <!-- Options Overlay -->
    <div id="optionsMenu" style="display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: black; z-index: 1002; flex-direction: column; justify-content: center; align-items: center;">
        <img src="img/2_character_pepe/1_idle/idle/I-1.png" style="position: absolute; left: 20px; bottom: 20px; height: 350px;">
        <img src="img/5_background/laputa.png" style="position: absolute; right: 20px; bottom: 20px; height: 210px;">

        <h2 style="color: white; font-family: sans-serif">Einstellungen</h2>
        
        <button onclick="toggleFullscreen()" class="menu-btn">Vollbild an / aus</button>
        <button onclick="toggleHelp()" class="menu-btn">Info / Steuerung</button>

        <div style="margin: 20px; display: flex; align-items: center; gap: 10px">
            <span style="color: white; font-family: sans-serif">Lautstärke:</span>
            <button onclick="changeVolume(-0.1)" class="vol-btn">-</button>
            <span id="volDisplayOptions" style="color: white; font-family: sans-serif; width: 50px; text-align: center;">50%</span>
            <button onclick="changeVolume(0.1)" class="vol-btn">+</button>
        </div>
        <button onclick="closeOptions()" class="menu-btn">Zurück</button>
    </div>
  `;
}
