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
        <button id="btnThrow" class="touch-btn-secondary">🌶️</button>
        <button id="btnJump" class="touch-btn-primary">🔼</button>
        <button id="btnShoot" class="touch-btn-primary">🎯</button>
        <button id="btnCycleWeapon" class="touch-btn-secondary">🔫</button>
        <button id="btnSpecial" class="touch-btn-secondary">✨</button>
      </div>
    </div>
  `;
}
