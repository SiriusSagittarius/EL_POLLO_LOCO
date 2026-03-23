/**
 * Rendert alle UI-Bildschirm-Templates zu einem einzigen HTML-String.
 * @returns {string} Der zusammengefügte HTML-String aller Bildschirme.
 */
function renderAllScreens() {
  return (
    (typeof renderStartScreen === "function" ? renderStartScreen() : "") +
    (typeof renderGameOverScreen === "function" ? renderGameOverScreen() : "") +
    (typeof renderFinishScreen === "function" ? renderFinishScreen() : "") +
    (typeof renderWinScreen === "function" ? renderWinScreen() : "") +
    (typeof renderPauseButton === "function" ? renderPauseButton() : "") +
    (typeof renderHelpMenu === "function" ? renderHelpMenu() : "") +
    (typeof renderOptionsMenu === "function" ? renderOptionsMenu() : "")
  );
}

/**
 * Rendert das HTML für den Ladebildschirm.
 * @returns {string} Der HTML-String für den Ladebildschirm.
 */
function renderLoadingScreen() {
  return `
    <div id="loadingScreen" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: black; z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1 style="color: white; font-family: sans-serif;">Laden...</h1>
        <div style="width: 300px; height: 20px; border: 2px solid white; border-radius: 10px; margin-top: 20px; overflow: hidden;">
            <div id="loadingBar" style="width: 0%; height: 100%; background-color: orange;"></div>
        </div>
        <span id="loadingPercent" style="color: white; margin-top: 10px; font-family: sans-serif;">0%</span>
    </div>
  `;
}
