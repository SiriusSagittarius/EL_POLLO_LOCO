function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

function bindTouchEvents() {
  const bindBtn = (id, key) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        keyboard[key] = true;
      },
      { passive: false },
    );
    btn.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        keyboard[key] = false;
      },
      { passive: false },
    );
  };

  bindBtn("btnLeft", "LEFT");
  bindBtn("btnRight", "RIGHT");
  bindBtn("btnJump", "SPACE");
  bindBtn("btnShoot", "D");
  bindBtn("btnThrow", "S");

  const bindAction = (id, action) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        action();
      },
      { passive: false },
    );
  };

  bindAction("btnCycleWeapon", () => {
    if (world && world.character) {
      world.character.cycleWeapon();
    }
  });
  bindAction("btnSpecial", () => {
    if (world && world.character) {
      if (world.character.isFlying) {
        
        world.character.triggerWheelAnimation(-1);
      } else if (world.character.currentWeapon === "uzi") {
        world.combatManager.triggerUziWheelAttack(-1);
      }
    }
  });
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

  if (e.code === "KeyB") {
    if (world && world.character) {
      if (world.character.isFlying) {
        world.character.toggleFlying();
        world.character.currentWeapon = "shotgun";
      } else if (world.coinBar.percentage > 0) {
        world.character.currentWeapon = "broom";
        world.character.toggleFlying();
      }
    }
  }
  if (e.code === "KeyU") {
    if (world && world.character) {
      world.character.currentWeapon = "uzi";
      if (world.character.isFlying) world.character.toggleFlying();
    }
  }
  if (e.code === "KeyW") {
    if (world && world.character) {
      world.character.currentWeapon = "shotgun";
      if (world.character.isFlying) world.character.toggleFlying();
    }
  }
  if (e.code === "Escape" || e.code === "KeyP") {
    if (world) {
      if (document.getElementById("pauseMenu").style.display === "flex") {
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

window.addEventListener(
  "wheel",
  (e) => {
    if (world && world.character) {
      if (world.character.isFlying) {
        e.preventDefault();
        world.character.triggerWheelAnimation(e.deltaY);
      } else if (world.character.currentWeapon === "uzi") {
        e.preventDefault();
        world.combatManager.triggerUziWheelAttack(e.deltaY);
      }
    }
  },
  { passive: false },
);
