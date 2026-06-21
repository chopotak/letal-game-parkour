import { GameConfig } from "./config/gameConfig.js";
import { Game } from "./core/game.js";
import { LevelEditor } from "./editor/levelEditor.js";
import { InputController } from "./core/inputController.js";
import { LevelOne } from "./levels/level-one.js";
import { LevelTwo } from "./levels/level-two.js";
import { Level3 } from "./levels/level-three.js";
import { Level4 } from "./levels/level-four.js";
import { Level5 } from "./levels/level-five.js";
import { CustomLevelLast } from "./levels/level-last.js";
import { LayrinthImpossibleFinal } from "./levels/custom/labyrinth-impossible-final.js";
import { GameRenderer } from "./rendering/gameRenderer.js";
import { UIController } from "./ui/uiController.js";

const EXTRA_BUILT_IN_LEVELS = [
  { id: "built-in-labyrinth-impossible-final", title: LayrinthImpossibleFinal.name ?? "Impossible Labyrinth", badge: "Level 7", source: "custom/labyrinth-impossible-final.js", kind: "built-in", collection: "built-in", fileName: "labyrinth-impossible-final", exportName: "LayrinthImpossibleFinal", data: LayrinthImpossibleFinal },
];

const FALLBACK_BUILT_IN_LEVELS = [
  { id: "built-in-level-one", title: LevelOne.name ?? "Level 1", badge: "Level 1", source: "level-one.js", kind: "built-in", collection: "built-in", fileName: "level-one", exportName: "LevelOne", data: LevelOne },
  { id: "built-in-level-two", title: LevelTwo.name ?? "Level 2", badge: "Level 2", source: "level-two.js", kind: "built-in", collection: "built-in", fileName: "level-two", exportName: "LevelTwo", data: LevelTwo },
  { id: "built-in-level-three", title: Level3.name ?? "Level 3", badge: "Level 3", source: "level-three.js", kind: "built-in", collection: "built-in", fileName: "level-three", exportName: "Level3", data: Level3 },
  { id: "built-in-level-four", title: Level4.name ?? "Level 4", badge: "Level 4", source: "level-four.js", kind: "built-in", collection: "built-in", fileName: "level-four", exportName: "Level4", data: Level4 },
  { id: "built-in-level-five", title: Level5.name ?? "Level 5", badge: "Level 5", source: "level-five.js", kind: "built-in", collection: "built-in", fileName: "level-five", exportName: "Level5", data: Level5 },
  { id: "built-in-level-last", title: CustomLevelLast.name ?? "Final", badge: "Финал", source: "level-last.js", kind: "built-in", collection: "built-in", fileName: "level-last", exportName: "CustomLevelLast", data: CustomLevelLast },
  ...EXTRA_BUILT_IN_LEVELS,
];

const canvas = document.getElementById("game");
canvas.width = GameConfig.canvas.width;
canvas.height = GameConfig.canvas.height;

const input = new InputController();
const renderer = new GameRenderer(canvas, GameConfig);
const editorMenuEl = document.getElementById("editorMenu");
const editorFullscreenButton = document.getElementById("editorFullscreenButton");
const editorLoadInput = document.getElementById("editorLoadInput");
const editorLoadDialog = document.getElementById("editorLoadDialog");
const editorDropZone = document.getElementById("editorDropZone");
const mainMenuEl = document.getElementById("mainMenu");
const gameFullscreenButton = document.getElementById("gameFullscreenButton");
const gamePanelEl = document.getElementById("gamePanel");
const screenEl = document.getElementById("screen");
const DEBUG_UI = true;
const logUi = (...args) => {
  if (DEBUG_UI) console.info("[ui]", ...args);
};
const ui = new UIController({
  messageEl: document.getElementById("message"),
  deathsEl: document.getElementById("deathCount"),
  timerEl: document.getElementById("timer"),
  restartBtn: document.getElementById("restart"),
  winActionsEl: document.getElementById("winActions"),
  gamePanelEl,
  screenEl,
  mainMenuEl,
  pauseMenuEl: document.getElementById("pauseMenu"),
  editorMenuEl,
  topTitleEl: document.getElementById("topTitle"),
  topKickerEl: document.getElementById("topKicker"),
});

