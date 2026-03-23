/**
 * Entsperrt ein Audio-Objekt durch stummes Anspielen beim Klick (wichtig für Safari/Mobile).
 * @param {HTMLAudioElement} audio - Das Audio-Objekt, das entsperrt werden soll.
 * @returns {void}
 */
function unlockAudio(audio) {
  audio.volume = 0;
  let playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
      })
      .catch(() => {});
  }
}

/**
 * Ändert die globale Lautstärke.
 * @param {number} amount - Der Betrag, um den die Lautstärke geändert werden soll (positiv oder negativ).
 * @returns {void}
 */
function changeVolume(amount) {
  globalVolume += amount;
  if (globalVolume > 1) globalVolume = 1;
  if (globalVolume < 0) globalVolume = 0;

  localStorage.setItem("globalVolume", globalVolume);
  updateVolumeUI();

  menu_sound.volume = isMuted ? 0 : globalVolume;
  if (world && !isMuted) world.updateVolume(globalVolume);
}

/**
 * Schaltet das Audio im Spiel stumm oder hebt die Stummschaltung auf.
 * @returns {void}
 */
function toggleMute() {
  isMuted = !isMuted;
  document.getElementById("muteBtn").innerText = isMuted ? "🔇" : "🔊";
  localStorage.setItem("isMuted", isMuted);
  updateVolumeUI();
  menu_sound.volume = isMuted ? 0 : globalVolume;
  if (world) world.updateVolume(isMuted ? 0 : globalVolume);
}

/**
 * Aktualisiert die Anzeige der Lautstärke in der Benutzeroberfläche.
 * @returns {void}
 */
function updateVolumeUI() {
  let volText = Math.round(globalVolume * 100) + "%";
  let volDisplay = document.getElementById("volDisplay");
  if (volDisplay) volDisplay.innerText = volText;
  let volOptions = document.getElementById("volDisplayOptions");
  if (volOptions) volOptions.innerText = volText;
  let muteBtn = document.getElementById("muteBtn");
  if (muteBtn) muteBtn.innerText = isMuted ? "🔇" : "🔊";
}
