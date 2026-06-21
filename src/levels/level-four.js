export const Level4 = Object.freeze({
  "name": "Наклонные поверхности",
  "requiresKeyForExit": true,
  "coinGateRequires": 3,
  "playerTuning": {
    "tuningScale": 15,
    "speedLevel": 3,
    "accelerationLevel": 1,
    "jumpLevel": 5,
    "verticalLevel": 5,
    "wallJumpLevel": 5
  },
  "difficulty": 3,
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
    "###..................##................#",
    "####.................##..............K.#",
    "#.###.M..............##........#########",
    "#..####..............##.#.....##########",
    "#...###.........##...##.##.....####....#",
    "#..............###...##..##.......#....#",
    "#.............###....##...##......G....#",
    "#..........#####.....##....#.....###...#",
    "#.........#####.................####...#",
    "#..........###.................#####...#",
    "#....##.......................######...#",
    "#M..###......................##..###...#",
    "#..####..................#...#...###...#",
    "#####...................###......###...#",
    "####...................###.......###...#",
    "###............##.....###........###...#",
    "#........##....###.....#.........###...#",
    "#.......###.....###............#####...#",
    "#......###.......###..........######...#",
    "#.....###.........###........###.###...#",
    "#.P..####....M....###SSSSSSS###..###.D.#",
    "########################################",
    "########################################",
    "########################################"
  ],
  "messages": [
    "Кто их наклоняет?"
  ],
  "labels": [],
  "buttonActions": {},
  "coinActions": {},
  "onKey": {},
  "triggers": [],
  "textZones": [
    {
      "id": "textZone0",
      "tx": 29,
      "ty": 1,
      "wTiles": 11,
      "hTiles": 5,
      "text": "Кстати, ключи сохраняются после смерти)"
    },
    {
      "id": "textZone1",
      "tx": 1,
      "ty": 13,
      "wTiles": 8,
      "hTiles": 9,
      "text": "Маневрируй в воздухе как птица ФРРРР ФРРР ФРРР"
    }
  ],
  "hazards": {
    "hiddenSpikes": [],
    "saws": [],
    "rockets": [],
    "turrets": [],
    "robots": [
      {
        "id": "robot0",
        "tx": 17,
        "ty": 21,
        "direction": "left",
        "maxSpeed": 2.2,
        "cooldownFrames": 90,
        "acceleration": 0.08
      }
    ],
    "fliers": [],
    "mazeBots": [],
    "mines": [],
    "wallMines": [
      {
        "id": "wallMine0",
        "tx": 20,
        "ty": 1,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine1",
        "tx": 20,
        "ty": 2,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine2",
        "tx": 20,
        "ty": 3,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine3",
        "tx": 7,
        "ty": 4,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine4",
        "tx": 16,
        "ty": 4,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine5",
        "tx": 17,
        "ty": 4,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine6",
        "tx": 20,
        "ty": 4,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine7",
        "tx": 23,
        "ty": 4,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine8",
        "tx": 29,
        "ty": 4,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine9",
        "tx": 7,
        "ty": 5,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine10",
        "tx": 18,
        "ty": 5,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine11",
        "tx": 20,
        "ty": 5,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine12",
        "tx": 23,
        "ty": 5,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine13",
        "tx": 4,
        "ty": 6,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine14",
        "tx": 5,
        "ty": 6,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine15",
        "tx": 6,
        "ty": 6,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine16",
        "tx": 18,
        "ty": 6,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine17",
        "tx": 20,
        "ty": 6,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine18",
        "tx": 20,
        "ty": 7,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine19",
        "tx": 28,
        "ty": 7,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine20",
        "tx": 20,
        "ty": 8,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine21",
        "tx": 28,
        "ty": 8,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine22",
        "tx": 36,
        "ty": 8,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine23",
        "tx": 9,
        "ty": 9,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine24",
        "tx": 21,
        "ty": 9,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine25",
        "tx": 22,
        "ty": 9,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine26",
        "tx": 27,
        "ty": 9,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine27",
        "tx": 36,
        "ty": 9,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine28",
        "tx": 5,
        "ty": 10,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine29",
        "tx": 6,
        "ty": 10,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine30",
        "tx": 36,
        "ty": 10,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine31",
        "tx": 11,
        "ty": 11,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine32",
        "tx": 12,
        "ty": 11,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine33",
        "tx": 13,
        "ty": 11,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine34",
        "tx": 25,
        "ty": 12,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine35",
        "tx": 28,
        "ty": 12,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine36",
        "tx": 38,
        "ty": 12,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine37",
        "tx": 28,
        "ty": 13,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine38",
        "tx": 38,
        "ty": 13,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine39",
        "tx": 27,
        "ty": 14,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine40",
        "tx": 29,
        "ty": 14,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine41",
        "tx": 38,
        "ty": 14,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine42",
        "tx": 15,
        "ty": 15,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine43",
        "tx": 16,
        "ty": 15,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine44",
        "tx": 9,
        "ty": 16,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine45",
        "tx": 10,
        "ty": 16,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine46",
        "tx": 21,
        "ty": 16,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine47",
        "tx": 36,
        "ty": 16,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine48",
        "tx": 11,
        "ty": 17,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine49",
        "tx": 31,
        "ty": 17,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine50",
        "tx": 32,
        "ty": 17,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine51",
        "tx": 36,
        "ty": 17,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine52",
        "tx": 11,
        "ty": 18,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine53",
        "tx": 23,
        "ty": 18,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine54",
        "tx": 36,
        "ty": 18,
        "side": "left",
        "active": true
      }
    ],
    "lasers": [],
    "slopes": [
      {
        "id": "slope0",
        "tx": 3,
        "ty": 1,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope1",
        "tx": 4,
        "ty": 2,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope2",
        "tx": 1,
        "ty": 3,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope3",
        "tx": 5,
        "ty": 3,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope4",
        "tx": 30,
        "ty": 3,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope5",
        "tx": 2,
        "ty": 4,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope6",
        "tx": 25,
        "ty": 4,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope7",
        "tx": 3,
        "ty": 5,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope8",
        "tx": 15,
        "ty": 5,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope9",
        "tx": 26,
        "ty": 5,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope10",
        "tx": 30,
        "ty": 5,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope11",
        "tx": 14,
        "ty": 6,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope12",
        "tx": 24,
        "ty": 6,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope13",
        "tx": 27,
        "ty": 6,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope14",
        "tx": 13,
        "ty": 7,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope15",
        "tx": 17,
        "ty": 7,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope16",
        "tx": 25,
        "ty": 7,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope17",
        "tx": 10,
        "ty": 8,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope18",
        "tx": 16,
        "ty": 8,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope19",
        "tx": 26,
        "ty": 8,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope20",
        "tx": 32,
        "ty": 8,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope21",
        "tx": 15,
        "ty": 9,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope22",
        "tx": 31,
        "ty": 9,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope23",
        "tx": 10,
        "ty": 10,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope24",
        "tx": 14,
        "ty": 10,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope25",
        "tx": 30,
        "ty": 10,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope26",
        "tx": 4,
        "ty": 11,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope27",
        "tx": 29,
        "ty": 11,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope28",
        "tx": 3,
        "ty": 12,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope29",
        "tx": 31,
        "ty": 12,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope30",
        "tx": 2,
        "ty": 13,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope31",
        "tx": 24,
        "ty": 13,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope32",
        "tx": 26,
        "ty": 13,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope33",
        "tx": 30,
        "ty": 13,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope34",
        "tx": 5,
        "ty": 14,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope35",
        "tx": 23,
        "ty": 14,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope36",
        "tx": 4,
        "ty": 15,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope37",
        "tx": 22,
        "ty": 15,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope38",
        "tx": 26,
        "ty": 15,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope39",
        "tx": 3,
        "ty": 16,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope40",
        "tx": 17,
        "ty": 16,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope41",
        "tx": 25,
        "ty": 16,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope42",
        "tx": 8,
        "ty": 17,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope43",
        "tx": 18,
        "ty": 17,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope44",
        "tx": 22,
        "ty": 17,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope45",
        "tx": 24,
        "ty": 17,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope46",
        "tx": 7,
        "ty": 18,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope47",
        "tx": 15,
        "ty": 18,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope48",
        "tx": 19,
        "ty": 18,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope49",
        "tx": 30,
        "ty": 18,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope50",
        "tx": 6,
        "ty": 19,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope51",
        "tx": 10,
        "ty": 19,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope52",
        "tx": 16,
        "ty": 19,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope53",
        "tx": 20,
        "ty": 19,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope54",
        "tx": 29,
        "ty": 19,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope55",
        "tx": 5,
        "ty": 20,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope56",
        "tx": 9,
        "ty": 20,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope57",
        "tx": 17,
        "ty": 20,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope58",
        "tx": 28,
        "ty": 20,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope59",
        "tx": 32,
        "ty": 20,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope60",
        "tx": 31,
        "ty": 21,
        "rotation": 180,
        "sizeTiles": 1
      }
    ],
    "bombs": []
  }
});
