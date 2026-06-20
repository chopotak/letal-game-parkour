import { GameConfig } from "../src/config/gameConfig.js";
import { Level } from "../src/core/level.js";
import { LevelOne } from "../src/levels/level-one.js";
import { LevelTwo } from "../src/levels/level-two.js";
import { Level3 } from "../src/levels/level-three.js";
import { Level4 } from "../src/levels/level-four.js";
import { Level5 } from "../src/levels/level-five.js";
import { CustomLevelLast } from "../src/levels/level-last.js";

const levels = [
  { id: "level-one", data: LevelOne, needsKey: true },
  { id: "level-two", data: LevelTwo, needsKey: true },
  { id: "level-three", data: Level3, needsKey: false },
  { id: "level-four", data: Level4, needsKey: true },
  { id: "level-five", data: Level5, needsKey: true },
  { id: "level-last", data: CustomLevelLast, needsKey: true },
];

const errors = [];
const summary = [];

for (const entry of levels) {
  const level = new Level(entry.data, GameConfig.canvas.tileSize);
  const widths = new Set(entry.data.map.map((row) => row.length));
  const [expectedWidth, expectedHeight] = entry.expectedSize ?? [[...widths][0], entry.data.map.length];

  if (entry.data.map.length !== expectedHeight) errors.push(`${entry.id}: expected ${expectedHeight} rows, got ${entry.data.map.length}.`);
  if (widths.size !== 1 || !widths.has(expectedWidth)) errors.push(`${entry.id}: expected width ${expectedWidth}, got ${[...widths].join(", ")}.`);
  if (entry.needsKey && !level.collectibles.key) errors.push(`${entry.id}: missing key marker K.`);
  if (!level.doors.real) errors.push(`${entry.id}: missing real door marker D.`);

  for (const spike of level.hiddenSpikes) {
    for (let tx = spike.tx; tx < spike.tx + spike.tiles; tx += 1) {
      const below = level.tileAt(tx, spike.ty + 1);
      if (below !== "#" && below !== "F") errors.push(`${entry.id}: hidden spike ${spike.id} is not floor-anchored at ${tx},${spike.ty}.`);
    }
  }

  summary.push({
    id: entry.id,
    size: [level.widthTiles, level.heightTiles],
    coins: level.collectibles.coins.length,
    buttons: level.buttons.length,
    fakeDoors: level.doors.fake.length,
    springPads: level.springPads.length,
    rockets: level.rockets.length,
    lasers: level.lasers.length,
    bombs: level.bombs.length,
    wallMines: level.wallMines.length,
    breakBlocks: level.breakBlocks.length,
    hiddenSpikes: level.hiddenSpikes.length,
    saws: level.saws.length,
  });
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify(summary));
