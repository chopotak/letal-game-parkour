export const Level3 = Object.freeze({
  "name": "Лабиринт с роботами",
  "requiresKeyForExit": false,
  "coinGateRequires": 3,
  "playerTuning": {
    "tuningScale": 15,
    "speedLevel": 3,
    "accelerationLevel": 1,
    "jumpLevel": 10,
    "verticalLevel": 6,
    "wallJumpLevel": 5
  },
  "physicsMode": "moon",
  "physicsOverrides": {
    "moon": {
      "wallSlideSpeed": 0.6
    }
  },
  "camera": {
    "deadZoneWidth": 250,
    "deadZoneHeight": 150,
    "startOffsetX": 30,
    "startOffsetY": 30
  },
  "map": [
    "########################################",
    "###########################.....########",
    "###############....########.....########",
    "#########....#..##..............########",
    "#########....#..##.....................#",
    "#########.D..G.........................#",
    "###########################............#",
    "#........###.....###.....##.....####...#",
    "#....###.###.###.....###.##.###.####...#",
    "#....###.###.###.....###.##.###.####.#.#",
    "#.M..###.###.###..M..###.##.###.####.#.#",
    "#........................##.....####.#.#",
    "########.###.###.###.###.##.###.####.#.#",
    "########.###.###.###.###.##.###.####...#",
    "########.###.###.###.###.##.###...##.M.#",
    "########..........................##...#",
    "########.###.#####.....#################",
    "########.###.#####S.M.S#################",
    "########.###.###########################",
    "########......................##########",
    "########...................P..##########",
    "###############.........################",
    "########################################",
    "########################################",
    "########################################"
  ],
  "messages": [
    "Чтобы отцепиться от стенки, нажмите S"
  ],
  "labels": [],
  "buttonActions": {},
  "coinActions": {},
  "onKey": {},
  "triggers": [],
  "textZones": [],
  "hazards": {
    "hiddenSpikes": [],
    "saws": [],
    "rockets": [],
    "turrets": [],
    "robots": [
      {
        "id": "robot0",
        "tx": 15,
        "ty": 21,
        "direction": "right",
        "maxSpeed": 2.2,
        "cooldownFrames": 90,
        "acceleration": 0.08
      }
    ],
    "fliers": [
      {
        "id": "flier0",
        "tx": 15,
        "ty": 2,
        "direction": "right",
        "speed": 1.2,
        "areaWidthTiles": 4,
        "areaHeightTiles": 4
      },
      {
        "id": "flier1",
        "tx": 4,
        "ty": 7,
        "direction": "down",
        "speed": 0.8,
        "areaWidthTiles": 5,
        "areaHeightTiles": 5
      },
      {
        "id": "flier2",
        "tx": 12,
        "ty": 7,
        "direction": "right",
        "speed": 0.5,
        "areaWidthTiles": 5,
        "areaHeightTiles": 5
      },
      {
        "id": "flier3",
        "tx": 20,
        "ty": 7,
        "direction": "right",
        "speed": 0.8,
        "areaWidthTiles": 5,
        "areaHeightTiles": 5
      },
      {
        "id": "flier4",
        "tx": 36,
        "ty": 8,
        "direction": "right",
        "speed": 0.5,
        "areaWidthTiles": 3,
        "areaHeightTiles": 8
      },
      {
        "id": "flier5",
        "tx": 8,
        "ty": 11,
        "direction": "right",
        "speed": 0.6,
        "areaWidthTiles": 5,
        "areaHeightTiles": 5
      },
      {
        "id": "flier6",
        "tx": 27,
        "ty": 11,
        "direction": "right",
        "speed": 1,
        "areaWidthTiles": 5,
        "areaHeightTiles": 5
      }
    ],
    "mines": [],
    "wallMines": [],
    "lasers": [
      {
        "id": "laser0",
        "tx": 2,
        "ty": 7,
        "active": true,
        "radiusTiles": 5,
        "chargeMs": 2000,
        "fireMs": 230,
        "cooldownMs": 850
      },
      {
        "id": "laser1",
        "tx": 18,
        "ty": 8,
        "active": true,
        "radiusTiles": 7,
        "chargeMs": 2000,
        "fireMs": 230,
        "cooldownMs": 850
      }
    ],
    "slopes": [],
    "bombs": []
  },
  "difficulty": 3
});