const editor = new LevelEditor({
  canvas: document.getElementById("editorCanvas"),
  paletteEl: document.getElementById("editorPalette"),
  settingsEl: document.getElementById("editorSettings"),
  modeButtons: document.querySelectorAll("[data-editor-mode]"),
  undoButton: document.getElementById("editorUndoButton"),
  redoButton: document.getElementById("editorRedoButton"),
  statusEl: document.getElementById("editorStatus"),
  widthInput: document.getElementById("editorWidthInput"),
  heightInput: document.getElementById("editorHeightInput"),
  resizeButton: document.getElementById("editorResizeButton"),
});

const levelSelectEl = document.getElementById("levelSelect");
const customLevelStatusEl = document.getElementById("customLevelStatus");
const menuHomeEl = document.getElementById("menuHome");
const menuLevelsEl = document.getElementById("menuLevels");
const levelListTitleEl = document.getElementById("levelListTitle");
const levelListKickerEl = document.getElementById("levelListKicker");
const levelListPlayButton = document.getElementById("levelListPlayButton");
const PROGRESS_KEY = "lethality-level-progress";
const FULLSCREEN_USED_KEY = "lethality-fullscreen-used";
const FULLSCREEN_NAG_KEY = "lethality-fullscreen-nag-dismissed";
const fullscreenNagDialog = document.getElementById("fullscreenNagDialog");
const fullscreenNagCloseButton = document.getElementById("fullscreenNagCloseButton");
const fullscreenNagFullscreenButton = document.getElementById("fullscreenNagFullscreenButton");
let builtInLevels = await loadBuiltInLevels();
let customLevels = await loadCustomLevels();
let menuLevels = createMenuLevels();
let currentLevelList = "built-in";
let devMode = false;
let secretBuffer = "";
let editorSource = { collection: "custom", fileName: "custom-level", exportName: null, levelId: "editor-level" };
let pendingFullscreenNagAction = null;
let fullscreenNagTimer = null;
logUi("boot", { customLevels: customLevels.length, menuLevels: menuLevels.length });

const game = new Game({
  canvas,
  levels: menuLevels,
  input,
  renderer,
  ui,
});

