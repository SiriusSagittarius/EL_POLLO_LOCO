/**
 * Entsperrt ein Audio-Objekt durch stummes Anspielen beim Klick (wichtig für Safari/Mobile).
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
 */
function changeVolume(amount) {
  globalVolume += amount;
  if (globalVolume > 1) globalVolume = 1;
  if (globalVolume < 0) globalVolume = 0;

  document.getElementById("volDisplay").innerText = Math.round(globalVolume * 100) + "%";
  localStorage.setItem("globalVolume", globalVolume);
  updateVolumeUI();

  let volOptions = document.getElementById("volDisplayOptions");
  if (volOptions) volOptions.innerText = Math.round(globalVolume * 100) + "%";

  menu_sound.volume = isMuted ? 0 : globalVolume;
  if (world && !isMuted) world.updateVolume(globalVolume);
}

function toggleMute() {
  isMuted = !isMuted;
  document.getElementById("muteBtn").innerText = isMuted ? "🔇" : "🔊";
  localStorage.setItem("isMuted", isMuted);
  updateVolumeUI();
  menu_sound.volume = isMuted ? 0 : globalVolume;
  if (world) world.updateVolume(isMuted ? 0 : globalVolume);
}

function updateVolumeUI() {
  let volText = Math.round(globalVolume * 100) + "%";
  let volDisplay = document.getElementById("volDisplay");
  if (volDisplay) volDisplay.innerText = volText;
  let volOptions = document.getElementById("volDisplayOptions");
  if (volOptions) volOptions.innerText = volText;
  let muteBtn = document.getElementById("muteBtn");
  if (muteBtn) muteBtn.innerText = isMuted ? "🔇" : "🔊";
}