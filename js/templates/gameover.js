function renderGameOverScreen() {
  return `
    <!-- Game Over Screen -->
    <div id="gameOverScreen" style="display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); justify-content: center; align-items: center; flex-direction: column; z-index: 999;">
        <h2 style="color: red; font-family: sans-serif; font-size: 60px">GAME OVER</h2>
        <span id="gameOverScore" style="color: white; font-family: sans-serif; font-size: 30px; margin-bottom: 20px;">Score: 0</span>
        <div style="display: flex; gap: 20px;">
            <button onclick="restartGame()" style="padding: 15px 30px; font-size: 24px; cursor: pointer; background-color: #FFAE00; border: none; border-radius: 10px; color: white;">Restart</button>
            <button onclick="backToMenu()" style="padding: 15px 30px; font-size: 24px; cursor: pointer; background-color: #555; border: none; border-radius: 10px; color: white;">Menu</button>
        </div>
    </div>
  `;
}
