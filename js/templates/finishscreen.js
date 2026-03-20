/**
 * Rendert das HTML für den "Finish"-Bildschirm nach dem Outro.
 * @returns {string} Der HTML-String für den "Finish"-Bildschirm.
 */
function renderFinishScreen() {
  return `
    <!-- Finish Screen -->
    <div id="finishScreen" style="display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9); z-index: 3000; flex-direction: column; justify-content: center; align-items: center;">
        <div style="font-size: 100px; margin-bottom: 40px;">❤️</div>
        <button onclick="finishGameAndReload()" class="menu-btn">Finish</button>
    </div>
  `;
}