input.bind();
showMenuHome();
mainMenuEl.addEventListener("pointerdown", (event) => {
  const button = event.target.closest("button");
  logUi("menu pointerdown", { buttonId: button?.id ?? null, target: event.target.id || event.target.className });
}, true);
mainMenuEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  logUi("menu click", { buttonId: button.id });
  if (button.id === "playButton") {
    event.preventDefault();
    event.stopPropagation();
    maybeRunAfterFullscreenNag(() => showLevelList("built-in"));
    return;
  }
  if (button.id === "customLevelsButton") {
    event.preventDefault();
    event.stopPropagation();
    showLevelList("custom");
    return;
  }
  if (button.id === "instructionButton") {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("instructionDialog").hidden = false;
    return;
  }
  if (button.id === "gameFullscreenButton") {
    event.preventDefault();
    event.stopPropagation();
    toggleGameFullscreen();
    return;
  }
});
document.getElementById("instructionCloseButton").addEventListener("click", () => {
  document.getElementById("instructionDialog").hidden = true;
});
document.getElementById("instructionDialog").addEventListener("click", (event) => {
  if (event.target.id === "instructionDialog") event.currentTarget.hidden = true;
});
document.getElementById("levelListBackButton").addEventListener("click", () => {
  logUi("level list back");
  showMenuHome();
});
document.getElementById("levelListPlayButton").addEventListener("click", () => {
  logUi("level list play", { selectedLevelId: game.selectedLevelId });
  if (levelListPlayButton.disabled) return;
  playFromMenuWithFullscreenNag();
});
fullscreenNagCloseButton.addEventListener("click", () => closeFullscreenNag());
fullscreenNagFullscreenButton.addEventListener("click", () => acceptFullscreenNagWithFullscreen());
document.getElementById("editorButton").addEventListener("click", () => {
  logUi("open editor from menu");
  editorSource = { collection: "custom", fileName: "custom-level", exportName: null, levelId: "editor-level" };
  game.openEditor();
});
document.addEventListener("fullscreenchange", () => {
  logUi("fullscreenchange", { fullscreenElement: Boolean(document.fullscreenElement) });
  updateFullscreenButton();
});
document.getElementById("editorBackButton").addEventListener("click", () => game.closeEditor());
editorFullscreenButton.addEventListener("click", () => {
  const fullscreen = editorMenuEl.classList.toggle("is-fullscreen");
  editorFullscreenButton.textContent = fullscreen ? "Свернуть" : "Развернуть";
});
document.getElementById("editorSaveButton").addEventListener("click", () => {
  editor.save();
  updateEditorLevel();
});
document.getElementById("editorLoadButton").addEventListener("click", () => openEditorLoadDialog());
editorLoadInput.addEventListener("change", async () => {
  const file = editorLoadInput.files?.[0];
  editorLoadInput.value = "";
  if (!file) {
    logUi("editor load cancelled");
    return;
  }
  logUi("editor load input file", { fileName: file.name, size: file.size });
  try {
    const text = await file.text();
    const levelData = parseLevelFile(text);
    logUi("editor load parsed", { name: levelData.name, width: levelData.map?.[0]?.length, height: levelData.map?.length });
    editor.importLevelData(levelData);
    editor.save();
    updateEditorLevel();
    closeEditorLoadDialog();
    editor.setStatus(`Загружен уровень: ${file.name}.`);
  } catch (error) {
    console.error("[ui] editor load failed", error);
    editor.setStatus(`Не удалось загрузить уровень: ${error.message}`);
  }
});
document.getElementById("editorLoadCloseButton").addEventListener("click", () => closeEditorLoadDialog());
document.getElementById("editorLoadChooseButton").addEventListener("click", () => {
  logUi("editor load choose file");
  editorLoadInput.click();
});
editorLoadDialog.addEventListener("click", (event) => {
  if (event.target === editorLoadDialog) closeEditorLoadDialog();
});
editorDropZone.addEventListener("dragenter", (event) => {
  event.preventDefault();
  editorDropZone.classList.add("is-dragover");
  logUi("editor load dragenter");
});
editorDropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});
editorDropZone.addEventListener("dragleave", () => {
  editorDropZone.classList.remove("is-dragover");
  logUi("editor load dragleave");
});
editorDropZone.addEventListener("drop", async (event) => {
  event.preventDefault();
  editorDropZone.classList.remove("is-dragover");
  const file = event.dataTransfer.files?.[0];
  logUi("editor load drop", { fileName: file?.name ?? null, files: event.dataTransfer.files?.length ?? 0 });
  if (!file) return;
  await importDroppedEditorLevelFile(file);
});
document.getElementById("editorSaveFileButton").addEventListener("click", async () => {
  const saveInfo = promptLevelSaveInfo();
  if (!saveInfo) return;
  const { title, fileName, collection, exportName } = saveInfo;
  editor.setLevelName(title);
  editor.save();
  updateEditorLevel();
  try {
    await editor.saveLevelModule(fileName, { collection, exportName });
    updateInMemorySavedLevel({ title, fileName: editor.safeFileName(fileName), collection });
    builtInLevels = await loadBuiltInLevels();
    customLevels = await loadCustomLevels();
    syncMenuLevels();
    const savedId = `custom-${editor.safeFileName(fileName)}`;
    if (collection === "custom" && customLevels.some((level) => level.id === savedId)) game.selectLevel(savedId);
    if (collection === "built-in" && editorSource.levelId) game.selectLevel(editorSource.levelId);
  } catch {
    editor.setStatus("Не удалось сохранить файл уровня.");
  }
});
document.getElementById("editorTestButton").addEventListener("click", () => {
  editor.save();
  game.playLevelData(editor.exportLevelData());
});
document.getElementById("resumeButton").addEventListener("click", () => game.resume());
document.getElementById("restart").addEventListener("click", () => game.restartLevel());
document.getElementById("nextLevel").addEventListener("click", () => playNextLevel());
document.getElementById("restartPauseButton").addEventListener("click", () => game.restartLevel());
document.getElementById("restartWinPauseButton").addEventListener("click", () => game.restartLevel());
document.getElementById("nextLevelPauseButton").addEventListener("click", () => playNextLevel());
document.getElementById("backToMenuButton").addEventListener("click", () => game.backToMenu());
document.getElementById("pauseFullscreenButton").addEventListener("click", () => toggleGameFullscreen());
document.getElementById("topPauseButton").addEventListener("click", () => game.togglePause());
document.getElementById("hitboxToggle").addEventListener("change", (event) => {
  game.setHitboxesVisible(event.target.checked);
  screenEl.classList.toggle("show-hitboxes", event.target.checked);
});
window.addEventListener("level-completed", (event) => {
  saveLevelProgress(event.detail);
  renderLevelMenu();
});
window.addEventListener("keydown", (event) => {
  handleSecretCommand(event);
  if (event.target?.matches?.("input, textarea, select")) return;
  if (event.code === "Tab") {
    event.preventDefault();
    if (game.state === "editor") {
      game.closeEditor();
      return;
    }
    game.togglePause();
  }
  if (event.code === "KeyR" && game.state !== "menu") game.restartLevel();
  if (event.code === "Enter" && game.player?.win) {
    event.preventDefault();
    game.restartLevel();
    return;
  }
  if (event.code === "Enter" && game.state === "menu" && !menuLevelsEl.hidden && !levelListPlayButton.disabled) {
    event.preventDefault();
    playFromMenuWithFullscreenNag();
    return;
  }
  if (event.code === "Space" && game.player?.win) {
    event.preventDefault();
    playNextLevel();
  }
  if (event.code === "KeyK") {
    event.preventDefault();
    game.togglePerformanceOverlay();
  }
  if (event.code === "KeyJ") {
    event.preventDefault();
    game.cycleFpsCap();
  }
});

