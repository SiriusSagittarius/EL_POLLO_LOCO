function renderPauseButton() {
  return `
    <!-- Pause & Fullscreen Buttons -->
    <div id="btnMenu" style="position: absolute; bottom: 10px; right: 10px; z-index: 500; display: none; gap: 10px; align-items: center;">
        <div onclick="toggleHelp()" style="cursor: pointer; width: 50px; height: 50px; background: rgba(0, 0, 0, 0.5); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
            <span style="color: white; font-size: 24px; font-family: serif; font-weight: bold; font-style: italic;">i</span>
        </div>
        <div onclick="toggleFullscreen()" style="cursor: pointer; width: 50px; height: 50px; background: rgba(0, 0, 0, 0.5); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
            <span id="fullscreenIcon" style="color: white; font-size: 24px; display: flex; justify-content: center; align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
            </span>
        </div>
        <div onclick="pauseGame()" style="cursor: pointer; width: 50px; height: 50px; background: rgba(0, 0, 0, 0.5); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
        </div>
    </div>
  `;
}
