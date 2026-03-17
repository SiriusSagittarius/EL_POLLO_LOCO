function renderTouchControls() {
  return `
    <div id="touch-controls">
        <!-- Linke Seite: Bewegung -->
        <div class="touch-left">
            <button id="btnLeft">⬅️</button>
            <button id="btnRight">➡️</button>
        </div>

        <!-- Rechte Seite Mitte: Waffenwechsel -->
        <div class="touch-weapons">
            <button id="btnUzi" style="font-size: 14px; font-weight: bold;">UZI</button>
            <button id="btnShotgun" style="font-size: 11px; font-weight: bold;">SHOT</button>
            <button id="btnBroom">🧹</button>
        </div>

        <!-- Rechte Seite unten: Aktionen -->
        <div class="touch-right">
            <button id="btnThrow">🌶️</button>
            <button id="btnSpecial">✨</button>
            <button id="btnShoot">🎯</button>
            <button id="btnJump">⬆️</button>
        </div>
    </div>
  `;
}