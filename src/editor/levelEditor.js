import { GameConfig } from "../config/gameConfig.js";

const STORAGE_KEY = "labyrinth-meat-editor-level";
const DEFAULT_WIDTH = 75;
const DEFAULT_HEIGHT = 45;
const MIN_SIZE = 20;
const MAX_SIZE = 120;
const DEFAULT_LEVEL_FILE = "custom-level";

const DEFAULT_SETTINGS = Object.freeze({
  tuningScale: 15,
  levelName: "Пользовательский уровень",
  difficulty: 1,
  speedLevel: 14,
  jumpLevel: 14,
  accelerationLevel: 10,
  verticalLevel: 10,
  wallJumpLevel: 15,
  laserRadiusTiles: 12,
  laserActive: true,
  sawAxis: "x",
  sawSpanTiles: 3,
  sawSpeed: 1,
  sawActive: true,
  rocketActive: false,
  rocketAggression: 8,
  turretRadiusTiles: 10,
  turretRocketSpeed: 4.2,
  turretCooldownFrames: 120,
  robotDirection: "right",
  robotSpeed: 2.2,
  robotCooldownFrames: 90,
  flierSpeed: 0.8,
  flierDirection: "right",
  flierAreaWidthTiles: 6,
  flierAreaHeightTiles: 4,
  mazeBotSpeed: 0.72,
  mazeBotDirection: "right",
  wallMineSide: "floor",
  triggerWidthTiles: 3,
  triggerHeightTiles: 3,
  textZoneWidthTiles: 5,
  textZoneHeightTiles: 3,
  textZoneText: "Здесь будет текст подсказки.",
  visualText: "ХАЛЯВА",
  visualTextSize: 13,
  activateRockets: true,
  activateSaws: true,
  activateHiddenSpikes: true,
  activateLasers: true,
  gateRequiredCount: 3,
  slopeRotation: 0,
  slopeSizeTiles: 1,
  cameraDeadZoneWidth: 250,
  cameraDeadZoneHeight: 150,
  cameraStartOffsetX: 0,
  cameraStartOffsetY: 0,
  physicsMode: "classic",
  physicsOverrides: {},
});

const PHYSICS_FIELDS = [
  ["Ускорение", "groundAcceleration", 0, 1, 0.005],
  ["Воздух", "airAcceleration", 0, 1, 0.005],
  ["Трение земли", "groundFriction", 0.5, 1, 0.001],
  ["Трение воздуха", "airFriction", 0.5, 1, 0.001],
  ["Макс. бег", "maxRunSpeed", 0.5, 12, 0.05],
  ["Макс. X", "maxHorizontalSpeed", 0.5, 14, 0.05],
  ["Старт прыжка", "jumpVelocity", -18, -1, 0.05],
  ["Кадры удержания", "jumpHoldFrames", 0, 140, 1],
  ["Сила удержания", "jumpHoldForce", 0, 0.5, 0.005],
  ["Финал удержания", "jumpHoldForceEnd", 0, 0.4, 0.005],
  ["Затухание", "jumpHoldDecay", 0.2, 3, 0.05],
  ["Гравитация отпускания", "jumpReleaseGravity", 0, 1, 0.005],
  ["Гравитация", "gravity", 0.02, 1.2, 0.005],
  ["Быстрый спуск", "fastFallGravity", 0, 1, 0.005],
  ["Макс. падение", "maxFallSpeed", 1, 20, 0.05],
  ["Wall jump X", "wallJumpVelocityX", 0, 12, 0.05],
  ["Wall jump Y", "wallJumpVelocityY", -18, -1, 0.05],
  ["Вверх по стене X", "wallClimbJumpVelocityX", 0, 5, 0.05],
  ["Вверх по стене Y", "wallClimbJumpVelocityY", -18, -1, 0.05],
  ["Импульс от стены", "wallJumpAwayBoost", 0, 5, 0.05],
  ["Сохранение скорости", "wallJumpMomentumCarry", 0, 1, 0.01],
  ["Задержка той же стены", "sameWallRelatchFrames", 0, 80, 1],
  ["Кадры зацепа", "wallGripFrames", 0, 240, 1],
  ["Скорость зацепа", "wallGripFallSpeed", 0, 4, 0.01],
  ["Скорость скольжения", "wallSlideSpeed", 0, 6, 0.01],
  ["Трение стены", "wallFriction", 0, 1, 0.01],
];

const TOOLS = [
  { id: "Y", label: "Склон 45", category: "Карта", color: "#52eadc" },
  { id: ".", label: "Пусто", category: "Карта", color: "#101821" },
  { id: "#", label: "Стена", category: "Карта", color: "#26364a" },
  { id: "U", label: "Темная стена", category: "Карта", color: "#070a10" },
  { id: "P", label: "Старт", category: "Карта", color: "#71f79f", unique: true },
  { id: "D", label: "Финиш", category: "Карта", color: "#71f79f", unique: true },
  { id: "G", label: "Проход 3 монеты", category: "Карта", color: "#ffd15c" },
  { id: "E", label: "Фейк-дверь", category: "Троллинг", color: "#ff4c6a" },
  { id: "K", label: "Ключ", category: "Пикапы", color: "#52eadc", unique: true },
  { id: "C", label: "Фейк-монета", category: "Пикапы", color: "#ffd15c" },
  { id: "M", label: "Монета прохода", category: "Пикапы", color: "#ffd15c" },
  { id: "B", label: "Кнопка", category: "События", color: "#ffd15c" },
  { id: "Z", label: "Триггер", category: "События", color: "#b583ff" },
  { id: "A", label: "Текст", category: "Декор", color: "#ffd15c" },
  { id: "S", label: "Шипы", category: "Ловушки", color: "#ff4c6a" },
  { id: "H", label: "Скрытые шипы", category: "Ловушки", color: "#ff7b93" },
  { id: "F", label: "Падающий блок", category: "Ловушки", color: "#7b8ea7" },
  { id: "T", label: "Треугольник", category: "Ловушки", color: "#ffd15c" },
  { id: "O", label: "Пила", category: "Ловушки", color: "#eef4ff" },
  { id: "N", label: "Робот", category: "Ловушки", color: "#7b8ea7" },
  { id: "I", label: "Мина", category: "Ловушки", color: "#ff4c6a" },
  { id: "W", label: "Настенная мина", category: "Ловушки", color: "#ff7b93" },
  { id: "Q", label: "Летающий робот", category: "Ловушки", color: "#b583ff" },
  { id: "J", label: "Черный робот", category: "Ловушки", color: "#05070a" },
  { id: "R", label: "Турель", category: "Ловушки", color: "#ff4c6a" },
  { id: "L", label: "Лазер", category: "Ловушки", color: "#52eadc" },
  { id: "X", label: "Бомба", category: "Ловушки", color: "#0b1018" },
  { id: "V", label: "Текст-зона", category: "События", color: "#52eadc" },
];

const TOOL_BY_ID = new Map(TOOLS.map((tool) => [tool.id, tool]));
const META_TOOLS = new Set(["O", "R", "L", "H", "Z", "V", "B", "G", "Y", "N", "Q", "J", "W", "A"]);

export class LevelEditor {
  constructor({ canvas, paletteEl, settingsEl, modeButtons, undoButton, redoButton, statusEl, widthInput, heightInput, resizeButton }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.paletteEl = paletteEl;
    this.settingsEl = settingsEl;
    this.modeButtons = [...modeButtons];
    this.undoButton = undoButton;
    this.redoButton = redoButton;
    this.statusEl = statusEl;
    this.widthInput = widthInput;
    this.heightInput = heightInput;
    this.resizeButton = resizeButton;
    this.activeTool = "#";
    this.mode = "insert";
    this.clipboard = null;
    this.pasteArmed = false;
    this.history = [];
    this.redoStack = [];
    this.maxHistory = 120;
    this.isDrawing = false;
    this.isPanning = false;
    this.isSelecting = false;
    this.isMovingSelection = false;
    this.lastPointer = { x: 0, y: 0 };
    this.width = DEFAULT_WIDTH;
    this.height = DEFAULT_HEIGHT;
    this.zoom = 1;
    this.baseTile = 16;
    this.camera = { x: 0, y: 0 };
    this.settings = { ...DEFAULT_SETTINGS };
    this.settingsTab = "level";
    this.selectedTile = null;
    this.selection = null;
    this.multiSelection = [];
    this.selectionDraft = null;
    this.selectionStart = null;
    this.moveStartTile = null;
    this.moveDelta = { dx: 0, dy: 0 };
    this.movePayload = null;
    this.meta = {};
    this.grid = this.createDefaultGrid(this.width, this.height);
    this.buildPalette();
    this.renderSettings();
    this.bind();
    this.load();
    this.syncSizeInputs();
    this.commitHistory({ clearRedo: true });
    this.refreshModeButtons();
    this.refreshHistoryButtons();
    this.draw();
  }

