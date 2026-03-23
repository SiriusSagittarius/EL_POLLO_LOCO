/**
 * Rendert das HTML für das Hilfe-Menü (Steuerungsinfos).
 * @returns {string} Der HTML-String für das Hilfe-Menü.
 */
function renderHelpMenu() {
  return `
    <!-- Help Overlay -->
    <div id="helpMenu" onclick="toggleHelp()" style="display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 1005; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; text-align: center; padding: 20px; box-sizing: border-box;">
      <div style="background-color: rgba(60, 60, 60, 0.95); padding: 30px; border-radius: 20px; border: 2px solid white; max-width: 700px; max-height: 95%; overflow-y: auto; box-shadow: 0 0 20px black; display: flex; flex-direction: column; align-items: center;">
        <h2 style="color: orange; font-family: sans-serif; font-size: 32px; margin-top: 0; margin-bottom: 10px;">INFO</h2>
        <div style="color: white; font-family: sans-serif; font-size: 18px; line-height: 1.8; text-align: left; display: inline-block;">
            <div>⬅️ ➡️ : Laufen</div>
            <div>SPACE / Rechtsklick : Springen</div>
            <div>D / Linksklick : Schießen</div>
            <div>S : Salsa-Flaschen werfen</div>
        </div>
        <span style="color: lightgray; margin-top: 20px; font-family: sans-serif; font-size: 14px;">(Klicke um zu schließen)</span>
      </div>
    </div>
  `;
}
