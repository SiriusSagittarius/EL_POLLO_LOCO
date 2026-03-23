/**
 * Rendert die HTML-Elemente für die Touch-Steuerung auf mobilen Geräten.
 * @returns {string} Der HTML-String für die Touch-Steuerung.
 */
function renderTouchControls() {
  return `
    <div id="touch-controls">
      <!-- Linke Seite: Bewegung -->
      <div class="touch-left">
        <button id="btnLeft">◀</button>
        <button id="btnRight">▶</button>
      </div>

      <!-- Rechte Seite: Aktionen -->
      <div class="touch-right">
        <button id="btnThrow">🌶️</button>
        <button id="btnShoot">🎯</button>
        <button id="btnJump">🔼</button>
      </div>
    </div>
  `;
}