  createDefaultGrid(width, height) {
    const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => "."));
    this.applyBorders(grid);
    return grid;
  }

  applyBorders(grid) {
    const height = grid.length;
    const width = grid[0].length;
    for (let x = 0; x < width; x += 1) {
      grid[0][x] = "#";
      grid[height - 1][x] = "#";
      grid[height - 2][x] = "#";
      grid[height - 3][x] = "#";
    }
    for (let y = 0; y < height; y += 1) {
      grid[y][0] = "#";
      grid[y][width - 1] = "#";
    }
    grid[Math.max(1, height - 4)][Math.min(4, width - 2)] = "P";
    grid[Math.max(1, height - 4)][Math.max(1, width - 5)] = "D";
  }

  buildPalette() {
    this.paletteEl.innerHTML = "";
    const groups = new Map();
    TOOLS.forEach((tool) => {
      if (!groups.has(tool.category)) groups.set(tool.category, []);
      groups.get(tool.category).push(tool);
    });

    groups.forEach((tools, category) => {
      const group = document.createElement("div");
      group.className = "tool-group";
      const title = document.createElement("div");
      title.className = "tool-group-title";
      title.textContent = category;
      group.append(title);

      tools.forEach((tool) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "tool-button";
        button.dataset.tool = tool.id;
        button.innerHTML = `<span class="tool-swatch" style="background:${tool.color}">${tool.id === "." ? "" : tool.id}</span><span>${tool.label}</span>`;
        button.addEventListener("click", () => this.setTool(tool.id));
        group.append(button);
      });

      this.paletteEl.append(group);
    });
    this.refreshPalette();
  }

  bind() {
    this.canvas.addEventListener("mousedown", (event) => {
      const pointer = this.eventToCanvas(event);
      this.lastPointer = pointer;
      if (event.button === 1 || event.shiftKey || event.button === 2) {
        this.isPanning = true;
        return;
      }
      this.isDrawing = true;
      this.startCanvasAction(event);
    });
    window.addEventListener("mouseup", () => {
      if (this.isSelecting) this.finishSelection();
      if (this.isMovingSelection) {
        if (Array.isArray(this.movePayload)) this.finishMoveMultiSelection();
        else this.finishMoveSelection();
      }
      this.isDrawing = false;
      this.isPanning = false;
      this.isSelecting = false;
      this.isMovingSelection = false;
    });
    this.canvas.addEventListener("mousemove", (event) => {
      const pointer = this.eventToCanvas(event);
      if (this.isPanning) {
        this.camera.x -= pointer.x - this.lastPointer.x;
        this.camera.y -= pointer.y - this.lastPointer.y;
        this.lastPointer = pointer;
        this.clampCamera();
        this.draw();
        return;
      }
      if (this.isSelecting) this.updateSelectionFromEvent(event);
      else if (this.isMovingSelection) this.updateMoveSelection(event);
      else if (this.isDrawing) this.paintFromEvent(event);
      else this.previewStatus(event);
    });
    this.canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      const pointer = this.eventToCanvas(event);
      const before = this.canvasToWorld(pointer);
      this.zoom = Math.max(0.35, Math.min(3.2, this.zoom * (event.deltaY < 0 ? 1.12 : 0.88)));
      const after = this.canvasToWorld(pointer);
      this.camera.x += (before.x - after.x) * this.tileSize;
      this.camera.y += (before.y - after.y) * this.tileSize;
      this.clampCamera();
      this.draw();
    }, { passive: false });
    this.canvas.addEventListener("contextmenu", (event) => event.preventDefault());
    this.resizeButton.addEventListener("click", () => this.resizeFromInputs());
    this.settingsEl.addEventListener("input", (event) => {
      if (this.controlWaitsForEnter(event.target)) return;
      this.handleSettingsInput(event);
    });
    this.settingsEl.addEventListener("change", (event) => this.handleSettingsInput(event));
    this.settingsEl.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || !this.controlWaitsForEnter(event.target)) return;
      event.preventDefault();
      this.handleSettingsInput(event);
      event.target.blur();
    });
    this.settingsEl.addEventListener("click", (event) => {
      const resetButton = event.target.closest("[data-physics-reset]");
      if (resetButton) this.resetPhysicsOverrides();
      const tabButton = event.target.closest("[data-settings-tab]");
      if (tabButton) {
        if (tabButton.dataset.settingsTab === "selected" && this.hasMixedMultiSelection()) {
          this.setStatus("Нельзя редактировать свойства сразу у разных типов. Можно только двигать или удалить.");
          return;
        }
        this.settingsTab = tabButton.dataset.settingsTab;
        this.renderSettings();
      }
    });
    this.modeButtons.forEach((button) => {
      button.addEventListener("click", () => this.setMode(button.dataset.editorMode));
    });
    this.undoButton.addEventListener("click", () => this.undo());
    this.redoButton.addEventListener("click", () => this.redo());
    window.addEventListener("keydown", (event) => this.handleKeyboard(event));
  }

  get tileSize() {
    return this.baseTile * this.zoom;
  }

  setTool(tool) {
    this.activeTool = tool;
    this.setMode("insert", { silent: true });
    this.pasteArmed = false;
    this.refreshPalette();
    this.renderSettings();
    this.setStatus(`Выбран инструмент: ${TOOL_BY_ID.get(tool)?.label ?? tool}`);
  }

  setMode(mode, options = {}) {
    if (!["insert", "select", "move", "erase"].includes(mode)) return;
    this.mode = mode;
    if (mode !== "insert" && !options.keepPaste) this.pasteArmed = false;
    this.refreshModeButtons();
    if (!options.silent) {
      const labels = { insert: "Вставка", select: "Выделение", move: "Перемещение", erase: "Ластик" };
      const label = labels[mode] ?? mode;
      this.setStatus(`Режим: ${label}.`);
    }
  }

  refreshModeButtons() {
    this.modeButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.editorMode === this.mode);
    });
  }

  refreshPalette() {
    this.paletteEl.querySelectorAll("[data-tool]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tool === this.activeTool);
    });
  }

  startCanvasAction(event) {
    const tile = this.eventToTile(event);
    if (!tile) return;
    if (this.mode === "select") {
      if (event.ctrlKey || event.metaKey) {
        this.toggleMultiSelection(tile.tx, tile.ty);
        return;
      }
      this.startSelection(tile.tx, tile.ty);
      return;
    }
    if (this.mode === "move") {
      if (this.multiSelection.length > 0 && this.multiSelection.some((item) => item.tx === tile.tx && item.ty === tile.ty)) {
        this.startMoveMultiSelection(tile.tx, tile.ty);
        return;
      }
      if (this.selection && this.tileInsideSelection(tile.tx, tile.ty, this.selection)) {
        this.startMoveSelection(tile.tx, tile.ty);
      } else {
        this.selectTile(tile.tx, tile.ty);
        this.setStatus("Сначала выдели область, потом режимом перемещения тащи ее за любой тайл внутри рамки.");
      }
      return;
    }
    this.paintFromEvent(event);
  }

  paintFromEvent(event) {
    const tile = this.eventToTile(event);
    if (!tile) return;
    if (this.pasteArmed && this.clipboard) {
      this.pasteClipboard(tile.tx, tile.ty);
      return;
    }
    if (this.mode === "erase") {
      this.place(tile.tx, tile.ty, ".");
      return;
    }
    this.place(tile.tx, tile.ty, this.activeTool);
  }

  previewStatus(event) {
    const tile = this.eventToTile(event);
    if (!tile) {
      this.setStatus("Колесо: масштаб. Shift+drag или ПКМ: двигать камеру.");
      return;
    }
    const key = this.metaKey(tile.tx, tile.ty);
    const meta = this.meta[key];
    const metaText = meta ? ` | объект: ${meta.type}` : "";
    const modeText = this.pasteArmed ? "вставь копию кликом" : this.mode === "erase" ? "ластик" : this.mode === "select" ? "выделение" : this.mode === "move" ? "перемещение" : TOOL_BY_ID.get(this.activeTool)?.label ?? this.activeTool;
    this.setStatus(`Тайл ${tile.tx}, ${tile.ty}. Масштаб ${(this.zoom * 100).toFixed(0)}%. Режим: ${modeText}${metaText}`);
  }

  eventToCanvas(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (event.clientY - rect.top) * (this.canvas.height / rect.height),
    };
  }

  canvasToWorld(pointer) {
    return {
      x: (pointer.x + this.camera.x) / this.tileSize,
      y: (pointer.y + this.camera.y) / this.tileSize,
    };
  }

  eventToTile(event) {
    const world = this.canvasToWorld(this.eventToCanvas(event));
    const tx = Math.floor(world.x);
    const ty = Math.floor(world.y);
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) return null;
    return { tx, ty };
  }

  place(tx, ty, value, options = {}) {
    if (value === "I" && ["#", "Y", "F"].includes(this.grid[ty]?.[tx]) && ty > 1) {
      ty -= 1;
    }
    if (tx === 0 || ty === 0 || tx === this.width - 1 || ty >= this.height - 3) return;
    const tool = TOOL_BY_ID.get(value);
    if (tool?.unique) this.clearTool(value);

    const key = this.metaKey(tx, ty);
    const nextMeta = options.meta ? this.clone(options.meta) : META_TOOLS.has(value) ? this.createMetadataForTool(value) : undefined;
    const currentMeta = this.meta[key];
    if (this.grid[ty][tx] === value && JSON.stringify(currentMeta ?? null) === JSON.stringify(nextMeta ?? null)) {
      this.selectedTile = { tx, ty };
      this.selection = { x: tx, y: ty, w: 1, h: 1 };
      this.renderSettings();
      this.draw();
      return;
    }

    this.removeMeta(tx, ty);
    this.grid[ty][tx] = value;
    if (nextMeta) this.meta[key] = nextMeta;

    this.selectedTile = { tx, ty };
    this.selection = { x: tx, y: ty, w: 1, h: 1 };
    this.multiSelection = [];
    this.commitHistory();
    this.renderSettings();
    this.draw();
  }

  selectTile(tx, ty) {
    this.selectedTile = { tx, ty };
    this.selection = { x: tx, y: ty, w: 1, h: 1 };
    this.multiSelection = [];
    this.pasteArmed = false;
    this.renderSettings();
    this.draw();
    this.setStatus(`Выбран тайл ${tx}, ${ty}: ${TOOL_BY_ID.get(this.grid[ty][tx])?.label ?? this.grid[ty][tx]}.`);
  }

  startSelection(tx, ty) {
    this.selectionStart = { tx, ty };
    this.selectionDraft = { x: tx, y: ty, w: 1, h: 1 };
    this.selection = this.selectionDraft;
    this.selectedTile = { tx, ty };
    this.multiSelection = [];
    this.isSelecting = true;
    this.pasteArmed = false;
    this.draw();
  }

  updateSelectionFromEvent(event) {
    const tile = this.eventToTile(event);
    if (!tile || !this.selectionStart) return;
    this.selectionDraft = this.rectFromPoints(this.selectionStart.tx, this.selectionStart.ty, tile.tx, tile.ty);
    this.selection = this.selectionDraft;
    this.selectedTile = { tx: this.selection.x, ty: this.selection.y };
    this.setStatus(`Выделение: ${this.selection.w}x${this.selection.h}.`);
    this.draw();
  }

  finishSelection() {
    if (!this.selectionDraft) return;
    this.selection = this.selectionDraft;
    this.selectionDraft = null;
    this.selectionStart = null;
    this.multiSelection = [];
    this.renderSettings();
    this.draw();
  }

  startMoveSelection(tx, ty) {
    this.movePayload = this.captureSelection(this.selection);
    this.moveStartTile = { tx, ty };
    this.moveDelta = { dx: 0, dy: 0 };
    this.isMovingSelection = true;
    this.setStatus(`Перемещение области ${this.selection.w}x${this.selection.h}.`);
  }

  updateMoveSelection(event) {
    if (Array.isArray(this.movePayload)) {
      this.updateMoveMultiSelection(event);
      return;
    }
    const tile = this.eventToTile(event);
    if (!tile || !this.moveStartTile || !this.selection) return;
    const unclamped = {
      x: this.selection.x + tile.tx - this.moveStartTile.tx,
      y: this.selection.y + tile.ty - this.moveStartTile.ty,
      w: this.selection.w,
      h: this.selection.h,
    };
    const clamped = this.clampSelectionRect(unclamped);
    this.moveDelta = { dx: clamped.x - this.selection.x, dy: clamped.y - this.selection.y };
    this.setStatus(`Перенос: ${this.moveDelta.dx}, ${this.moveDelta.dy}.`);
    this.draw();
  }

  updateMoveMultiSelection(event) {
    const tile = this.eventToTile(event);
    if (!tile || !this.moveStartTile || !Array.isArray(this.movePayload)) return;
    const rawDx = tile.tx - this.moveStartTile.tx;
    const rawDy = tile.ty - this.moveStartTile.ty;
    const minX = Math.min(...this.movePayload.map((item) => item.tx));
    const maxX = Math.max(...this.movePayload.map((item) => item.tx));
    const minY = Math.min(...this.movePayload.map((item) => item.ty));
    const maxY = Math.max(...this.movePayload.map((item) => item.ty));
    const dx = Math.max(1 - minX, Math.min(this.width - 2 - maxX, rawDx));
    const dy = Math.max(1 - minY, Math.min(this.height - 4 - maxY, rawDy));
    this.moveDelta = { dx, dy };
    this.setStatus(`Перенос предметов: ${dx}, ${dy}.`);
    this.draw();
  }

  finishMoveSelection() {
    if (!this.movePayload || !this.selection || (this.moveDelta.dx === 0 && this.moveDelta.dy === 0)) {
      this.movePayload = null;
      this.moveStartTile = null;
      this.moveDelta = { dx: 0, dy: 0 };
      this.draw();
      return;
    }

    const target = this.clampSelectionRect({
      x: this.selection.x + this.moveDelta.dx,
      y: this.selection.y + this.moveDelta.dy,
      w: this.selection.w,
      h: this.selection.h,
    });
    this.clearArea(this.selection);
    this.applyAreaPayload(this.movePayload, target.x, target.y);
    this.selection = target;
    this.selectedTile = { tx: target.x, ty: target.y };
    this.multiSelection = [];
    this.movePayload = null;
    this.moveStartTile = null;
    this.moveDelta = { dx: 0, dy: 0 };
    this.pruneMeta();
    this.commitHistory();
    this.renderSettings();
    this.draw();
  }

  startMoveMultiSelection(tx, ty) {
    this.movePayload = this.captureMultiSelection();
    this.moveStartTile = { tx, ty };
    this.moveDelta = { dx: 0, dy: 0 };
    this.isMovingSelection = true;
    this.setStatus(`Перемещение предметов: ${this.multiSelection.length}.`);
  }

  captureMultiSelection() {
    return this.selectedEntries().map((item) => ({
      tx: item.tx,
      ty: item.ty,
      tile: item.tile,
      meta: this.clone(item.meta ?? null),
    }));
  }

  finishMoveMultiSelection() {
    if (!Array.isArray(this.movePayload) || this.movePayload.length === 0 || (this.moveDelta.dx === 0 && this.moveDelta.dy === 0)) {
      this.movePayload = null;
      this.moveStartTile = null;
      this.moveDelta = { dx: 0, dy: 0 };
      this.draw();
      return;
    }
    const nextSelection = [];
    this.movePayload.forEach((item) => {
      this.grid[item.ty][item.tx] = ".";
      this.removeMeta(item.tx, item.ty);
    });
    this.movePayload.forEach((item) => {
      const tx = Math.max(1, Math.min(this.width - 2, item.tx + this.moveDelta.dx));
      const ty = Math.max(1, Math.min(this.height - 4, item.ty + this.moveDelta.dy));
      this.grid[ty][tx] = item.tile;
      if (item.meta) this.meta[this.metaKey(tx, ty)] = this.clone(item.meta);
      nextSelection.push({ tx, ty });
    });
    this.multiSelection = nextSelection;
    this.selectedTile = this.multiSelection[0] ?? null;
    this.selection = null;
    this.movePayload = null;
    this.moveStartTile = null;
    this.moveDelta = { dx: 0, dy: 0 };
    this.pruneMeta();
    this.commitHistory();
    this.renderSettings();
    this.draw();
  }

  rectFromPoints(ax, ay, bx, by) {
    const x = Math.min(ax, bx);
    const y = Math.min(ay, by);
    return this.clampSelectionRect({ x, y, w: Math.abs(ax - bx) + 1, h: Math.abs(ay - by) + 1 });
  }

  clampSelectionRect(rect) {
    const w = Math.max(1, Math.min(rect.w, this.width - 2));
    const h = Math.max(1, Math.min(rect.h, this.height - 4));
    const x = Math.max(1, Math.min(rect.x, this.width - w - 1));
    const y = Math.max(1, Math.min(rect.y, this.height - h - 3));
    return { x, y, w, h };
  }

  tileInsideSelection(tx, ty, selection) {
    return tx >= selection.x && tx < selection.x + selection.w && ty >= selection.y && ty < selection.y + selection.h;
  }

  toggleMultiSelection(tx, ty) {
    if (tx <= 0 || ty <= 0 || tx >= this.width - 1 || ty >= this.height - 3) return;
    const tile = this.grid[ty]?.[tx];
    if (!tile || tile === ".") {
      this.setStatus("Пустой тайл не добавлен в мультивыбор.");
      return;
    }
    const index = this.multiSelection.findIndex((item) => item.tx === tx && item.ty === ty);
    if (index >= 0) this.multiSelection.splice(index, 1);
    else this.multiSelection.push({ tx, ty });
    this.selection = null;
    this.selectedTile = this.multiSelection[0] ?? null;
    this.pasteArmed = false;
    this.renderSettings();
    this.draw();
    this.setStatus(`Мультивыбор: ${this.multiSelection.length}.`);
  }

  hasMultiSelection() {
    return this.multiSelection.length > 1;
  }

  selectedEntries() {
    return this.multiSelection
      .map(({ tx, ty }) => ({ tx, ty, tile: this.grid[ty]?.[tx], meta: this.meta[this.metaKey(tx, ty)] }))
      .filter((item) => item.tile && item.tile !== ".");
  }

  multiSelectionTypeInfo() {
    const entries = this.selectedEntries();
    if (entries.length < 2) return { entries, same: false, mixed: false };
    const first = entries[0];
    const firstType = first.meta?.type ?? first.tile;
    const same = entries.every((item) => item.tile === first.tile && (item.meta?.type ?? item.tile) === firstType);
    return { entries, same, mixed: !same, tile: first.tile, type: firstType, meta: first.meta };
  }

  hasMixedMultiSelection() {
    return this.multiSelectionTypeInfo().mixed;
  }

  captureSelection(selection) {
    const payload = {
      w: selection.w,
      h: selection.h,
      tiles: [],
      meta: {},
    };
    for (let y = 0; y < selection.h; y += 1) {
      const row = [];
      for (let x = 0; x < selection.w; x += 1) {
        const tx = selection.x + x;
        const ty = selection.y + y;
        row.push(this.grid[ty][tx]);
        const meta = this.meta[this.metaKey(tx, ty)];
        if (meta) payload.meta[this.metaKey(x, y)] = this.clone(meta);
      }
      payload.tiles.push(row);
    }
    return payload;
  }

  clearArea(selection) {
    for (let y = 0; y < selection.h; y += 1) {
      for (let x = 0; x < selection.w; x += 1) {
        const tx = selection.x + x;
        const ty = selection.y + y;
        this.grid[ty][tx] = ".";
        this.removeMeta(tx, ty);
      }
    }
  }

  deleteSelected() {
    if (this.multiSelection.length > 0) {
      this.multiSelection.forEach(({ tx, ty }) => {
        if (tx <= 0 || ty <= 0 || tx >= this.width - 1 || ty >= this.height - 3) return;
        this.grid[ty][tx] = ".";
        this.removeMeta(tx, ty);
      });
      const count = this.multiSelection.length;
      this.multiSelection = [];
      this.selectedTile = null;
      this.selection = null;
      this.commitHistory();
      this.renderSettings();
      this.draw();
      this.setStatus(`Удалено предметов: ${count}.`);
      return;
    }
    if (this.selection) {
      this.clearArea(this.selection);
      this.selectedTile = null;
      this.selection = null;
      this.commitHistory();
      this.renderSettings();
      this.draw();
      this.setStatus("Выделенная область удалена.");
      return;
    }
    if (!this.selectedTile) return;
    const { tx, ty } = this.selectedTile;
    this.grid[ty][tx] = ".";
    this.removeMeta(tx, ty);
    this.selectedTile = null;
    this.commitHistory();
    this.renderSettings();
    this.draw();
  }

  applyAreaPayload(payload, targetX, targetY) {
    for (let y = 0; y < payload.h; y += 1) {
      for (let x = 0; x < payload.w; x += 1) {
        const tx = targetX + x;
        const ty = targetY + y;
        if (tx <= 0 || ty <= 0 || tx >= this.width - 1 || ty >= this.height - 3) continue;
        this.grid[ty][tx] = payload.tiles[y][x];
        this.removeMeta(tx, ty);
        const meta = payload.meta[this.metaKey(x, y)];
        if (meta) this.meta[this.metaKey(tx, ty)] = this.clone(meta);
      }
    }
  }

  pasteClipboard(tx, ty) {
    if (!this.clipboard) return;
    if (this.clipboard.type === "area") {
      const target = this.clampSelectionRect({ x: tx, y: ty, w: this.clipboard.payload.w, h: this.clipboard.payload.h });
      this.applyAreaPayload(this.clipboard.payload, target.x, target.y);
      this.selection = target;
      this.selectedTile = { tx: target.x, ty: target.y };
      this.pasteArmed = false;
      this.commitHistory();
      this.renderSettings();
      this.draw();
      this.setStatus(`Область вставлена в ${target.x}, ${target.y}.`);
      return;
    }
    this.place(tx, ty, this.clipboard.tile, { meta: this.clipboard.meta });
    this.pasteArmed = false;
    this.setStatus(`Копия вставлена в ${tx}, ${ty}.`);
  }

  copySelected() {
    if (this.multiSelection.length > 1) {
      const entries = this.selectedEntries();
      const minX = Math.min(...entries.map((item) => item.tx));
      const minY = Math.min(...entries.map((item) => item.ty));
      const maxX = Math.max(...entries.map((item) => item.tx));
      const maxY = Math.max(...entries.map((item) => item.ty));
      const payload = { w: maxX - minX + 1, h: maxY - minY + 1, tiles: [], meta: {} };
      for (let y = 0; y < payload.h; y += 1) payload.tiles.push(Array.from({ length: payload.w }, () => "."));
      entries.forEach((item) => {
        const x = item.tx - minX;
        const y = item.ty - minY;
        payload.tiles[y][x] = item.tile;
        if (item.meta) payload.meta[this.metaKey(x, y)] = this.clone(item.meta);
      });
      this.clipboard = { type: "area", payload };
      this.setStatus(`Скопировано предметов: ${entries.length}. Ctrl+V, потом кликни место вставки.`);
      return;
    }
    if (this.selection && (this.selection.w > 1 || this.selection.h > 1)) {
      this.clipboard = {
        type: "area",
        payload: this.captureSelection(this.selection),
      };
      this.setStatus(`Скопирована область ${this.selection.w}x${this.selection.h}. Ctrl+V, потом кликни место вставки.`);
      return;
    }
    if (!this.selectedTile) return;
    const { tx, ty } = this.selectedTile;
    const tile = this.grid[ty]?.[tx];
    if (!tile || tile === ".") {
      this.setStatus("Нечего копировать: выбран пустой тайл.");
      return;
    }
    this.clipboard = {
      type: "tile",
      tile,
      meta: this.clone(this.meta[this.metaKey(tx, ty)] ?? null),
    };
    this.setStatus(`Скопировано: ${TOOL_BY_ID.get(tile)?.label ?? tile}. Ctrl+V, потом кликни место вставки.`);
  }

  armPaste() {
    if (!this.clipboard) {
      this.setStatus("Буфер пуст. Выдели объект и нажми Ctrl+C.");
      return;
    }
    this.pasteArmed = true;
    this.setMode("insert", { keepPaste: true, silent: true });
    const label = this.clipboard.type === "area" ? `область ${this.clipboard.payload.w}x${this.clipboard.payload.h}` : TOOL_BY_ID.get(this.clipboard.tile)?.label ?? this.clipboard.tile;
    this.setStatus(`Вставка копии: ${label}. Кликни по нужному тайлу.`);
  }

  handleKeyboard(event) {
    if (!this.isVisible()) return;
    if (this.isTypingControl(event.target)) return;
    if (event.code === "Delete") {
      event.preventDefault();
      this.deleteSelected();
      return;
    }
    if (!event.ctrlKey) return;

    if (event.code === "KeyZ" && event.shiftKey) {
      event.preventDefault();
      this.redo();
      return;
    }

    if (event.code === "KeyZ") {
      event.preventDefault();
      this.undo();
      return;
    }

    if (event.code === "KeyY") {
      event.preventDefault();
      this.redo();
      return;
    }

    if (event.code === "KeyC") {
      event.preventDefault();
      this.copySelected();
      return;
    }

    if (event.code === "KeyV") {
      event.preventDefault();
      this.armPaste();
    }
  }

  controlWaitsForEnter(target) {
    return target?.matches?.("input[type='text'], input[type='number']");
  }

  isTypingControl(target) {
    return target?.matches?.("input, textarea, select");
  }

  isVisible() {
    const overlay = this.canvas.closest(".editor-overlay");
    return overlay && !overlay.hidden;
  }

  commitHistory(options = {}) {
    const snapshot = this.snapshot();
    const last = this.history[this.history.length - 1];
    if (last && JSON.stringify(last) === JSON.stringify(snapshot)) {
      this.refreshHistoryButtons();
      return;
    }
    this.history.push(snapshot);
    if (this.history.length > this.maxHistory) this.history.shift();
    if (options.clearRedo !== false) this.redoStack.length = 0;
    this.refreshHistoryButtons();
  }

  undo() {
    if (this.history.length <= 1) return;
    const current = this.history.pop();
    this.redoStack.push(current);
    this.restoreSnapshot(this.history[this.history.length - 1]);
    this.setStatus("Отменено предыдущее действие.");
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const snapshot = this.redoStack.pop();
    this.history.push(snapshot);
    this.restoreSnapshot(snapshot);
    this.setStatus("Действие возвращено.");
  }

  snapshot() {
    return {
      width: this.width,
      height: this.height,
      grid: this.grid.map((row) => row.join("")),
      meta: this.clone(this.meta),
      settings: this.clone(this.settings),
    };
  }

  restoreSnapshot(snapshot) {
    this.width = snapshot.width;
    this.height = snapshot.height;
    this.grid = snapshot.grid.map((row) => row.split(""));
    this.meta = this.clone(snapshot.meta ?? {});
    this.settings = { ...DEFAULT_SETTINGS, ...(snapshot.settings ?? {}) };
    this.selectedTile = null;
    this.selection = null;
    this.multiSelection = [];
    this.selectionDraft = null;
    this.movePayload = null;
    this.pasteArmed = false;
    this.syncSizeInputs();
    this.clampCamera();
    this.renderSettings();
    this.refreshHistoryButtons();
    this.draw();
  }

  refreshHistoryButtons() {
    if (this.undoButton) this.undoButton.disabled = this.history.length <= 1;
    if (this.redoButton) this.redoButton.disabled = this.redoStack.length === 0;
  }

  clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  clearTool(value) {
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        if (this.grid[y][x] === value) {
          this.grid[y][x] = ".";
          this.removeMeta(x, y);
        }
      }
    }
  }

  createMetadataForTool(value) {
    if (value === "O") {
      return {
        type: "saw",
        axis: this.settings.sawAxis,
        spanTiles: this.settings.sawSpanTiles,
        speed: this.settings.sawSpeed,
        active: this.settings.sawActive,
      };
    }
    if (value === "R") {
      return {
        type: "turret",
        aggression: this.settings.rocketAggression,
        radiusTiles: this.settings.turretRadiusTiles,
        rocketSpeed: this.settings.turretRocketSpeed,
        cooldownFrames: this.settings.turretCooldownFrames,
        active: this.settings.rocketActive,
      };
    }
    if (value === "N") {
      return {
        type: "robot",
        direction: this.settings.robotDirection,
        maxSpeed: this.settings.robotSpeed,
        cooldownFrames: this.settings.robotCooldownFrames,
        acceleration: 0.08,
      };
    }
    if (value === "Q") {
      return {
        type: "flier",
        direction: this.settings.flierDirection,
        speed: this.settings.flierSpeed,
        areaWidthTiles: this.settings.flierAreaWidthTiles,
        areaHeightTiles: this.settings.flierAreaHeightTiles,
      };
    }
    if (value === "J") {
      return {
        type: "mazeBot",
        direction: this.settings.mazeBotDirection,
        speed: this.settings.mazeBotSpeed,
      };
    }
    if (value === "L") {
      return {
        type: "laser",
        radiusTiles: this.settings.laserRadiusTiles,
        active: this.settings.laserActive,
      };
    }
    if (value === "W") {
      return {
        type: "wallMine",
        side: this.settings.wallMineSide,
        active: true,
      };
    }
    if (value === "Y") {
      return {
        type: "slope",
        rotation: Number(this.settings.slopeRotation ?? 0),
        sizeTiles: Number(this.settings.slopeSizeTiles ?? 1),
      };
    }
    if (value === "H") {
      return {
        type: "hiddenSpike",
        tiles: 1,
        active: false,
      };
    }
    if (value === "G") {
      return {
        type: "coinGate",
        requiredCount: this.settings.gateRequiredCount,
      };
    }
    if (value === "V") {
      return {
        type: "textZone",
        wTiles: this.settings.textZoneWidthTiles,
        hTiles: this.settings.textZoneHeightTiles,
        text: this.settings.textZoneText,
      };
    }
    if (value === "A") {
      return {
        type: "label",
        text: this.settings.visualText,
        size: this.settings.visualTextSize,
      };
    }
    if (value === "Z" || value === "B") {
      return {
        type: value === "Z" ? "trigger" : "button",
        wTiles: this.settings.triggerWidthTiles,
        hTiles: this.settings.triggerHeightTiles,
        visible: true,
        once: true,
        activateRockets: this.settings.activateRockets,
        activateSaws: this.settings.activateSaws,
        activateHiddenSpikes: this.settings.activateHiddenSpikes,
        activateLasers: this.settings.activateLasers,
      };
    }
    return {};
  }

  resizeFromInputs() {
    const nextWidth = this.clampSize(Number(this.widthInput.value));
    const nextHeight = this.clampSize(Number(this.heightInput.value));
    this.resize(nextWidth, nextHeight);
  }

  resize(nextWidth, nextHeight) {
    const oldGrid = this.grid;
    const nextGrid = Array.from({ length: nextHeight }, (_, y) =>
      Array.from({ length: nextWidth }, (_, x) => oldGrid[y]?.[x] ?? "."),
    );
    this.width = nextWidth;
    this.height = nextHeight;
    this.grid = nextGrid;
    this.applyBorders(this.grid);
    this.pruneMeta();
    this.syncSizeInputs();
    this.clampCamera();
    this.commitHistory();
    this.draw();
    this.setStatus(`Размер уровня: ${this.width}x${this.height}.`);
  }

  clampSize(value) {
    if (!Number.isFinite(value)) return DEFAULT_WIDTH;
    return Math.max(MIN_SIZE, Math.min(MAX_SIZE, Math.round(value)));
  }

  syncSizeInputs() {
    this.widthInput.value = String(this.width);
    this.heightInput.value = String(this.height);
  }

  save() {
    this.pruneMeta();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      width: this.width,
      height: this.height,
      grid: this.grid.map((row) => row.join("")),
      settings: this.settings,
      meta: this.meta,
    }));
    this.setStatus("Сохранено в браузере.");
  }

  async saveLevelModule(fileName = DEFAULT_LEVEL_FILE, options = {}) {
    const safeName = this.safeFileName(fileName);
    const code = this.createLevelModule(safeName, options);
    const serverResult = await this.saveLevelModuleViaServer(safeName, code, options);
    if (serverResult.ok) {
      this.setStatus(`Файл уровня сохранен: ${serverResult.path}`);
      return serverResult;
    }

    await this.saveLevelModuleViaBrowser(safeName, code);
    this.setStatus(`Сервер без записи. Файл ${safeName}.js сохранен через браузер.`);
    return { ok: true, path: `${safeName}.js`, mode: "browser" };
  }

  async saveLevelModuleViaServer(fileName, code, options = {}) {
    try {
      const response = await fetch("/__save-level", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fileName, code, collection: options.collection ?? "custom" }),
      });
      if (!response.ok) return { ok: false };
      return await response.json();
    } catch {
      return { ok: false };
    }
  }

  async saveLevelModuleViaBrowser(fileName, code) {
    const blob = new Blob([code], { type: "text/javascript;charset=utf-8" });
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: `${fileName}.js`,
          types: [{ description: "JavaScript level module", accept: { "text/javascript": [".js"] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (error) {
        if (error.name === "AbortError") throw error;
      }
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.js`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  createLevelModule(fileName, options = {}) {
    const exportName = options.exportName ?? this.levelExportName(fileName);
    const levelData = this.exportLevelData();
    return `export const ${exportName} = Object.freeze(${JSON.stringify(levelData, null, 2)});\n`;
  }

  safeFileName(value) {
    const fallback = DEFAULT_LEVEL_FILE;
    return String(value || fallback)
      .trim()
      .replace(/\.js$/i, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || fallback;
  }

  levelExportName(fileName) {
    const words = this.safeFileName(fileName).split(/[-_]+/).filter(Boolean);
    const name = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("") || "CustomLevel";
    return /^[A-Za-z_$]/.test(name) ? name : `Level${name}`;
  }

  getLevelName() {
    return this.settings.levelName || "Пользовательский уровень";
  }

  setLevelName(name) {
    this.settings.levelName = String(name || "Пользовательский уровень").trim() || "Пользовательский уровень";
    this.renderSettings();
  }

  load() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;
    try {
      const data = JSON.parse(saved);
      if (!Array.isArray(data.grid)) return false;
      const width = this.clampSize(data.width ?? data.grid[0]?.length ?? DEFAULT_WIDTH);
      const height = this.clampSize(data.height ?? data.grid.length ?? DEFAULT_HEIGHT);
      this.width = width;
      this.height = height;
      this.grid = Array.from({ length: height }, (_, y) =>
        (data.grid[y] ?? "").padEnd(width, ".").slice(0, width).split(""),
      );
      const savedSettings = data.settings ?? {};
      const modernScale = savedSettings.tuningScale === 15 || savedSettings.accelerationLevel !== undefined || savedSettings.verticalLevel !== undefined || savedSettings.wallJumpLevel !== undefined;
      this.settings = this.migrateSettings({ ...DEFAULT_SETTINGS, ...savedSettings }, modernScale);
      this.meta = data.meta ?? {};
      this.applyBorders(this.grid);
      this.pruneMeta();
      this.renderSettings();
      this.setStatus("Загружен сохраненный уровень.");
      return true;
    } catch {
      this.setStatus("Не удалось загрузить сохранение.");
      return false;
    }
  }

  importLevelData(levelData) {
    this.width = this.clampSize(levelData.map?.[0]?.length ?? DEFAULT_WIDTH);
    this.height = this.clampSize(levelData.map?.length ?? DEFAULT_HEIGHT);
    this.grid = Array.from({ length: this.height }, (_, y) =>
      (levelData.map?.[y] ?? "").padEnd(this.width, ".").slice(0, this.width).split(""),
    );
    this.meta = {};
    const tuning = levelData.playerTuning ?? {};
    const modernScale = tuning.tuningScale === 15 || tuning.accelerationLevel !== undefined || tuning.verticalLevel !== undefined || tuning.wallJumpLevel !== undefined;
    this.settings = {
      ...DEFAULT_SETTINGS,
      levelName: levelData.name ?? DEFAULT_SETTINGS.levelName,
      speedLevel: this.migrateTuningLevel(tuning.speedLevel, DEFAULT_SETTINGS.speedLevel, !modernScale),
      jumpLevel: this.migrateTuningLevel(tuning.jumpLevel, DEFAULT_SETTINGS.jumpLevel, !modernScale),
      accelerationLevel: this.migrateTuningLevel(tuning.accelerationLevel, DEFAULT_SETTINGS.accelerationLevel, false),
      verticalLevel: this.migrateTuningLevel(tuning.verticalLevel, DEFAULT_SETTINGS.verticalLevel, false),
      wallJumpLevel: this.migrateTuningLevel(tuning.wallJumpLevel, DEFAULT_SETTINGS.wallJumpLevel, false),
      cameraDeadZoneWidth: levelData.camera?.deadZoneWidth ?? DEFAULT_SETTINGS.cameraDeadZoneWidth,
      cameraDeadZoneHeight: levelData.camera?.deadZoneHeight ?? DEFAULT_SETTINGS.cameraDeadZoneHeight,
      cameraStartOffsetX: levelData.camera?.startOffsetX ?? DEFAULT_SETTINGS.cameraStartOffsetX,
      cameraStartOffsetY: levelData.camera?.startOffsetY ?? DEFAULT_SETTINGS.cameraStartOffsetY,
      physicsMode: levelData.physicsMode ?? DEFAULT_SETTINGS.physicsMode,
      difficulty: Math.max(1, Math.min(5, Number(levelData.difficulty ?? DEFAULT_SETTINGS.difficulty))),
      physicsOverrides: this.clone(levelData.physicsOverrides ?? {}),
    };

    this.importHazards(levelData.hazards ?? {});
    this.importTriggers(levelData.triggers ?? []);
    this.importTextZones(levelData.textZones ?? []);
    this.importLabels(levelData.labels ?? []);
    this.importButtonMetadata(levelData.buttonActions ?? {});
    this.pruneMeta();
    this.selectedTile = null;
    this.selection = null;
    this.pasteArmed = false;
    this.syncSizeInputs();
    this.clampCamera();
    this.history = [];
    this.redoStack = [];
    this.commitHistory({ clearRedo: true });
    this.renderSettings();
    this.draw();
  }

  importHazards(hazards) {
    (hazards.saws ?? []).forEach((saw) => {
      this.placeImportedMeta(saw.tx, saw.ty, "O", {
        type: "saw",
        axis: saw.axis ?? "x",
        spanTiles: saw.spanTiles ?? 3,
        speed: saw.speed ?? 1,
        active: saw.active ?? true,
      });
    });
    (hazards.rockets ?? []).forEach((rocket) => {
      this.placeImportedMeta(rocket.tx, rocket.ty, "R", {
        type: "turret",
        active: rocket.active ?? false,
        aggression: rocket.aggression ?? 8,
        radiusTiles: rocket.radiusTiles ?? 10,
        rocketSpeed: rocket.maxSpeed ?? rocket.rocketSpeed ?? 4.2,
        cooldownFrames: rocket.cooldownFrames ?? 120,
      });
    });
    (hazards.turrets ?? []).forEach((turret) => {
      this.placeImportedMeta(turret.tx, turret.ty, "R", {
        type: "turret",
        active: turret.active ?? true,
        aggression: turret.aggression ?? 8,
        radiusTiles: turret.radiusTiles ?? 10,
        rocketSpeed: turret.rocketSpeed ?? turret.maxSpeed ?? 4.2,
        cooldownFrames: turret.cooldownFrames ?? 120,
      });
    });
    (hazards.robots ?? []).forEach((robot) => {
      this.placeImportedMeta(robot.tx, robot.ty, "N", {
        type: "robot",
        direction: robot.direction ?? "right",
        maxSpeed: robot.maxSpeed ?? 2.2,
        cooldownFrames: robot.cooldownFrames ?? 90,
        acceleration: robot.acceleration ?? 0.08,
      });
    });
    (hazards.fliers ?? []).forEach((flier) => {
      this.placeImportedMeta(flier.tx, flier.ty, "Q", {
        type: "flier",
        direction: flier.direction ?? "right",
        speed: flier.speed ?? 0.8,
        areaWidthTiles: flier.areaWidthTiles ?? 6,
        areaHeightTiles: flier.areaHeightTiles ?? 4,
      });
    });
    (hazards.mazeBots ?? []).forEach((bot) => {
      this.placeImportedMeta(bot.tx, bot.ty, "J", {
        type: "mazeBot",
        direction: bot.direction ?? "right",
        speed: bot.speed ?? 0.72,
      });
    });
    (hazards.mines ?? []).forEach((mine) => {
      this.placeImportedMeta(mine.tx, mine.ty, "I", null);
    });
    (hazards.wallMines ?? []).forEach((mine) => {
      this.placeImportedMeta(mine.tx, mine.ty, "W", {
        type: "wallMine",
        side: mine.side ?? mine.placement ?? "floor",
        active: mine.active ?? true,
      });
    });
    (hazards.lasers ?? []).forEach((laser) => {
      this.placeImportedMeta(laser.tx, laser.ty, "L", {
        type: "laser",
        radiusTiles: laser.radiusTiles ?? 12,
        active: laser.active ?? true,
      });
    });
    (hazards.slopes ?? []).forEach((slope) => {
      this.placeImportedMeta(slope.tx, slope.ty, "Y", {
        type: "slope",
        rotation: Number(slope.rotation ?? 0),
        sizeTiles: Number(slope.sizeTiles ?? 1),
      });
    });
    (hazards.hiddenSpikes ?? []).forEach((spike) => {
      this.placeImportedMeta(spike.tx, spike.ty, "H", {
        type: "hiddenSpike",
        tiles: spike.tiles ?? 1,
        active: spike.active ?? false,
      });
    });
    (hazards.bombs ?? []).forEach((bomb) => {
      this.placeImportedMeta(bomb.tx, bomb.ty, "X", null);
    });
  }

  importTriggers(triggers) {
    triggers.forEach((trigger) => {
      const tx = Math.min(this.width - 2, Math.max(1, trigger.tx + Math.floor((trigger.wTiles ?? 3) / 2)));
      const ty = Math.min(this.height - 4, Math.max(1, trigger.ty + Math.floor((trigger.hTiles ?? 3) / 2)));
      this.placeImportedMeta(tx, ty, "Z", {
        type: "trigger",
        wTiles: trigger.wTiles ?? 3,
        hTiles: trigger.hTiles ?? 3,
        visible: trigger.visible ?? true,
        once: trigger.once ?? true,
        activateRockets: Boolean(trigger.actions?.activateRockets?.length),
        activateSaws: Boolean(trigger.actions?.activateSaws?.length),
        activateHiddenSpikes: Boolean(trigger.actions?.activateHiddenSpikes?.length),
        activateLasers: Boolean(trigger.actions?.activateLasers?.length),
      });
    });
  }

  importTextZones(textZones) {
    textZones.forEach((zone) => {
      const tx = Math.min(this.width - 2, Math.max(1, zone.tx + Math.floor((zone.wTiles ?? 3) / 2)));
      const ty = Math.min(this.height - 4, Math.max(1, zone.ty + Math.floor((zone.hTiles ?? 3) / 2)));
      this.placeImportedMeta(tx, ty, "V", {
        type: "textZone",
        wTiles: zone.wTiles ?? 3,
        hTiles: zone.hTiles ?? 3,
        text: zone.text ?? "",
      });
    });
  }

  importLabels(labels) {
    labels.forEach((label) => {
      const size = Math.max(8, Math.min(32, Number(label.size ?? 13)));
      const tx = Math.min(this.width - 2, Math.max(1, Math.round(Number(label.x ?? 0) / this.baseTile)));
      const ty = Math.min(this.height - 4, Math.max(1, Math.round((Number(label.y ?? 0) - size) / this.baseTile)));
      this.placeImportedMeta(tx, ty, "A", {
        type: "label",
        text: label.text ?? "",
        size,
      });
    });
  }

  importButtonMetadata(buttonActions) {
    let index = 0;
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        if (this.grid[y][x] !== "B") continue;
        const actions = buttonActions[`button${index}`] ?? {};
        this.meta[this.metaKey(x, y)] = {
          type: "button",
          wTiles: 1,
          hTiles: 1,
          visible: true,
          once: true,
          activateRockets: Boolean(actions.activateRockets?.length),
          activateSaws: Boolean(actions.activateSaws?.length),
          activateHiddenSpikes: Boolean(actions.activateHiddenSpikes?.length),
          activateLasers: Boolean(actions.activateLasers?.length),
        };
        index += 1;
      }
    }
  }

  placeImportedMeta(tx, ty, tile, meta) {
    if (tx <= 0 || ty <= 0 || tx >= this.width - 1 || ty >= this.height - 3) return;
    this.grid[ty][tx] = tile;
    if (meta) this.meta[this.metaKey(tx, ty)] = this.clone(meta);
  }

  exportLevelData() {
    this.pruneMeta();
    const map = this.grid.map((row) => row.slice());
    const hazards = {
      hiddenSpikes: [],
      saws: [],
      rockets: [],
      turrets: [],
      robots: [],
      fliers: [],
      mazeBots: [],
      mines: [],
      wallMines: [],
      lasers: [],
      slopes: [],
      bombs: [],
    };
    const triggers = [];
    const textZones = [];
    const labels = [];
    const rawTriggers = [];
    const buttonMetas = [];
    const ids = {
      hiddenSpikes: [],
      saws: [],
      rockets: [],
      lasers: [],
    };
    let maxGateRequired = this.settings.gateRequiredCount;

    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const tile = map[y][x];
        const meta = this.meta[this.metaKey(x, y)] ?? this.createMetadataForTool(tile);

        if (tile === "B") buttonMetas.push(meta);
        if (tile === "G") maxGateRequired = Math.max(maxGateRequired, Number(meta.requiredCount ?? 3));

        if (tile === "O") {
          const id = `saw${hazards.saws.length}`;
          hazards.saws.push({
            id,
            tx: x,
            ty: y,
            r: 16,
            axis: meta.axis ?? "x",
            spanTiles: Number(meta.spanTiles ?? 3),
            speed: Number(meta.speed ?? 1),
            t: 0,
            active: Boolean(meta.active),
          });
          ids.saws.push(id);
          map[y][x] = ".";
        }

        if (tile === "R") {
          const id = `turret${hazards.turrets.length}`;
          const rocketTuning = this.rocketTuningForAggression(meta.aggression ?? 8);
          hazards.turrets.push({
            id,
            tx: x,
            ty: y,
            active: Boolean(meta.active),
            radiusTiles: Number(meta.radiusTiles ?? 10),
            rocketSpeed: Number((Number(meta.rocketSpeed ?? 4.2) * (rocketTuning.speedScale ?? 1)).toFixed(2)),
            cooldownFrames: Number(meta.cooldownFrames ?? 120),
            ...rocketTuning,
          });
          ids.rockets.push(id);
          map[y][x] = ".";
        }

        if (tile === "N") {
          hazards.robots.push({
            id: `robot${hazards.robots.length}`,
            tx: x,
            ty: y,
            direction: meta.direction ?? "right",
            maxSpeed: Number(meta.maxSpeed ?? 2.2),
            cooldownFrames: Number(meta.cooldownFrames ?? 90),
            acceleration: Number(meta.acceleration ?? 0.08),
          });
          map[y][x] = ".";
        }

        if (tile === "Q") {
          hazards.fliers.push({
            id: `flier${hazards.fliers.length}`,
            tx: x,
            ty: y,
            direction: meta.direction ?? "right",
            speed: Number(meta.speed ?? 0.8),
            areaWidthTiles: Math.max(1, Number(meta.areaWidthTiles ?? 6)),
            areaHeightTiles: Math.max(1, Number(meta.areaHeightTiles ?? 4)),
          });
          map[y][x] = ".";
        }

        if (tile === "J") {
          hazards.mazeBots.push({
            id: `mazeBot${hazards.mazeBots.length}`,
            tx: x,
            ty: y,
            direction: meta.direction ?? "right",
            speed: Number(meta.speed ?? 0.72),
          });
          map[y][x] = ".";
        }

        if (tile === "I") {
          hazards.mines.push({
            id: `mine${hazards.mines.length}`,
            tx: x,
            ty: y,
            active: true,
          });
          map[y][x] = ".";
        }

        if (tile === "W") {
          hazards.wallMines.push({
            id: `wallMine${hazards.wallMines.length}`,
            tx: x,
            ty: y,
            side: meta.side ?? "floor",
            active: meta.active ?? true,
          });
          map[y][x] = ".";
        }

        if (tile === "L") {
          const id = `laser${hazards.lasers.length}`;
          hazards.lasers.push({
            id,
            tx: x,
            ty: y,
            active: Boolean(meta.active),
            radiusTiles: Number(meta.radiusTiles ?? 12),
            chargeMs: 2000,
            fireMs: 230,
            cooldownMs: 850,
          });
          ids.lasers.push(id);
          map[y][x] = ".";
        }

        if (tile === "Y") {
          const sizeTiles = Math.max(1, Number(meta.sizeTiles ?? 1));
          hazards.slopes.push({
            id: `slope${hazards.slopes.length}`,
            tx: x,
            ty: y,
            rotation: Number(meta.rotation ?? 0),
            sizeTiles,
          });
          for (let sy = y; sy < Math.min(this.height, y + sizeTiles); sy += 1) {
            for (let sx = x; sx < Math.min(this.width, x + sizeTiles); sx += 1) {
              if (map[sy][sx] === "Y") map[sy][sx] = ".";
            }
          }
          map[y][x] = ".";
        }

        if (tile === "H") {
          const id = `hidden${hazards.hiddenSpikes.length}`;
          hazards.hiddenSpikes.push({
            id,
            tx: x,
            ty: y,
            tiles: Math.max(1, Number(meta.tiles ?? 1)),
            active: Boolean(meta.active),
          });
          ids.hiddenSpikes.push(id);
          map[y][x] = ".";
        }

        if (tile === "X") {
          hazards.bombs.push({
            id: `bomb${hazards.bombs.length}`,
            tx: x,
            ty: y,
            active: true,
          });
          map[y][x] = ".";
        }

        if (tile === "Z") {
          rawTriggers.push({ x, y, meta });
          map[y][x] = ".";
        }

        if (tile === "V") {
          textZones.push({
            id: `textZone${textZones.length}`,
            tx: Math.max(1, x - Math.floor((meta.wTiles ?? 3) / 2)),
            ty: Math.max(1, y - Math.floor((meta.hTiles ?? 3) / 2)),
            wTiles: Math.max(1, Number(meta.wTiles ?? 3)),
            hTiles: Math.max(1, Number(meta.hTiles ?? 3)),
            text: String(meta.text ?? ""),
          });
          map[y][x] = ".";
        }

        if (tile === "A") {
          const size = Math.max(8, Math.min(32, Number(meta.size ?? 13)));
          labels.push({
            text: String(meta.text ?? ""),
            x: x * this.baseTile,
            y: y * this.baseTile + size,
            size,
          });
          map[y][x] = ".";
        }
      }
    }

    rawTriggers.forEach((entry, index) => {
      triggers.push({
        id: `trigger${index}`,
        tx: Math.max(1, entry.x - Math.floor((entry.meta.wTiles ?? 3) / 2)),
        ty: Math.max(1, entry.y - Math.floor((entry.meta.hTiles ?? 3) / 2)),
        wTiles: Math.max(1, Number(entry.meta.wTiles ?? 3)),
        hTiles: Math.max(1, Number(entry.meta.hTiles ?? 3)),
        visible: entry.meta.visible ?? true,
        once: entry.meta.once ?? true,
        actions: this.actionsFromMeta(entry.meta, ids, "Триггер активировал выбранные ловушки."),
      });
    });

    const buttonActions = {};
    buttonMetas.forEach((meta, index) => {
      buttonActions[`button${index}`] = this.actionsFromMeta(meta, ids, "Кнопка активировала выбранные ловушки.");
    });

    if (!this.findTile(map, "P")) map[Math.max(1, this.height - 4)][Math.min(4, this.width - 2)] = "P";
    if (!this.findTile(map, "D")) map[Math.max(1, this.height - 4)][Math.max(1, this.width - 5)] = "D";

    return {
      name: this.settings.levelName || "Пользовательский уровень",
      requiresKeyForExit: this.findTile(map, "K") !== null,
      coinGateRequires: Math.max(1, Number(maxGateRequired ?? 3)),
      playerTuning: {
        tuningScale: 15,
        speedLevel: this.settings.speedLevel,
        accelerationLevel: this.settings.accelerationLevel,
        jumpLevel: this.settings.jumpLevel,
        verticalLevel: this.settings.verticalLevel,
        wallJumpLevel: this.settings.wallJumpLevel,
      },
      difficulty: Math.max(1, Math.min(5, Number(this.settings.difficulty ?? 1))),
      physicsMode: this.settings.physicsMode,
      physicsOverrides: this.clone(this.settings.physicsOverrides ?? {}),
      camera: {
        deadZoneWidth: this.settings.cameraDeadZoneWidth,
        deadZoneHeight: this.settings.cameraDeadZoneHeight,
        startOffsetX: this.settings.cameraStartOffsetX,
        startOffsetY: this.settings.cameraStartOffsetY,
      },
      map: map.map((row) => row.join("")),
      messages: ["Пользовательский уровень. Проверяй свои ловушки честно."],
      labels,
      buttonActions,
      coinActions: {},
      onKey: {},
      triggers,
      textZones,
      hazards,
    };
  }

  actionsFromMeta(meta, ids, message) {
    const actions = {};
    if (meta.activateRockets && ids.rockets.length) actions.activateRockets = ids.rockets;
    if (meta.activateSaws && ids.saws.length) actions.activateSaws = ids.saws;
    if (meta.activateHiddenSpikes && ids.hiddenSpikes.length) actions.activateHiddenSpikes = ids.hiddenSpikes;
    if (meta.activateLasers && ids.lasers.length) actions.activateLasers = ids.lasers;
    if (Object.keys(actions).length > 0) actions.message = message;
    return actions;
  }

  findTile(map, value) {
    for (let y = 0; y < map.length; y += 1) {
      for (let x = 0; x < map[y].length; x += 1) {
        if (map[y][x] === value) return { x, y };
      }
    }
    return null;
  }

  handleSettingsInput(event) {
    const target = event.target;
    const setting = target.dataset.setting;
    const metaField = target.dataset.metaField;
    const physicsField = target.dataset.physicsField;
    if (!setting && !metaField && !physicsField) return;

    const before = JSON.stringify(this.snapshot());

    if (setting) {
      this.settings[setting] = this.readControlValue(target);
    }

    if (metaField && this.selectedTile) {
      const batch = this.multiSelectionTypeInfo();
      if (batch.same) {
        batch.entries.forEach((entry) => {
          const meta = this.meta[this.metaKey(entry.tx, entry.ty)];
          if (meta) meta[metaField] = this.readControlValue(target);
        });
      } else {
        const meta = this.meta[this.metaKey(this.selectedTile.tx, this.selectedTile.ty)];
        if (meta) meta[metaField] = this.readControlValue(target);
      }
    }

    if (physicsField) {
      const mode = this.settings.physicsMode;
      this.settings.physicsOverrides ??= {};
      this.settings.physicsOverrides[mode] ??= {};
      this.settings.physicsOverrides[mode][physicsField] = this.readControlValue(target);
    }

    if (JSON.stringify(this.snapshot()) !== before) this.commitHistory();
    if (target.type !== "text") this.renderSettings();
    this.draw();
  }

  readControlValue(target) {
    if (target.type === "checkbox") return target.checked;
    if (target.type === "number" || target.type === "range") return Number(target.value);
    return target.value;
  }

  renderSettings() {
    const tool = TOOL_BY_ID.get(this.activeTool);
    const selected = this.getSelectedInfo();
    const content = {
      level: this.renderPlayerTuning(),
      tool: this.renderToolSettings(),
      selected: this.renderSelectedSettings(selected),
    }[this.settingsTab] ?? this.renderPlayerTuning();
    this.settingsEl.innerHTML = `
      <div class="editor-card-title">
        <span>Настройки</span>
        <small>${tool?.label ?? this.activeTool}</small>
      </div>
      <div class="settings-tabs">
        ${this.settingsTabButton("level", "Уровень", "MAP")}
        ${this.settingsTabButton("tool", "Инструмент", "TOOL")}
        ${this.settingsTabButton("selected", "Выбор", "SEL")}
      </div>
      <div class="settings-tab-body">
        ${content}
      </div>
    `;
  }

  settingsTabButton(id, label, icon) {
    const danger = id === "selected" && this.hasMixedMultiSelection();
    return `
      <button class="settings-tab ${this.settingsTab === id ? "is-active" : ""} ${danger ? "is-danger" : ""}" type="button" data-settings-tab="${id}">
        <b>${icon}</b>
        <span>${label}</span>
      </button>
    `;
  }

  renderPlayerTuning() {
    const modeOptions = Object.entries(GameConfig.physicsProfiles).map(([id, profile]) => [id, profile.label ?? id]);
    const physics = this.currentPhysicsValues();
    return `
      <div class="settings-section">
        <h3>Уровень</h3>
        ${this.textControl("Название", "levelName", this.settings.levelName)}
        ${this.rangeControl("Сложность", "difficulty", 1, 5, 1, this.settings.difficulty)}
      </div>
      <div class="settings-section">
        <h3>Физика уровня</h3>
        ${this.selectControl("Режим уровня", "physicsMode", this.settings.physicsMode, modeOptions)}
        ${this.rangeControl("Макс. скорость", "speedLevel", 1, 15, 1, this.settings.speedLevel)}
        ${this.rangeControl("Набор скорости", "accelerationLevel", 1, 15, 1, this.settings.accelerationLevel)}
        ${this.rangeControl("Прыжок", "jumpLevel", 1, 15, 1, this.settings.jumpLevel)}
        ${this.rangeControl("Вертикальная физика", "verticalLevel", 1, 15, 1, this.settings.verticalLevel)}
        ${this.rangeControl("Прыжок от стены", "wallJumpLevel", 1, 15, 1, this.settings.wallJumpLevel)}
      </div>
      <details class="settings-section physics-drawer">
        <summary>Точная настройка ${GameConfig.physicsProfiles[this.settings.physicsMode]?.label ?? this.settings.physicsMode}</summary>
        <button class="editor-mode-button physics-reset-button" type="button" data-physics-reset="true">Сбросить цифры режима</button>
        <div class="physics-grid">
          ${PHYSICS_FIELDS.map(([label, field, min, max, step]) => this.physicsNumberControl(label, field, min, max, step, physics[field])).join("")}
        </div>
      </details>
      <div class="settings-section">
        <h3>Камера игры</h3>
        ${this.numberControl("Зона X, px", "cameraDeadZoneWidth", 80, 760, 10, this.settings.cameraDeadZoneWidth)}
        ${this.numberControl("Зона Y, px", "cameraDeadZoneHeight", 60, 420, 10, this.settings.cameraDeadZoneHeight)}
        ${this.numberControl("Старт X, px", "cameraStartOffsetX", -900, 900, 10, this.settings.cameraStartOffsetX)}
        ${this.numberControl("Старт Y, px", "cameraStartOffsetY", -500, 500, 10, this.settings.cameraStartOffsetY)}
      </div>
    `;
  }

  currentPhysicsValues() {
    const mode = this.settings.physicsMode;
    return {
      ...(GameConfig.physicsProfiles[mode] ?? GameConfig.physicsProfiles.classic),
      ...(this.settings.physicsOverrides?.[mode] ?? {}),
    };
  }

  migrateSettings(settings, modernScale = true) {
    return {
      ...settings,
      tuningScale: 15,
      speedLevel: this.migrateTuningLevel(settings.speedLevel, DEFAULT_SETTINGS.speedLevel, !modernScale),
      jumpLevel: this.migrateTuningLevel(settings.jumpLevel, DEFAULT_SETTINGS.jumpLevel, !modernScale),
      accelerationLevel: this.migrateTuningLevel(settings.accelerationLevel, DEFAULT_SETTINGS.accelerationLevel, false),
      verticalLevel: this.migrateTuningLevel(settings.verticalLevel, DEFAULT_SETTINGS.verticalLevel, false),
      wallJumpLevel: this.migrateTuningLevel(settings.wallJumpLevel, DEFAULT_SETTINGS.wallJumpLevel, false),
      robotCooldownFrames: settings.robotCooldownFrames ?? DEFAULT_SETTINGS.robotCooldownFrames,
      flierAreaWidthTiles: settings.flierAreaWidthTiles ?? DEFAULT_SETTINGS.flierAreaWidthTiles,
      flierAreaHeightTiles: settings.flierAreaHeightTiles ?? DEFAULT_SETTINGS.flierAreaHeightTiles,
      mazeBotSpeed: settings.mazeBotSpeed ?? DEFAULT_SETTINGS.mazeBotSpeed,
      mazeBotDirection: settings.mazeBotDirection ?? DEFAULT_SETTINGS.mazeBotDirection,
    };
  }

  migrateTuningLevel(value, fallback, migrateOldFivePointScale = false) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    if (migrateOldFivePointScale && numeric <= 5) return Math.max(10, Math.min(15, Math.round(10 + (numeric - 1) * 1.25)));
    return Math.max(1, Math.min(15, Math.round(numeric)));
  }

  resetPhysicsOverrides() {
    const mode = this.settings.physicsMode;
    if (this.settings.physicsOverrides?.[mode]) delete this.settings.physicsOverrides[mode];
    this.commitHistory();
    this.renderSettings();
    this.draw();
    this.setStatus(`Физика ${GameConfig.physicsProfiles[mode]?.label ?? mode}: сброшены ручные значения.`);
  }

  renderToolSettings() {
    if (this.activeTool === "L") {
      return `
        <div class="settings-section">
          <h3>Лазер</h3>
          ${this.numberControl("Радиус, тайлы", "laserRadiusTiles", 3, 40, 1, this.settings.laserRadiusTiles)}
          ${this.checkControl("Активен сразу", "laserActive", this.settings.laserActive)}
        </div>
      `;
    }

    if (this.activeTool === "O") {
      return `
        <div class="settings-section">
          <h3>Маршрут пилы</h3>
          ${this.selectControl("Ось", "sawAxis", this.settings.sawAxis, [["x", "горизонталь"], ["y", "вертикаль"]])}
          ${this.numberControl("Размах, тайлы", "sawSpanTiles", 0, 16, 1, this.settings.sawSpanTiles)}
          ${this.numberControl("Скорость", "sawSpeed", 0.2, 3, 0.1, this.settings.sawSpeed)}
          ${this.checkControl("Активна сразу", "sawActive", this.settings.sawActive)}
        </div>
      `;
    }

    if (this.activeTool === "R") {
      return `
        <div class="settings-section">
          <h3>Турель</h3>
          ${this.numberControl("Радиус, тайлы", "turretRadiusTiles", 2, 40, 1, this.settings.turretRadiusTiles)}
          ${this.numberControl("Скорость ракеты", "turretRocketSpeed", 1, 10, 0.1, this.settings.turretRocketSpeed)}
          ${this.numberControl("Пауза выстрела", "turretCooldownFrames", 20, 300, 5, this.settings.turretCooldownFrames)}
          ${this.rangeControl("Агрессивность", "rocketAggression", 1, 10, 1, this.settings.rocketAggression)}
          ${this.checkControl("Активна сразу", "rocketActive", this.settings.rocketActive)}
        </div>
      `;
    }

    if (this.activeTool === "N") {
      return `
        <div class="settings-section">
          <h3>Робот</h3>
          ${this.selectControl("Смотрит", "robotDirection", this.settings.robotDirection, [["right", "вправо"], ["left", "влево"]])}
          ${this.numberControl("Макс. скорость", "robotSpeed", 0.5, 6, 0.1, this.settings.robotSpeed)}
          ${this.numberControl("Пауза после удара, кадры", "robotCooldownFrames", 0, 300, 5, this.settings.robotCooldownFrames)}
        </div>
      `;
    }

    if (this.activeTool === "Q") {
      return `
        <div class="settings-section">
          <h3>Летающий робот</h3>
          ${this.selectControl("Старт", "flierDirection", this.settings.flierDirection, [["right", "вправо"], ["up", "вверх"], ["left", "влево"], ["down", "вниз"]])}
          ${this.numberControl("Скорость", "flierSpeed", 0.2, 3, 0.1, this.settings.flierSpeed)}
          ${this.numberControl("Область X, тайлы", "flierAreaWidthTiles", 1, 30, 1, this.settings.flierAreaWidthTiles)}
          ${this.numberControl("Область Y, тайлы", "flierAreaHeightTiles", 1, 30, 1, this.settings.flierAreaHeightTiles)}
        </div>
      `;
    }

    if (this.activeTool === "J") {
      return `
        <div class="settings-section">
          <h3>Черный робот</h3>
          ${this.selectControl("Старт", "mazeBotDirection", this.settings.mazeBotDirection, [["right", "вправо"], ["up", "вверх"], ["left", "влево"], ["down", "вниз"]])}
          ${this.numberControl("Скорость", "mazeBotSpeed", 0.2, 3, 0.1, this.settings.mazeBotSpeed)}
          <p>Бродит по лабиринту и выбирает менее посещенные коридоры.</p>
        </div>
      `;
    }

    if (this.activeTool === "W") {
      return `
        <div class="settings-section">
          <h3>Настенная мина</h3>
          ${this.selectControl("Клеится к", "wallMineSide", this.settings.wallMineSide, [["floor", "пол"], ["ceiling", "потолок"], ["left", "левая стена"], ["right", "правая стена"]])}
        </div>
      `;
    }

    if (this.activeTool === "Y") {
      return `
        <div class="settings-section">
          <h3>Склон 45</h3>
          ${this.selectControl("Поворот", "slopeRotation", String(this.settings.slopeRotation ?? 0), [["0", "0"], ["90", "90"], ["180", "180"], ["270", "270"]])}
          ${this.numberControl("Размер, тайлы", "slopeSizeTiles", 1, 12, 1, this.settings.slopeSizeTiles)}
        </div>
      `;
    }

    if (this.activeTool === "Z" || this.activeTool === "B") {
      return this.renderEventControls("Событие инструмента", "setting");
    }

    if (this.activeTool === "V") {
      return `
        <div class="settings-section">
          <h3>Текст-зона</h3>
          ${this.numberControl("Ширина зоны", "textZoneWidthTiles", 1, 30, 1, this.settings.textZoneWidthTiles)}
          ${this.numberControl("Высота зоны", "textZoneHeightTiles", 1, 30, 1, this.settings.textZoneHeightTiles)}
          ${this.textControl("Текст", "textZoneText", this.settings.textZoneText)}
        </div>
      `;
    }

    if (this.activeTool === "A") {
      return `
        <div class="settings-section">
          <h3>Визуальный текст</h3>
          ${this.textControl("Текст", "visualText", this.settings.visualText)}
          ${this.numberControl("Размер", "visualTextSize", 8, 32, 1, this.settings.visualTextSize)}
          <p>Рисуется прямо на карте. Это не подсказка снизу и не коллайдер.</p>
        </div>
      `;
    }

    if (this.activeTool === "G") {
      return `
        <div class="settings-section">
          <h3>Проход</h3>
          ${this.numberControl("Нужно монет", "gateRequiredCount", 1, 9, 1, this.settings.gateRequiredCount)}
        </div>
      `;
    }

    return `
      <div class="settings-section muted-section">
        <h3>Инструмент</h3>
        <p>У этого тайла нет дополнительных параметров.</p>
      </div>
    `;
  }

  renderEventControls(title, mode, meta = null) {
    const source = meta ?? this.settings;
    return `
      <div class="settings-section">
        <h3>${title}</h3>
        ${this.numberControl("Ширина зоны", mode === "setting" ? "triggerWidthTiles" : "wTiles", 1, 20, 1, source.wTiles ?? source.triggerWidthTiles, mode)}
        ${this.numberControl("Высота зоны", mode === "setting" ? "triggerHeightTiles" : "hTiles", 1, 20, 1, source.hTiles ?? source.triggerHeightTiles, mode)}
        ${this.checkControl("Включать ракеты", "activateRockets", source.activateRockets, mode)}
        ${this.checkControl("Включать пилы", "activateSaws", source.activateSaws, mode)}
        ${this.checkControl("Включать скрытые шипы", "activateHiddenSpikes", source.activateHiddenSpikes, mode)}
        ${this.checkControl("Включать лазеры", "activateLasers", source.activateLasers, mode)}
      </div>
    `;
  }

  renderSelectedSettings(selected) {
    const batch = this.multiSelectionTypeInfo();
    if (batch.mixed) {
      return `
        <div class="settings-section muted-section danger-section">
          <h3>Мультивыбор</h3>
          <p>Выбраны разные типы: ${batch.entries.length}. Свойства закрыты, можно только двигать или удалить.</p>
        </div>
      `;
    }
    if (batch.same) {
      selected = {
        tx: batch.entries[0].tx,
        ty: batch.entries[0].ty,
        tile: batch.entries[0].tile,
        meta: batch.entries[0].meta,
        batchCount: batch.entries.length,
      };
    }
    if (!selected) {
      return `
        <div class="settings-section muted-section">
          <h3>Выбранный объект</h3>
          <p>Кликни по тайлу, чтобы менять параметры уже поставленной ловушки.</p>
        </div>
      `;
    }

    const { tx, ty, tile, meta } = selected;
    let controls = `<p class="selected-note">${selected.batchCount ? `Массовое редактирование: ${selected.batchCount}` : `Тайл ${tx}, ${ty}`}: ${TOOL_BY_ID.get(tile)?.label ?? tile}</p>`;
    if (!meta) {
      controls += `<p>У этого тайла нет метаданных.</p>`;
    } else if (meta.type === "laser") {
      controls += this.numberControl("Радиус, тайлы", "radiusTiles", 3, 40, 1, meta.radiusTiles, "meta");
      controls += this.checkControl("Активен сразу", "active", meta.active, "meta");
    } else if (meta.type === "saw") {
      controls += this.selectControl("Ось", "axis", meta.axis, [["x", "горизонталь"], ["y", "вертикаль"]], "meta");
      controls += this.numberControl("Размах, тайлы", "spanTiles", 0, 16, 1, meta.spanTiles, "meta");
      controls += this.numberControl("Скорость", "speed", 0.2, 3, 0.1, meta.speed, "meta");
      controls += this.checkControl("Активна сразу", "active", meta.active, "meta");
    } else if (meta.type === "turret" || meta.type === "rocket") {
      controls += this.numberControl("Радиус, тайлы", "radiusTiles", 2, 40, 1, meta.radiusTiles ?? 10, "meta");
      controls += this.numberControl("Скорость ракеты", "rocketSpeed", 1, 10, 0.1, meta.rocketSpeed ?? 4.2, "meta");
      controls += this.numberControl("Пауза выстрела", "cooldownFrames", 20, 300, 5, meta.cooldownFrames ?? 120, "meta");
      controls += this.rangeControl("Агрессивность", "aggression", 1, 10, 1, meta.aggression ?? 8, "meta");
      controls += this.checkControl("Активна сразу", "active", meta.active, "meta");
    } else if (meta.type === "robot") {
      controls += this.selectControl("Смотрит", "direction", meta.direction ?? "right", [["right", "вправо"], ["left", "влево"]], "meta");
      controls += this.numberControl("Макс. скорость", "maxSpeed", 0.5, 6, 0.1, meta.maxSpeed ?? 2.2, "meta");
      controls += this.numberControl("Пауза после удара, кадры", "cooldownFrames", 0, 300, 5, meta.cooldownFrames ?? 90, "meta");
    } else if (meta.type === "flier") {
      controls += this.selectControl("Старт", "direction", meta.direction ?? "right", [["right", "вправо"], ["up", "вверх"], ["left", "влево"], ["down", "вниз"]], "meta");
      controls += this.numberControl("Скорость", "speed", 0.2, 3, 0.1, meta.speed ?? 0.8, "meta");
      controls += this.numberControl("Область X, тайлы", "areaWidthTiles", 1, 30, 1, meta.areaWidthTiles ?? 6, "meta");
      controls += this.numberControl("Область Y, тайлы", "areaHeightTiles", 1, 30, 1, meta.areaHeightTiles ?? 4, "meta");
    } else if (meta.type === "mazeBot") {
      controls += this.selectControl("Старт", "direction", meta.direction ?? "right", [["right", "вправо"], ["up", "вверх"], ["left", "влево"], ["down", "вниз"]], "meta");
      controls += this.numberControl("Скорость", "speed", 0.2, 3, 0.1, meta.speed ?? 0.72, "meta");
    } else if (meta.type === "wallMine") {
      controls += this.selectControl("Клеится к", "side", meta.side ?? "floor", [["floor", "пол"], ["ceiling", "потолок"], ["left", "левая стена"], ["right", "правая стена"]], "meta");
      controls += this.checkControl("Активна сразу", "active", meta.active ?? true, "meta");
    } else if (meta.type === "slope") {
      controls += this.selectControl("Поворот", "rotation", String(meta.rotation ?? 0), [["0", "0"], ["90", "90"], ["180", "180"], ["270", "270"]], "meta");
      controls += this.numberControl("Размер, тайлы", "sizeTiles", 1, 12, 1, meta.sizeTiles ?? 1, "meta");
    } else if (meta.type === "hiddenSpike") {
      controls += this.numberControl("Длина, тайлы", "tiles", 1, 12, 1, meta.tiles, "meta");
      controls += this.checkControl("Активны сразу", "active", meta.active, "meta");
    } else if (meta.type === "coinGate") {
      controls += this.numberControl("Нужно монет", "requiredCount", 1, 9, 1, meta.requiredCount, "meta");
    } else if (meta.type === "textZone") {
      controls += this.numberControl("Ширина зоны", "wTiles", 1, 30, 1, meta.wTiles ?? 3, "meta");
      controls += this.numberControl("Высота зоны", "hTiles", 1, 30, 1, meta.hTiles ?? 3, "meta");
      controls += this.textControl("Текст", "text", meta.text ?? "", "meta");
    } else if (meta.type === "label") {
      controls += this.textControl("Текст", "text", meta.text ?? "", "meta");
      controls += this.numberControl("Размер", "size", 8, 32, 1, meta.size ?? 13, "meta");
    } else if (meta.type === "trigger" || meta.type === "button") {
      controls += this.renderEventControls(meta.type === "trigger" ? "Триггер" : "Кнопка", "meta", meta);
    }

    return `
      <div class="settings-section selected-section">
        <h3>Выбранный объект</h3>
        ${controls}
      </div>
    `;
  }

  rangeControl(label, name, min, max, step, value, mode = "setting") {
    const attr = mode === "meta" ? "data-meta-field" : "data-setting";
    const valueLabel = name === "difficulty" ? this.pixelStars(value) : `${value}/${max}`;
    return `
      <label class="setting-row ${name === "difficulty" ? "difficulty-setting-row" : ""}">
        <span>${label}</span>
        <b>${valueLabel}</b>
        <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" ${attr}="${name}" />
      </label>
    `;
  }

  pixelStars(value) {
    const count = Math.max(1, Math.min(5, Math.round(Number(value) || 1)));
    return `<span class="pixel-stars editor-stars" aria-label="${count} из 5">${Array.from({ length: count }, () => '<span class="pixel-star"></span>').join("")}</span>`;
  }

  rocketTuningForAggression(value) {
    const aggression = Math.max(1, Math.min(10, Math.round(Number(value) || 8)));
    const t = (aggression - 1) / 9;
    return {
      aggression,
      reactionFrames: Math.round(58 - t * 42),
      turnDelayFrames: Math.round(34 - t * 24),
      acceleration: Number((0.018 + t * 0.052).toFixed(3)),
      maxSpeed: Number((2.1 + t * 3.0).toFixed(2)),
      turnRate: Number((0.018 + t * 0.045).toFixed(3)),
      speedScale: Number((0.45 + t * 0.58).toFixed(3)),
      accelerationRampFrames: Math.round(76 - t * 30),
    };
  }

  numberControl(label, name, min, max, step, value, mode = "setting") {
    const attr = mode === "meta" ? "data-meta-field" : "data-setting";
    return `
      <label class="setting-row compact-row">
        <span>${label}</span>
        <input type="number" min="${min}" max="${max}" step="${step}" value="${value}" ${attr}="${name}" />
      </label>
    `;
  }

  textControl(label, name, value, mode = "setting") {
    const attr = mode === "meta" ? "data-meta-field" : "data-setting";
    return `
      <label class="setting-row text-row">
        <span>${label}</span>
        <input type="text" value="${this.escapeAttribute(value ?? "")}" ${attr}="${name}" />
      </label>
    `;
  }

  escapeAttribute(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  physicsNumberControl(label, name, min, max, step, value) {
    const displayValue = Number.isFinite(Number(value)) ? Number(value) : 0;
    return `
      <label class="physics-row">
        <span>${label}</span>
        <input type="number" min="${min}" max="${max}" step="${step}" value="${displayValue}" data-physics-field="${name}" />
      </label>
    `;
  }

  checkControl(label, name, checked, mode = "setting") {
    const attr = mode === "meta" ? "data-meta-field" : "data-setting";
    return `
      <label class="setting-check">
        <input type="checkbox" ${checked ? "checked" : ""} ${attr}="${name}" />
        <span>${label}</span>
      </label>
    `;
  }

  selectControl(label, name, value, options, mode = "setting") {
    const attr = mode === "meta" ? "data-meta-field" : "data-setting";
    const optionHtml = options.map(([id, text]) => `<option value="${id}" ${id === value ? "selected" : ""}>${text}</option>`).join("");
    return `
      <label class="setting-row compact-row">
        <span>${label}</span>
        <select ${attr}="${name}">${optionHtml}</select>
      </label>
    `;
  }

  getSelectedInfo() {
    if (!this.selectedTile) return null;
    const { tx, ty } = this.selectedTile;
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) return null;
    const tile = this.grid[ty][tx];
    return { tx, ty, tile, meta: this.meta[this.metaKey(tx, ty)] };
  }

  clampCamera() {
    const worldWidth = this.width * this.tileSize;
    const worldHeight = this.height * this.tileSize;
    this.camera.x = Math.max(0, Math.min(this.camera.x, Math.max(0, worldWidth - this.canvas.width)));
    this.camera.y = Math.max(0, Math.min(this.camera.y, Math.max(0, worldHeight - this.canvas.height)));
  }

  draw() {
    this.clampCamera();
    this.ctx.fillStyle = "#0b1018";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const tileSize = this.tileSize;
    const minX = Math.max(0, Math.floor(this.camera.x / tileSize) - 1);
    const minY = Math.max(0, Math.floor(this.camera.y / tileSize) - 1);
    const maxX = Math.min(this.width - 1, Math.ceil((this.camera.x + this.canvas.width) / tileSize) + 1);
    const maxY = Math.min(this.height - 1, Math.ceil((this.camera.y + this.canvas.height) / tileSize) + 1);

    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        this.drawTile(x, y, this.grid[y][x]);
      }
    }

    this.drawMetaOverlays(minX, minY, maxX, maxY);
    this.drawGrid(minX, minY, maxX, maxY);
    this.drawHud();
  }

  drawTile(tx, ty, value) {
    const tileSize = this.tileSize;
    const x = tx * tileSize - this.camera.x;
    const y = ty * tileSize - this.camera.y;
    const tool = TOOL_BY_ID.get(value) ?? TOOL_BY_ID.get(".");

    this.ctx.fillStyle = value === "." ? "#0d131b" : tool.color;
    this.ctx.fillRect(x, y, Math.ceil(tileSize), Math.ceil(tileSize));

    if (value === "#") {
      this.ctx.fillStyle = "#344961";
      this.ctx.fillRect(x + 2, y + 2, tileSize - 4, Math.max(2, tileSize * 0.18));
      return;
    }

    if (value === "U") {
      this.ctx.fillStyle = "#070a10";
      this.ctx.fillRect(x, y, Math.ceil(tileSize), Math.ceil(tileSize));
      this.ctx.fillStyle = "#161f2d";
      this.ctx.fillRect(x + 2, y + 2, tileSize - 4, Math.max(2, tileSize * 0.16));
      this.ctx.fillStyle = "#2f1d35";
      this.ctx.fillRect(x + 4, y + tileSize - 7, tileSize - 8, Math.max(2, tileSize * 0.1));
      return;
    }

    if (value === "Y") {
      const meta = this.meta[this.metaKey(tx, ty)] ?? this.createMetadataForTool("Y");
      this.drawSlopeTile(x, y, tileSize * Math.max(1, Number(meta.sizeTiles ?? 1)), Number(meta.rotation ?? 0));
      return;
    }

    if (value === "S") {
      this.ctx.fillStyle = "#071014";
      this.ctx.fillRect(x, y + tileSize * 0.78, tileSize, tileSize * 0.22);
      this.ctx.fillStyle = "#ff4c6a";
      for (let i = 0; i < 3; i += 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + tileSize * (0.12 + i * 0.28), y + tileSize * 0.82);
        this.ctx.lineTo(x + tileSize * (0.22 + i * 0.28), y + tileSize * 0.25);
        this.ctx.lineTo(x + tileSize * (0.32 + i * 0.28), y + tileSize * 0.82);
        this.ctx.closePath();
        this.ctx.fill();
      }
      return;
    }

    if (value === "T") {
      this.ctx.fillStyle = "#ffd15c";
      this.ctx.beginPath();
      this.ctx.moveTo(x + 2, y + 4);
      this.ctx.lineTo(x + tileSize - 2, y + 4);
      this.ctx.lineTo(x + tileSize / 2, y + tileSize - 2);
      this.ctx.closePath();
      this.ctx.fill();
      return;
    }

    if (value === "X") {
      this.ctx.fillStyle = "#05070a";
      this.ctx.fillRect(x + tileSize * 0.26, y + tileSize * 0.34, tileSize * 0.48, tileSize * 0.48);
      this.ctx.fillStyle = "#b8c6d6";
      this.ctx.fillRect(x + tileSize * 0.36, y + tileSize * 0.22, tileSize * 0.28, tileSize * 0.16);
      this.ctx.fillStyle = "#ffd15c";
      this.ctx.fillRect(x + tileSize * 0.72, y + tileSize * 0.14, tileSize * 0.14, tileSize * 0.14);
      return;
    }

    if (value === "I") {
      this.ctx.fillStyle = "#0d131b";
      this.ctx.fillRect(x, y, Math.ceil(tileSize), Math.ceil(tileSize));
      this.ctx.fillStyle = "#ff4c6a";
      this.ctx.fillRect(x + tileSize * 0.3, y + tileSize * 0.58, tileSize * 0.4, tileSize * 0.25);
      this.ctx.fillStyle = "#ffd15c";
      this.ctx.fillRect(x + tileSize * 0.46, y + tileSize * 0.44, tileSize * 0.08, tileSize * 0.12);
      return;
    }

    if (value === "W") {
      const meta = this.meta[this.metaKey(tx, ty)] ?? this.createMetadataForTool("W");
      const side = meta.side ?? "floor";
      const vertical = side === "left" || side === "right";
      const w = vertical ? tileSize * 0.18 : tileSize * 0.56;
      const h = vertical ? tileSize * 0.56 : tileSize * 0.18;
      const mx = side === "right"
        ? x + tileSize - w - 2
        : side === "left"
          ? x + 2
          : x + (tileSize - w) / 2;
      const my = side === "ceiling"
        ? y + 2
        : side === "floor"
          ? y + tileSize - h - 2
          : y + (tileSize - h) / 2;
      this.ctx.fillStyle = "#0d131b";
      this.ctx.fillRect(x, y, Math.ceil(tileSize), Math.ceil(tileSize));
      this.ctx.fillStyle = "#151923";
      this.ctx.fillRect(mx, my, w, h);
      this.ctx.fillStyle = "#ff4c6a";
      if (vertical) {
        this.ctx.fillRect(mx + w / 2 - 1, my + 4, 2, Math.max(2, h - 8));
      } else {
        this.ctx.fillRect(mx + 4, my + h / 2 - 1, Math.max(2, w - 8), 2);
      }
      this.ctx.fillStyle = "#ffd15c";
      this.ctx.fillRect(mx + w / 2 - 2, my + h / 2 - 2, 4, 4);
      return;
    }

    if (value === "N") {
      this.ctx.fillStyle = "#7b8ea7";
      this.ctx.fillRect(x + 4, y + 9, tileSize - 8, tileSize - 12);
      this.ctx.fillStyle = "#071014";
      this.ctx.fillRect(x + 9, y + 15, 5, 5);
      this.ctx.fillRect(x + tileSize - 14, y + 15, 5, 5);
      return;
    }

    if (value === "Q") {
      this.ctx.fillStyle = "#b583ff";
      this.ctx.beginPath();
      this.ctx.arc(x + tileSize / 2, y + tileSize / 2, tileSize * 0.38, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = "#071014";
      this.ctx.fillRect(x + tileSize * 0.36, y + tileSize * 0.42, 4, 4);
      this.ctx.fillRect(x + tileSize * 0.56, y + tileSize * 0.42, 4, 4);
      return;
    }

    if (value === "J") {
      this.ctx.fillStyle = "#020406";
      this.ctx.fillRect(x + 3, y + 3, tileSize - 6, tileSize - 6);
      this.ctx.fillStyle = "#05070a";
      this.ctx.fillRect(x + 7, y + 7, tileSize - 14, tileSize - 14);
      this.ctx.fillStyle = "#52eadc";
      this.ctx.fillRect(x + tileSize - 11, y + 9, 4, 5);
      this.ctx.fillRect(x + tileSize - 11, y + tileSize - 14, 4, 5);
      return;
    }

    if (value === "R") {
      this.ctx.fillStyle = "#2f4057";
      this.ctx.fillRect(x + 5, y + 7, tileSize - 10, tileSize - 10);
      this.ctx.fillStyle = "#ff4c6a";
      this.ctx.fillRect(x + tileSize * 0.45, y + 2, tileSize * 0.18, tileSize * 0.48);
      this.ctx.fillStyle = "#071014";
      this.ctx.fillRect(x + tileSize * 0.38, y + tileSize * 0.45, tileSize * 0.24, tileSize * 0.18);
      return;
    }

    if (value === "V") {
      this.ctx.fillStyle = "#52eadc";
      this.ctx.fillRect(x + tileSize * 0.22, y + tileSize * 0.28, tileSize * 0.56, tileSize * 0.44);
      this.ctx.fillStyle = "#071014";
      this.ctx.font = `${Math.max(9, Math.min(14, tileSize - 4))}px Trebuchet MS`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText("TXT", x + tileSize / 2, y + tileSize / 2 + 1);
      this.ctx.textAlign = "start";
      this.ctx.textBaseline = "alphabetic";
      return;
    }

    if (value === "A") {
      const meta = this.meta[this.metaKey(tx, ty)] ?? this.createMetadataForTool("A");
      this.drawPixelLabel(this.ctx, meta.text ?? "TXT", x, y + Math.max(8, Number(meta.size ?? 13)), Math.max(8, Number(meta.size ?? 13)));
      return;
    }

    if (value === ".") return;

    this.ctx.fillStyle = value === "C" || value === "M" ? "#071014" : "#071014";
    this.ctx.font = `${Math.max(9, Math.min(16, tileSize - 3))}px Trebuchet MS`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(value, x + tileSize / 2, y + tileSize / 2 + 1);
    this.ctx.textAlign = "start";
    this.ctx.textBaseline = "alphabetic";
  }

  drawSlopeTile(x, y, tileSize, rotation) {
    const points = this.slopePoints(x, y, tileSize, rotation);
    this.ctx.fillStyle = "#0d131b";
    this.ctx.fillRect(x, y, Math.ceil(tileSize), Math.ceil(tileSize));
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => this.ctx.lineTo(point.x, point.y));
    this.ctx.closePath();
    this.ctx.save();
    this.ctx.clip();
    const base = this.tileSize;
    for (let py = y; py < y + tileSize; py += base) {
      for (let px = x; px < x + tileSize; px += base) {
        this.ctx.fillStyle = "#26364a";
        this.ctx.fillRect(px, py, Math.ceil(base), Math.ceil(base));
        this.ctx.fillStyle = "#344961";
        this.ctx.fillRect(px + 2, py + 2, Math.max(2, base - 4), Math.max(2, base * 0.18));
        this.ctx.fillStyle = "#1a2534";
        this.ctx.fillRect(px + 3, py + base - 7, Math.max(2, base - 6), Math.max(2, base * 0.12));
      }
    }
    this.ctx.restore();
    this.ctx.strokeStyle = "#344961";
    this.ctx.lineWidth = Math.max(1, this.tileSize * 0.08);
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    this.ctx.lineTo(points[1].x, points[1].y);
    this.ctx.stroke();
  }

  drawPixelLabel(ctx, text, x, y, size = 13, color = "#f4f1dc") {
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.font = `900 ${Math.max(8, Math.min(32, Number(size) || 13))}px "Courier New", monospace`;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#020406";
    ctx.fillText(text ?? "", x + 2, y + 2);
    ctx.fillStyle = color;
    ctx.fillText(text ?? "", x, y);
    ctx.restore();
  }

  slopePoints(x, y, size, rotation) {
    const r = ((Number(rotation) % 360) + 360) % 360;
    const pad = 0;
    if (r === 90) {
      return [
        { x: x + pad, y: y + pad },
        { x: x + size - pad, y: y + size - pad },
        { x: x + pad, y: y + size - pad },
      ];
    }
    if (r === 180) {
      return [
        { x: x + size - pad, y: y + pad },
        { x: x + pad, y: y + size - pad },
        { x: x + pad, y: y + pad },
      ];
    }
    if (r === 270) {
      return [
        { x: x + pad, y: y + pad },
        { x: x + size - pad, y: y + size - pad },
        { x: x + size - pad, y: y + pad },
      ];
    }
    return [
      { x: x + pad, y: y + size - pad },
      { x: x + size - pad, y: y + pad },
      { x: x + size - pad, y: y + size - pad },
    ];
  }

  drawMetaOverlays(minX, minY, maxX, maxY) {
    Object.entries(this.meta).forEach(([key, meta]) => {
      const [tx, ty] = key.split(",").map(Number);
      if (tx < minX - 20 || tx > maxX + 20 || ty < minY - 20 || ty > maxY + 20) return;
      const tileSize = this.tileSize;
      const x = tx * tileSize - this.camera.x;
      const y = ty * tileSize - this.camera.y;
      const cx = x + tileSize / 2;
      const cy = y + tileSize / 2;

      this.ctx.save();
      if (meta.type === "laser") {
        this.ctx.globalAlpha = 0.45;
        this.ctx.strokeStyle = "#52eadc";
        this.ctx.setLineDash([10, 8]);
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, Number(meta.radiusTiles ?? 12) * tileSize, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      if (meta.type === "turret" || meta.type === "rocket") {
        this.ctx.globalAlpha = 0.36;
        this.ctx.strokeStyle = "#ff4c6a";
        this.ctx.setLineDash([10, 8]);
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, Number(meta.radiusTiles ?? 10) * tileSize, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      if (meta.type === "robot") {
        const direction = meta.direction === "left" ? -1 : 1;
        this.ctx.globalAlpha = 0.8;
        this.ctx.strokeStyle = "#ffd15c";
        this.ctx.setLineDash([6, 6]);
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(cx + direction * tileSize * 4, cy);
        this.ctx.stroke();
      }

      if (meta.type === "flier") {
        const w = Math.max(1, Number(meta.areaWidthTiles ?? 6)) * tileSize;
        const h = Math.max(1, Number(meta.areaHeightTiles ?? 4)) * tileSize;
        this.ctx.globalAlpha = 0.22;
        this.ctx.fillStyle = "#b583ff";
        this.ctx.fillRect(x, y, w, h);
        this.ctx.globalAlpha = 0.72;
        this.ctx.strokeStyle = "#b583ff";
        this.ctx.setLineDash([8, 6]);
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, w, h);
      }

      if (meta.type === "saw") {
        const span = Number(meta.spanTiles ?? 0) * tileSize;
        this.ctx.globalAlpha = meta.active ? 0.7 : 0.36;
        this.ctx.strokeStyle = meta.active ? "#eef4ff" : "#ff4c6a";
        this.ctx.setLineDash([8, 6]);
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        if (meta.axis === "y") {
          this.ctx.moveTo(cx, cy - span);
          this.ctx.lineTo(cx, cy + span);
        } else {
          this.ctx.moveTo(cx - span, cy);
          this.ctx.lineTo(cx + span, cy);
        }
        this.ctx.stroke();
      }

      if (meta.type === "trigger") {
        const w = Number(meta.wTiles ?? 3) * tileSize;
        const h = Number(meta.hTiles ?? 3) * tileSize;
        this.ctx.globalAlpha = 0.22;
        this.ctx.fillStyle = "#b583ff";
        this.ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
        this.ctx.globalAlpha = 0.75;
        this.ctx.strokeStyle = "#b583ff";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);
      }

      if (meta.type === "textZone") {
        const w = Number(meta.wTiles ?? 3) * tileSize;
        const h = Number(meta.hTiles ?? 3) * tileSize;
        this.ctx.globalAlpha = 0.16;
        this.ctx.fillStyle = "#52eadc";
        this.ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
        this.ctx.globalAlpha = 0.82;
        this.ctx.strokeStyle = "#52eadc";
        this.ctx.setLineDash([6, 5]);
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);
      }
      this.ctx.restore();
    });

    if (this.selection) this.drawSelectionRect(this.selection, "#ffd15c", 0.95);
    if (this.multiSelection.length > 0) this.drawMultiSelection();
    if (this.isMovingSelection && this.selection) {
      this.drawSelectionRect({
        x: this.selection.x + this.moveDelta.dx,
        y: this.selection.y + this.moveDelta.dy,
        w: this.selection.w,
        h: this.selection.h,
      }, "#52eadc", 0.75);
    }
  }

  drawSelectionRect(selection, color, alpha = 1) {
    const x = selection.x * this.tileSize - this.camera.x;
    const y = selection.y * this.tileSize - this.camera.y;
    const w = selection.w * this.tileSize;
    const h = selection.h * this.tileSize;
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([10, 6]);
    this.ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
    this.ctx.globalAlpha = alpha * 0.12;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
    this.ctx.restore();
  }

  drawMultiSelection() {
    this.multiSelection.forEach(({ tx, ty }) => {
      const x = tx * this.tileSize - this.camera.x;
      const y = ty * this.tileSize - this.camera.y;
      this.ctx.save();
      this.ctx.globalAlpha = 0.92;
      this.ctx.strokeStyle = "#ffd15c";
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(x + 2, y + 2, this.tileSize - 4, this.tileSize - 4);
      if (this.isMovingSelection) {
        this.ctx.globalAlpha = 0.38;
        this.ctx.strokeStyle = "#52eadc";
        this.ctx.strokeRect(x + this.moveDelta.dx * this.tileSize + 4, y + this.moveDelta.dy * this.tileSize + 4, this.tileSize - 8, this.tileSize - 8);
      }
      this.ctx.restore();
    });
  }

  drawGrid(minX, minY, maxX, maxY) {
    const tileSize = this.tileSize;
    this.ctx.strokeStyle = "rgba(184, 198, 214, 0.16)";
    this.ctx.lineWidth = 1;
    for (let x = minX; x <= maxX + 1; x += 1) {
      const px = Math.floor(x * tileSize - this.camera.x);
      this.ctx.beginPath();
      this.ctx.moveTo(px, 0);
      this.ctx.lineTo(px, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = minY; y <= maxY + 1; y += 1) {
      const py = Math.floor(y * tileSize - this.camera.y);
      this.ctx.beginPath();
      this.ctx.moveTo(0, py);
      this.ctx.lineTo(this.canvas.width, py);
      this.ctx.stroke();
    }
  }

  drawHud() {
    this.ctx.fillStyle = "rgba(5, 7, 10, 0.76)";
    this.ctx.fillRect(10, 10, 700, 24);
    this.ctx.fillStyle = "#f7f2df";
    this.ctx.font = "13px Trebuchet MS";
    this.ctx.fillText(`${this.width}x${this.height} | ${this.settings.physicsMode} | масштаб ${(this.zoom * 100).toFixed(0)}% | камера ${Math.round(this.camera.x)},${Math.round(this.camera.y)} | зона ${this.settings.cameraDeadZoneWidth}x${this.settings.cameraDeadZoneHeight} | скорость ${this.settings.speedLevel}/15 | набор ${this.settings.accelerationLevel}/15 | прыжок ${this.settings.jumpLevel}/15`, 18, 27);
  }

  metaKey(tx, ty) {
    return `${tx},${ty}`;
  }

  removeMeta(tx, ty) {
    delete this.meta[this.metaKey(tx, ty)];
  }

  pruneMeta() {
    Object.keys(this.meta).forEach((key) => {
      const [tx, ty] = key.split(",").map(Number);
      if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height || !META_TOOLS.has(this.grid[ty]?.[tx])) {
        delete this.meta[key];
      }
    });
  }

  setStatus(text) {
    this.statusEl.textContent = text;
  }
}