game.start();

function createMenuLevels() {
  return [
    ...builtInLevels,
    ...customLevels,
  ];
}

function syncMenuLevels() {
  menuLevels = createMenuLevels();
  game.levels = menuLevels;
  if (!menuLevels.some((level) => level.id === game.selectedLevelId)) game.selectedLevelId = menuLevels[0]?.id ?? null;
  renderLevelMenu();
  game.ui.setSelectedLevel(game.selectedLevelId);
}

function updateEditorLevel() {
  game.setLevelData("editor-level", editor.getLevelName(), editor.exportLevelData());
  syncMenuLevels();
}

function promptLevelSaveInfo() {
  const title = window.prompt("Название уровня", editor.getLevelName());
  if (title === null) return null;
  const cleanTitle = title.trim();
  if (!cleanTitle) {
    editor.setStatus("Название уровня не может быть пустым.");
    return null;
  }
  const defaultFileName = editorSource.fileName || slugFromTitle(cleanTitle) || "custom-level";
  const collectionText = editorSource.collection === "built-in" ? "src/levels" : "src/levels/custom";
  const fileName = window.prompt(`Имя файла уровня в ${collectionText}`, defaultFileName);
  if (fileName === null) return null;
  const safeFileName = editor.safeFileName(fileName);
  if (!safeFileName) {
    editor.setStatus("Имя файла уровня не может быть пустым.");
    return null;
  }
  return {
    title: cleanTitle,
    fileName: safeFileName,
    collection: editorSource.collection ?? "custom",
    exportName: editorSource.exportName ?? null,
  };
}

function slugFromTitle(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/ё/g, "e")
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "custom-level";
}

function updateInMemorySavedLevel({ title, fileName, collection }) {
  const levelData = editor.exportLevelData();
  if (collection !== "built-in") return;
  const target = builtInLevels.find((level) => level.fileName === fileName || level.id === editorSource.levelId);
  if (!target) return;
  target.title = title;
  target.data = levelData;
}

