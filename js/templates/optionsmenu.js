/**
 * Rendert das HTML für das Einstellungsmenü.
 * @returns {string} Der HTML-String für das Einstellungsmenü.
 */
function renderOptionsMenu() {
  return `
    <!-- Options Overlay -->
    <div id="optionsMenu" style="display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9); z-index: 1002; flex-direction: column; justify-content: center; align-items: center;">
        <img id="optionsBgPepe" src="img/2_character_pepe/1_idle/idle/I-1.png" style="position: absolute; left: 20px; bottom: 20px; height: 350px; pointer-events: none;">
        <img id="optionsBgLaputa" src="img/5_background/laputa.png" style="position: absolute; right: 20px; bottom: 20px; height: 210px; pointer-events: none;">

        <h2 id="optionsTitle" style="color: white; font-family: sans-serif; font-size: clamp(24px, 6vh, 40px); margin-bottom: clamp(5px, 2vh, 20px); margin-top: 0;">Einstellungen</h2>
        
        <button onclick="toggleFullscreen()" class="menu-btn">Vollbild an / aus</button>
        <button onclick="toggleHelp()" class="menu-btn">Info / Steuerung</button>
        <button id="touchToggleTextBtn" onclick="toggleTouchControls()" class="menu-btn">Touch-Steuerung: AN</button>
        <button onclick="window.open('docs/index.html', '_blank')" class="menu-btn">Dokumentation</button>

        <div style="margin: clamp(5px, 2vh, 20px); display: flex; align-items: center; gap: 10px">
            <span style="color: white; font-family: sans-serif">Lautstärke:</span>
            <button onclick="changeVolume(-0.1)" class="vol-btn">-</button>
            <span id="volDisplayOptions" style="color: white; font-family: sans-serif; width: 50px; text-align: center;">50%</span>
            <button onclick="changeVolume(0.1)" class="vol-btn">+</button>
            <button onclick="toggleMute()" class="vol-btn" id="muteBtn">🔊</button>
        </div>
        <button onclick="closeOptions()" id="optionsCloseBtn" class="menu-btn" style="background-color: #4CAF50;">Zurück</button>
        <button onclick="backToMenu()" id="optionsMenuBtn" class="menu-btn" style="display: none; background-color: #ff4444;">Hauptmenü</button>
    </div>
  `;
}
