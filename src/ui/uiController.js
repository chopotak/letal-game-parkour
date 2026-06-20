export class UIController {
  constructor({ messageEl, deathsEl, timerEl, restartBtn, winActionsEl, gamePanelEl, screenEl, mainMenuEl, pauseMenuEl, editorMenuEl }) {
    this.messageEl = messageEl;
    this.deathsEl = deathsEl;
    this.timerEl = timerEl;
    this.restartBtn = restartBtn;
    this.winActionsEl = winActionsEl;
    this.gamePanelEl = gamePanelEl;
    this.screenEl = screenEl;
    this.mainMenuEl = mainMenuEl;
    this.pauseMenuEl = pauseMenuEl;
    this.editorMenuEl = editorMenuEl;
    this.lastDeaths = null;
    this.lastTimer = "";
    this.lastMessage = "";
  }

  setDeaths(count) {
    if (this.lastDeaths === count) return;
    this.lastDeaths = count;
    this.deathsEl.textContent = `Смерти: ${count}`;
  }

  setTimer(startedAt, now) {
    const seconds = Math.floor((now - startedAt) / 1000);
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    const value = `${mm}:${ss}`;
    if (this.lastTimer === value) return;
    this.lastTimer = value;
    this.timerEl.textContent = value;
  }

  showMessage(text) {
    if (this.lastMessage === text) return;
    this.lastMessage = text;
    this.messageEl.textContent = text;
    this.messageEl.animate(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(-5px)" },
        { transform: "translateY(0)" },
      ],
      { duration: 220, easing: "steps(2, end)" },
    );
  }

  shake() {
    this.screenEl.classList.remove("shake");
    void this.screenEl.offsetWidth;
    this.screenEl.classList.add("shake");
  }

  setRestartVisible(visible) {
    if (this.winActionsEl) this.winActionsEl.hidden = !visible;
    else this.restartBtn.hidden = !visible;
  }

  setWinState(visible) {
    this.gamePanelEl.classList.toggle("is-won", visible);
  }

  showMainMenu(visible) {
    this.mainMenuEl.hidden = !visible;
    this.gamePanelEl.classList.toggle("is-menu", visible);
  }

  showPauseMenu(visible) {
    this.pauseMenuEl.hidden = !visible;
  }

  showEditorMenu(visible) {
    this.editorMenuEl.hidden = !visible;
    this.gamePanelEl.classList.toggle("is-editor", visible);
  }

  setSelectedLevel(levelId) {
    document.querySelectorAll("[data-level-id]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.levelId === levelId);
    });
  }

  setSelectedPhysicsMode(mode) {
    document.querySelectorAll("[data-physics-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.physicsMode === mode);
    });
  }
}
