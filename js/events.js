/**
 * Überprüft, ob das aktuelle Gerät ein mobiles Gerät ist.
 * @returns {boolean} True, wenn ein mobiles Gerät erkannt wird.
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/**
 * Bindet die Touch-Events an die Buttons der mobilen Steuerung.
 * @returns {void}
 */
function bindTouchEvents() {
  const bindBtn = (id, key) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    const press = (e) => {
      e.preventDefault();
      keyboard[key] = true;
    };

    const release = (e) => {
      e.preventDefault();
      keyboard[key] = false;
    };

    btn.addEventListener("touchstart", press, { passive: false });
    btn.addEventListener("mousedown", press);

    btn.addEventListener("touchend", release, { passive: false });
    btn.addEventListener("mouseup", release);
    btn.addEventListener("mouseleave", release);
  };

  bindBtn("btnLeft", "LEFT");
  bindBtn("btnRight", "RIGHT");
  bindBtn("btnJump", "SPACE");
  bindBtn("btnShoot", "D");
  bindBtn("btnThrow", "S");
}

window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight") keyboard.RIGHT = true;
  if (e.code === "ArrowLeft") keyboard.LEFT = true;
  if (e.code === "ArrowUp") keyboard.UP = true;
  if (e.code === "ArrowDown") keyboard.DOWN = true;
  if (e.code === "Space") keyboard.SPACE = true;
  if (e.code === "KeyD") keyboard.D = true;
  if (e.code === "KeyF") keyboard.F = true;
  if (e.code === "KeyS") keyboard.S = true;

  if (e.code === "Escape" || e.code === "KeyP") {
    if (world) {
      if (document.getElementById("optionsMenu").style.display === "flex") {
        resumeGame();
      } else {
        pauseGame();
      }
    }
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowRight") keyboard.RIGHT = false;
  if (e.code === "ArrowLeft") keyboard.LEFT = false;
  if (e.code === "ArrowUp") keyboard.UP = false;
  if (e.code === "ArrowDown") keyboard.DOWN = false;
  if (e.code === "Space") keyboard.SPACE = false;
  if (e.code === "KeyD") keyboard.D = false;
  if (e.code === "KeyF") keyboard.F = false;
  if (e.code === "KeyS") keyboard.S = false;
});

window.addEventListener("mousedown", (e) => {
  if (e.button === 0) keyboard.D = true;
  if (e.button === 2) keyboard.SPACE = true;
});

window.addEventListener("mouseup", (e) => {
  if (e.button === 0) keyboard.D = false;
  if (e.button === 2) keyboard.SPACE = false;
});

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
