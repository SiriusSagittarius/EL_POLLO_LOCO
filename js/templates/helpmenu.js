function renderHelpMenu() {
  return `
    <!-- Help Overlay -->
    <div id="helpMenu" onclick="toggleHelp()" style="display: none; position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 1005; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; text-align: center; padding: 20px; box-sizing: border-box;">
      <div style="background-color: rgba(60, 60, 60, 0.95); padding: 30px; border-radius: 20px; border: 2px solid white; max-width: 700px; max-height: 95%; overflow-y: auto; box-shadow: 0 0 20px black; display: flex; flex-direction: column; align-items: center;">
        <h2 style="color: orange; font-family: sans-serif; font-size: 32px; margin-top: 0; margin-bottom: 10px;">INFO</h2>
        <div style="color: white; font-family: sans-serif; font-size: 18px; line-height: 1.8; text-align: left; display: inline-block;">
            <div>⬅️ ➡️ : Laufen</div>
            <div>SPACE / Rechtsklick : Springen / Fliegen</div>
            <div>D / Linksklick : Schießen</div>
            <div>S : Salsa-Flaschen werfen</div>
            <div>Mausrad : Spezialangriffe (Uzi / Besen)</div>
            <br>
            <div style="color: orange;"><b>Fliegen & Treibstoff:</b></div>
            <div>Sammle Münzen, um den Treibstoff für den Besen aufzufüllen!</div>
            <br>
            <div style="color: orange;"><b>Waffenauswahl:</b></div>
            <div>U : Uzi (Schnellfeuer)</div>
            <div>W : Shotgun (Streuschuss)</div>
            <div>B : Besen (Flugmodus)</div>
        </div>
        <span style="color: lightgray; margin-top: 20px; font-family: sans-serif; font-size: 14px;">(Klicke um zu schließen)</span>
      </div>
    </div>
  `;
}