function readProgress() {
  try {
    return JSON.parse(sessionStorage.getItem(PROGRESS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function isLevelUnlocked(levels, index, progress) {
  if (currentLevelList !== "built-in") return true;
  if (index <= 0) return true;
  return Boolean(progress[levels[index - 1]?.id]);
}

function firstUnlockedLevel(levels, progress) {
  return levels.find((level, index) => isLevelUnlocked(levels, index, progress));
}

function saveLevelProgress(detail) {
  if (!detail?.levelId) return;
  const progress = readProgress();
  const previous = progress[detail.levelId];
  const elapsedMs = Math.max(0, Math.round(detail.elapsedMs ?? 0));
  if (!previous || elapsedMs < previous.bestMs) {
    progress[detail.levelId] = {
      bestMs: elapsedMs,
      deaths: detail.deaths ?? 0,
      title: detail.title ?? detail.levelId,
      completedAt: Date.now(),
    };
    sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }
}

function formatTime(ms) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function difficultyStars(level) {
  const difficulty = Math.max(1, Math.min(5, Math.round(Number(level.data?.difficulty ?? level.difficulty ?? 1))));
  return difficulty;
}

function pixelStars(count) {
  return `<span class="pixel-stars" aria-label="${count} из 5">${Array.from({ length: count }, () => '<span class="pixel-star"></span>').join("")}</span>`;
}

function difficultyLine(level, suffix = "") {
  const stars = difficultyStars(level);
  return `<span class="difficulty-row"><span class="difficulty-label">Сложность</span>${pixelStars(stars)}</span>${suffix ? `<span class="difficulty-extra">${suffix}</span>` : ""}`;
}

function playNextLevel() {
  const levels = levelsForCurrentList();
  const progress = readProgress();
  const index = levels.findIndex((level) => level.id === game.selectedLevelId);
  const next = levels.find((level, levelIndex) => levelIndex > index && isLevelUnlocked(levels, levelIndex, progress)) ?? levels[0];
  if (!next) return;
  game.selectLevel(next.id);
  playFromMenuWithFullscreenNag();
}

function playFromMenuWithFullscreenNag() {
  maybeRunAfterFullscreenNag(() => game.playFromMenu());
}

function hasUsedFullscreen() {
  return sessionStorage.getItem(FULLSCREEN_USED_KEY) === "1";
}

function hasDismissedFullscreenNag() {
  return sessionStorage.getItem(FULLSCREEN_NAG_KEY) === "1";
}

function rememberFullscreenUsed() {
  sessionStorage.setItem(FULLSCREEN_USED_KEY, "1");
}

function maybeRunAfterFullscreenNag(action) {
  if (hasUsedFullscreen() || hasDismissedFullscreenNag()) {
    action();
    return;
  }
  pendingFullscreenNagAction = action;
  showFullscreenNag();
}

function showFullscreenNag() {
  logUi("fullscreen nag open");
  fullscreenNagDialog.hidden = false;
  fullscreenNagCloseButton.disabled = true;
  let seconds = 5;
  fullscreenNagCloseButton.textContent = `Подожди ${seconds}`;
  clearInterval(fullscreenNagTimer);
  fullscreenNagTimer = setInterval(() => {
    seconds -= 1;
    if (seconds > 0) {
      fullscreenNagCloseButton.textContent = `Подожди ${seconds}`;
      return;
    }
    clearInterval(fullscreenNagTimer);
    fullscreenNagTimer = null;
    fullscreenNagCloseButton.disabled = false;
    fullscreenNagCloseButton.textContent = "Ладно, играю как есть";
  }, 1000);
}

function closeFullscreenNag() {
  if (fullscreenNagCloseButton.disabled) return;
  logUi("fullscreen nag dismissed");
  sessionStorage.setItem(FULLSCREEN_NAG_KEY, "1");
  fullscreenNagDialog.hidden = true;
  const action = pendingFullscreenNagAction;
  pendingFullscreenNagAction = null;
  action?.();
}

async function acceptFullscreenNagWithFullscreen() {
  logUi("fullscreen nag accept fullscreen");
  fullscreenNagFullscreenButton.disabled = true;
  fullscreenNagFullscreenButton.textContent = "Разворачиваю...";
  await toggleGameFullscreen();
  sessionStorage.setItem(FULLSCREEN_NAG_KEY, "1");
  fullscreenNagDialog.hidden = true;
  fullscreenNagFullscreenButton.disabled = false;
  fullscreenNagFullscreenButton.textContent = "Развернуть и продолжить";
  const action = pendingFullscreenNagAction;
  pendingFullscreenNagAction = null;
  action?.();
}

function renderLevelMenu() {
  levelSelectEl.innerHTML = "";
  const levels = levelsForCurrentList();
  const progress = readProgress();
  logUi("render level menu", { list: currentLevelList, levels: levels.map((level) => level.id), devMode });
  const selectedIndex = levels.findIndex((level) => level.id === game.selectedLevelId);
  levelListPlayButton.disabled = levels.length === 0 || selectedIndex < 0 || !isLevelUnlocked(levels, selectedIndex, progress);
  if (levels.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-level-list";
    empty.textContent = currentLevelList === "custom" ? "Сохраненных уровней пока нет. Создай уровень в редакторе и нажми «В папку уровней»." : "Уровни не найдены.";
    levelSelectEl.append(empty);
  }
  levels.forEach((level) => {
    const index = levels.indexOf(level);
    const done = progress[level.id];
    const locked = !isLevelUnlocked(levels, index, progress);
    const button = document.createElement("button");
    button.className = `level-card ${currentLevelList === "custom" ? "compact-level-card" : ""}`;
    if (done) button.classList.add("is-completed");
    if (locked) button.classList.add("is-locked");
    button.type = "button";
    button.disabled = locked;
    button.dataset.levelId = level.id;
    button.innerHTML = `
      <span>${level.badge ?? level.source ?? "Уровень"}</span>
      <strong>${level.title}</strong>
      <small class="level-difficulty">${difficultyLine(level)}</small>
    `;
    button.addEventListener("click", () => {
      if (locked) return;
      logUi("level selected", { levelId: level.id, list: currentLevelList });
      game.selectLevel(level.id);
      renderLevelMenu();
    });
    if (locked) {
      button.querySelector("span").textContent = "Закрыто";
      button.querySelector("small").innerHTML = difficultyLine(level, "пройди предыдущий");
    }
    if (done) {
      button.querySelector("span").textContent = "Пройден";
      button.querySelector("small").innerHTML = difficultyLine(level, `лучшее ${formatTime(done.bestMs)}`);
    }
    if ((devMode && level.kind === "built-in") || level.kind === "custom") {
      const edit = document.createElement("button");
      edit.className = "level-edit-button";
      edit.type = "button";
      edit.textContent = "Редактировать";
      edit.addEventListener("click", (event) => {
        event.stopPropagation();
        openLevelInEditor(level);
      });
      button.append(edit);
    }
    levelSelectEl.append(button);
  });
  game.ui.setSelectedLevel(game.selectedLevelId);
  const count = customLevels.length;
  customLevelStatusEl.textContent = count > 0 ? `сохранено: ${count}` : "папка пуста";
}

function showMenuHome() {
  logUi("show menu home");
  menuHomeEl.hidden = false;
  menuLevelsEl.hidden = true;
}

function showLevelList(kind) {
  currentLevelList = kind;
  logUi("show level list", { kind, customLevels: customLevels.length });
  menuHomeEl.hidden = true;
  menuLevelsEl.hidden = false;
  levelListTitleEl.textContent = kind === "custom" ? "Свои уровни" : "Играть";
  levelListKickerEl.textContent = kind === "custom" ? "src/levels/custom" : "встроенные уровни";
  const levels = levelsForCurrentList();
  const progress = readProgress();
  const unlocked = firstUnlockedLevel(levels, progress);
  if (unlocked) game.selectLevel(unlocked.id);
  renderLevelMenu();
}

function openEditorLoadDialog() {
  logUi("editor load dialog open");
  editorLoadDialog.hidden = false;
}

function closeEditorLoadDialog() {
  logUi("editor load dialog close");
  editorDropZone.classList.remove("is-dragover");
  editorLoadDialog.hidden = true;
}

async function importDroppedEditorLevelFile(file) {
  logUi("editor load dropped file", { fileName: file.name, size: file.size });
  try {
    const text = await file.text();
    const levelData = parseLevelFile(text);
    logUi("editor load parsed", { name: levelData.name, width: levelData.map?.[0]?.length, height: levelData.map?.length });
    editor.importLevelData(levelData);
    editor.save();
    updateEditorLevel();
    closeEditorLoadDialog();
    editor.setStatus(`Загружен уровень: ${file.name}.`);
  } catch (error) {
    console.error("[ui] editor load failed", error);
    editor.setStatus(`Не удалось загрузить уровень: ${error.message}`);
  }
}

function levelsForCurrentList() {
  if (currentLevelList === "custom") return customLevels;
  return builtInLevels;
}

function openLevelInEditor(level) {
  editor.importLevelData(level.data);
  editorSource = {
    collection: level.collection ?? (level.kind === "built-in" ? "built-in" : "custom"),
    fileName: level.fileName ?? editor.safeFileName(level.title),
    exportName: level.exportName ?? null,
    levelId: level.id,
  };
  game.openEditor();
  editor.setStatus(`Открыт уровень «${level.title}». Сохранение пойдет в ${editorSource.collection === "built-in" ? "src/levels" : "src/levels/custom"}.`);
}

function handleSecretCommand(event) {
  if (event.ctrlKey || event.altKey || event.metaKey) return;
  const char = keyCharFromEvent(event);
  if (!char) return;
  secretBuffer = `${secretBuffer}${char}`.slice(-7);
  logUi("secret command buffer", { code: event.code, key: event.key, buffer: secretBuffer });
  if (secretBuffer !== "devmode") return;
  devMode = !devMode;
  secretBuffer = "";
  logUi("devmode toggled", { devMode });
  renderLevelMenu();
  ui.showMessage(devMode ? "Режим разработчика включен." : "Режим разработчика выключен.");
}

function keyCharFromEvent(event) {
  if (event.code?.startsWith("Key")) return event.code.slice(3).toLowerCase();
  if (event.key?.length === 1 && /^[a-z]$/i.test(event.key)) return event.key.toLowerCase();
  return "";
}

async function toggleGameFullscreen() {
  rememberFullscreenUsed();
  logUi("fullscreen toggle requested", {
    nativeFullscreen: Boolean(document.fullscreenElement),
    fallbackFullscreen: gamePanelEl.classList.contains("is-browser-fullscreen"),
    api: Boolean(gamePanelEl.requestFullscreen),
  });
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    gamePanelEl.classList.remove("is-browser-fullscreen");
    logUi("fullscreen native exit");
    updateFullscreenButton();
    return;
  }

  if (gamePanelEl.classList.contains("is-browser-fullscreen")) {
    gamePanelEl.classList.remove("is-browser-fullscreen");
    logUi("fullscreen fallback exit");
    updateFullscreenButton();
    return;
  }

  try {
    if (!gamePanelEl.requestFullscreen) throw new Error("Fullscreen API is unavailable");
    await gamePanelEl.requestFullscreen();
    logUi("fullscreen native entered");
  } catch (error) {
    console.warn("[ui] fullscreen native failed, fallback enabled", error);
    gamePanelEl.classList.add("is-browser-fullscreen");
  }
  updateFullscreenButton();
}

function updateFullscreenButton() {
  const active = Boolean(document.fullscreenElement) || gamePanelEl.classList.contains("is-browser-fullscreen");
  gameFullscreenButton.querySelector("strong").textContent = active ? "Свернуть игру" : "Играть на весь экран";
  document.getElementById("pauseFullscreenButton").innerHTML = active ? "Свернуть <small>экран</small>" : "Весь экран <small>рекомендовано</small>";
}

async function loadCustomLevels() {
  try {
    const response = await fetch(`/__list-levels?ts=${Date.now()}`);
    logUi("custom level list response", { ok: response.ok, status: response.status });
    if (!response.ok) return [];
    const data = await response.json();
    logUi("custom level list payload", { ok: data.ok, count: data.levels?.length ?? 0 });
    if (!data.ok || !Array.isArray(data.levels)) return [];
    const levels = await Promise.all(data.levels.map((entry) => importCustomLevel(entry)));
    return levels.filter(Boolean);
  } catch (error) {
    console.warn("[ui] custom level list failed", error);
    return [];
  }
}

async function loadBuiltInLevels() {
  try {
    const response = await fetch(`/__list-levels?collection=built-in&ts=${Date.now()}`);
    logUi("built-in level list response", { ok: response.ok, status: response.status });
    if (!response.ok) return sortBuiltInLevels(FALLBACK_BUILT_IN_LEVELS);
    const data = await response.json();
    logUi("built-in level list payload", { ok: data.ok, count: data.levels?.length ?? 0 });
    if (!data.ok || !Array.isArray(data.levels) || data.levels.length === 0) return sortBuiltInLevels(FALLBACK_BUILT_IN_LEVELS);
    const levels = await Promise.all(data.levels.map((entry) => importListedLevel(entry, "built-in")));
    const loaded = levels.filter(Boolean);
    return loaded.length ? sortBuiltInLevels(withExtraBuiltInLevels(loaded)) : sortBuiltInLevels(FALLBACK_BUILT_IN_LEVELS);
  } catch (error) {
    console.warn("[ui] built-in level list failed", error);
    return sortBuiltInLevels(FALLBACK_BUILT_IN_LEVELS);
  }
}

function sortBuiltInLevels(levels) {
  const order = ["level-one", "level-two", "level-three", "level-four", "level-five", "level-last", "labyrinth-impossible-final"];
  return [...levels].sort((a, b) => {
    const ai = order.indexOf(a.fileName);
    const bi = order.indexOf(b.fileName);
    if (ai >= 0 || bi >= 0) return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
    return a.fileName.localeCompare(b.fileName, "ru");
  });
}

function withExtraBuiltInLevels(levels) {
  const existingIds = new Set(levels.map((level) => level.id));
  const existingFiles = new Set(levels.map((level) => level.fileName));
  return [
    ...levels,
    ...EXTRA_BUILT_IN_LEVELS.filter((level) => !existingIds.has(level.id) && !existingFiles.has(level.fileName)),
  ];
}

function parseLevelFile(text) {
  const objectStart = text.indexOf("Object.freeze(");
  if (objectStart >= 0) {
    const start = objectStart + "Object.freeze(".length;
    const end = text.lastIndexOf(");");
    if (end > start) return JSON.parse(text.slice(start, end));
  }
  return JSON.parse(text);
}

async function importCustomLevel(entry) {
  return importListedLevel(entry, "custom");
}

async function importListedLevel(entry, kind) {
  try {
    logUi(`${kind} level import`, entry);
    const module = await import(`${entry.path}?v=${Date.now()}`);
    const levelData = Object.values(module).find((value) => value && Array.isArray(value.map));
    if (!levelData) {
      console.warn("[ui] listed level has no level data", entry);
      return null;
    }
    const title = levelData.name && levelData.name !== "Пользовательский уровень" ? levelData.name : entry.title;
    return {
      id: entry.id,
      title,
      badge: kind === "built-in" ? "Уровень" : "Сохраненный",
      source: entry.fileName,
      kind,
      collection: kind === "built-in" ? "built-in" : "custom",
      fileName: entry.fileName,
      exportName: entry.exportName ?? null,
      data: levelData,
    };
  } catch (error) {
    console.warn("[ui] listed level import failed", entry, error);
    return null;
  }
}
