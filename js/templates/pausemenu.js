function renderPauseMenu() {
  return `
    <!-- Pause Menu Overlay -->
    <div id="pauseMenu" style="display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); z-index: 1000; flex-direction: column; justify-content: center; align-items: center;">
        <h2 style="color: white; font-family: sans-serif; font-size: 40px; margin-bottom: 20px;">PAUSE</h2>
        <button onclick="resumeGame()" class="menu-btn">Fortsetzen</button>
        
        <!-- Volume Controls -->
        <div style="margin: 20px; display: flex; align-items: center; gap: 10px">
            <button onclick="changeVolume(-0.1)" class="vol-btn">-</button>
            <span id="volDisplay" style="color: white; font-family: sans-serif; font-size: 20px; width: 50px; text-align: center;">50%</span>
            <button onclick="changeVolume(0.1)" class="vol-btn">+</button>
            <button onclick="toggleMute()" class="vol-btn" id="muteBtn">🔊</button>
        </div>

        <button onclick="backToMenu()" class="menu-btn" style="background-color: #ff4444">Beenden</button>
    </div>
  `;
}
