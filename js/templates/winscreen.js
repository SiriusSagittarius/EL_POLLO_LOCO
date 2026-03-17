function renderWinScreen() {
  return `
    <!-- Win Screen -->
    <div id="winScreen" style="display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); justify-content: center; align-items: center; flex-direction: column; z-index: 999;">
        <img src="img/You won, you lost/You Win A.png" alt="You Win" style="max-width: 80%; max-height: 50%; margin-bottom: 20px;">
        <h2 style="color: orange; font-family: sans-serif; font-size: 60px">YOU WIN!</h2>
    </div>
  `;
}
