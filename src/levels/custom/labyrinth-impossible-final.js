export const LayrinthImpossibleFinal = Object.freeze({
  "name": "Невозможный лабиринт",
  "requiresKeyForExit": true,
  "coinGateRequires": 3,
  "playerTuning": {
    "tuningScale": 15,
    "speedLevel": 3,
    "accelerationLevel": 1,
    "jumpLevel": 10,
    "verticalLevel": 6,
    "wallJumpLevel": 5
  },
  "difficulty": 5,
  "physicsMode": "moon",
  "physicsOverrides": {},
  "camera": {
    "deadZoneWidth": 250,
    "deadZoneHeight": 150,
    "startOffsetX": 0,
    "startOffsetY": 0
  },
  "map": [
    "######################################################################",
    "#..#.......................#..#.....#...........#....................#",
    "#..#.......................#D.G.....#...........#....................#",
    "#..#..###################..####..#..####..#######..U.....U.....U..####",
    "#..#...........#.................#.....#...........U.TTT.U.TTT.U.....#",
    "#..#...........#.............###.#.....#...........USSSSSUSSSSSU.....#",
    "#..#..#######..#..####..####.#.#.####..#..#..######UUUUUUUUUUUUU###..#",
    "#..#.....#.....#..#..#.......###.#.....#..#..#........#.....#........#",
    "#..#....M#.....#..#..#.###.......#.....#..#..#........#.....#........#",
    "#..#######..####..#..#.#.#.#######..####..#..#..####..#..#..#..####..#",
    "#..#........#..#..#..#.###.#.....#.....#..#..#..#...........#..#.....#",
    "#..#........#..#..#..#.....#.....#.....#..#..#..#...........#..#.....#",
    "#FF#FF#######..#..#..#..####..#..####..#..#..#..UFFU######..#..#..####",
    "#.....#........#.....#..#.....#........#.....#..U..U.....#.....#.....#",
    "#SSSSS#........#.....#..#.....#........#.....#..U..U.....#.....#.....#",
    "#######..#..####..####..#..#############..####..U..U..#..##########..#",
    "#........#........#.....#....................#..U..U..#.....#..#.....#",
    "#........#........#.....#....................#..USSU..#.....#..#....M#",
    "#..#############FF#..#FF####..#FF##########..#..U##U..####..#..#..####",
    "#..#.....#.....#..#..#..#.....#.....#........#........#.....#.....#..#",
    "#..#.....#.....#..#..#..#.....#SSSSS#........#........#.....#.....#..#",
    "#..#..####..#..####..#..#..##########..#...TT#######FF#..####..####..#",
    "#.....#.....#........#..#..#...........#...........U..U..............#",
    "#.....#.....#........#SS#..#...........#...........U..U..............#",
    "#.TT..#..#######FF#######..#FF#..##########........U..U###..#######..#",
    "#.....#..#........#........#..#..#........#........U.....#.....#.....#",
    "#.....#..#SSSSSSSS#........#..#..#........#........U.....#.....#.....#",
    "#######..##########..#..#..#..#..#..#..#..#........##########..#..####",
    "#........#.....#.....#..#..#..#..#.....#..#........#...........#.....#",
    "#........#...........#..#..#SS#..#.....#..#........#...........#.....#",
    "#........#..#.....####..#..####..####..##########..#..####..#..####..#",
    "#........#..#.....#.....#.....#.....#...........#.....#..#..#..#.....#",
    "#........#..#.....#.....#.....#.....#...........#.....#..#..#..#.....#",
    "#.....K..#..#######..#######..####..#..####..##########..#..#..#..####",
    "#...........#.....#........#........#.....#....................#..#..#",
    "#...........#.....#........#........#.....#....................#..#..#",
    "#..U#########.....#FF####..#############..####..################..#..#",
    "#..U...........#..#.....#.....#.....#.....#..#..#...........#.....#..#",
    "#..U...........#..#SSSSS#.....#.....#.....#..#..#...........#.....#..#",
    "#..UT.U###..#..U..#######..#..####..#..####..#..#..####..#..#..####..#",
    "#..U..U.....U..U...........#........#.....#..#..#..#.....#..#..#.....#",
    "#..U..U.....U..U...........#........#.....#..#..#..#.....#..#..#.....#",
    "#..U.TU..###U..U#########..#######..####..#..#..#..#..#..#..#..#..####",
    "#..U..U.....U..U.....#..#........#.....#.....#.....#..#..#..#..#.....#",
    "#..U..U.....U..U.....#..#........#.....#.....#.....#..#..#..#..#.....#",
    "#..UT.U###..U..U..#..#..#..####..####..####..#.....#..#..#..#..####..#",
    "#..U.....#.....U..#.....#..#..#........#.....#.TTT.#..#..#.....#.....#",
    "#..U.....#..SSSU..#....M#..#..#........#.....#SSSSS#..#..#.....#.....#",
    "#..U###..#######.T#FF####..#..####..####..##########..#..#######..####",
    "#.....#.....#.....U..U.....#.....#........#...........#..............#",
    "#.....#S....#.....U..U.....#.....#........#...........#..............#",
    "#FF#######..#..#T.U..U..####..####..#############..#######FF#######..#",
    "#...........#..#..U..U...........#..#.....#.....#..#.....#.....#.....#",
    "#...........#..#..USSU...........#........#.....#SS#.....#SSSSS#.....#",
    "#..##########..#..UUUU.T####..#..#........#..#..####.....#######..####",
    "#.....#..#.....#.....#...........#...........#.................#.....#",
    "#.....#..#.....#.....#...........#TT.........#.................#.....#",
    "####FF#..#..######...####..#..#..#......TT#######..##########..####..#",
    "#.....#..#.....#.....#...........#........#.................#.....#..#",
    "#...M.#..#.....#.....#...........#..TT....#.................#.....#..#",
    "#FF####..####..#..#FF#..##########........#..##########FF#..#..#.....#",
    "#..............#.....#........#..............#...........#...........#",
    "#..............#....S#........#..............#.M.........#...........#",
    "#.....#######FF#..#######..#..#..#U##UUU#U##########FF#FF##########..#",
    "#.....#........#..............#..#U..U.U.U............#.....#######..#",
    "#.P...#........#..............#SS#UUSUUUSUUUSSSSSSSSSS#SSSSS#######SS#",
    "#UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#",
    "######################################################################",
    "######################################################################",
    "######################################################################"
  ],
  "messages": [
    "Пользовательский уровень. Проверяй свои ловушки честно."
  ],
  "labels": [],
  "buttonActions": {},
  "coinActions": {},
  "onKey": {},
  "triggers": [],
  "textZones": [
    {
      "id": "textZone0",
      "tx": 39,
      "ty": 18,
      "wTiles": 16,
      "hTiles": 15,
      "text": "Ракетки3"
    },
    {
      "id": "textZone1",
      "tx": 1,
      "ty": 23,
      "wTiles": 12,
      "hTiles": 19,
      "text": "Ракетки"
    },
    {
      "id": "textZone2",
      "tx": 33,
      "ty": 43,
      "wTiles": 10,
      "hTiles": 20,
      "text": "Ракетки2"
    },
    {
      "id": "textZone3",
      "tx": 15,
      "ty": 49,
      "wTiles": 7,
      "hTiles": 16,
      "text": "Здесь будет текст подсказки."
    },
    {
      "id": "textZone4",
      "tx": 1,
      "ty": 61,
      "wTiles": 5,
      "hTiles": 5,
      "text": "Тебестоитнайтхощ"
    }
  ],
  "hazards": {
    "hiddenSpikes": [],
    "saws": [
      {
        "id": "saw0",
        "tx": 54,
        "ty": 54,
        "r": 16,
        "axis": "x",
        "spanTiles": 0,
        "speed": 1,
        "t": 0,
        "active": true
      },
      {
        "id": "saw1",
        "tx": 54,
        "ty": 55,
        "r": 16,
        "axis": "x",
        "spanTiles": 0,
        "speed": 1,
        "t": 0,
        "active": true
      },
      {
        "id": "saw2",
        "tx": 54,
        "ty": 56,
        "r": 16,
        "axis": "x",
        "spanTiles": 0,
        "speed": 1,
        "t": 0,
        "active": true
      }
    ],
    "rockets": [],
    "turrets": [
      {
        "id": "turret0",
        "tx": 49,
        "ty": 23,
        "active": true,
        "radiusTiles": 10,
        "rocketSpeed": 3.50,
        "cooldownFrames": 300,
        "aggression": 1,
        "reactionFrames": 58,
        "turnDelayFrames": 34,
        "acceleration": 0.018,
        "maxSpeed": 2.1,
        "turnRate": 0.018,
        "speedScale": 0.45,
        "accelerationRampFrames": 76
      },
      {
        "id": "turret1",
        "tx": 2,
        "ty": 29,
        "active": true,
        "radiusTiles": 10,
        "rocketSpeed": 3.50,
        "cooldownFrames": 300,
        "aggression": 1,
        "reactionFrames": 58,
        "turnDelayFrames": 34,
        "acceleration": 0.018,
        "maxSpeed": 2.1,
        "turnRate": 0.018,
        "speedScale": 0.45,
        "accelerationRampFrames": 76
      },
      {
        "id": "turret2",
        "tx": 40,
        "ty": 53,
        "active": true,
        "radiusTiles": 10,
        "rocketSpeed": 3.50,
        "cooldownFrames": 300,
        "aggression": 1,
        "reactionFrames": 58,
        "turnDelayFrames": 34,
        "acceleration": 0.018,
        "maxSpeed": 2.1,
        "turnRate": 0.018,
        "speedScale": 0.45,
        "accelerationRampFrames": 76
      }
    ],
    "robots": [
      {
        "id": "robot0",
        "tx": 12,
        "ty": 5,
        "direction": "left",
        "maxSpeed": 2.2,
        "cooldownFrames": 90,
        "acceleration": 0.08
      },
      {
        "id": "robot1",
        "tx": 5,
        "ty": 26,
        "direction": "left",
        "maxSpeed": 2.2,
        "cooldownFrames": 90,
        "acceleration": 0.08
      },
      {
        "id": "robot2",
        "tx": 56,
        "ty": 26,
        "direction": "left",
        "maxSpeed": 2.2,
        "cooldownFrames": 90,
        "acceleration": 0.08
      },
      {
        "id": "robot3",
        "tx": 7,
        "ty": 65,
        "direction": "right",
        "maxSpeed": 2.2,
        "cooldownFrames": 90,
        "acceleration": 0.08
      }
    ],
    "fliers": [
      {
        "id": "flier0",
        "tx": 28,
        "ty": 4,
        "direction": "right",
        "speed": 1,
        "areaWidthTiles": 5,
        "areaHeightTiles": 5
      },
      {
        "id": "flier1",
        "tx": 41,
        "ty": 5,
        "direction": "right",
        "speed": 0.8,
        "areaWidthTiles": 3,
        "areaHeightTiles": 9
      },
      {
        "id": "flier2",
        "tx": 22,
        "ty": 7,
        "direction": "right",
        "speed": 0.5,
        "areaWidthTiles": 5,
        "areaHeightTiles": 5
      },
      {
        "id": "flier3",
        "tx": 56,
        "ty": 8,
        "direction": "right",
        "speed": 1.5,
        "areaWidthTiles": 3,
        "areaHeightTiles": 3
      },
      {
        "id": "flier4",
        "tx": 64,
        "ty": 16,
        "direction": "right",
        "speed": 0.6,
        "areaWidthTiles": 2,
        "areaHeightTiles": 5
      },
      {
        "id": "flier5",
        "tx": 25,
        "ty": 19,
        "direction": "right",
        "speed": 0.5,
        "areaWidthTiles": 2,
        "areaHeightTiles": 14
      },
      {
        "id": "flier6",
        "tx": 55,
        "ty": 22,
        "direction": "right",
        "speed": 0.6,
        "areaWidthTiles": 6,
        "areaHeightTiles": 2
      },
      {
        "id": "flier7",
        "tx": 35,
        "ty": 26,
        "direction": "right",
        "speed": 0.8,
        "areaWidthTiles": 3,
        "areaHeightTiles": 3
      },
      {
        "id": "flier8",
        "tx": 55,
        "ty": 31,
        "direction": "right",
        "speed": 0.7,
        "areaWidthTiles": 2,
        "areaHeightTiles": 5
      },
      {
        "id": "flier9",
        "tx": 43,
        "ty": 37,
        "direction": "right",
        "speed": 1,
        "areaWidthTiles": 2,
        "areaHeightTiles": 11
      },
      {
        "id": "flier10",
        "tx": 49,
        "ty": 37,
        "direction": "right",
        "speed": 0.6,
        "areaWidthTiles": 11,
        "areaHeightTiles": 2
      },
      {
        "id": "flier11",
        "tx": 16,
        "ty": 40,
        "direction": "right",
        "speed": 0.8,
        "areaWidthTiles": 9,
        "areaHeightTiles": 2
      },
      {
        "id": "flier12",
        "tx": 10,
        "ty": 43,
        "direction": "right",
        "speed": 0.8,
        "areaWidthTiles": 2,
        "areaHeightTiles": 5
      },
      {
        "id": "flier13",
        "tx": 58,
        "ty": 46,
        "direction": "right",
        "speed": 0.6,
        "areaWidthTiles": 5,
        "areaHeightTiles": 2
      },
      {
        "id": "flier14",
        "tx": 1,
        "ty": 52,
        "direction": "right",
        "speed": 0.5,
        "areaWidthTiles": 11,
        "areaHeightTiles": 2
      },
      {
        "id": "flier15",
        "tx": 29,
        "ty": 53,
        "direction": "left",
        "speed": 0.7,
        "areaWidthTiles": 3,
        "areaHeightTiles": 3
      },
      {
        "id": "flier16",
        "tx": 7,
        "ty": 55,
        "direction": "right",
        "speed": 0.8,
        "areaWidthTiles": 2,
        "areaHeightTiles": 8
      },
      {
        "id": "flier17",
        "tx": 26,
        "ty": 56,
        "direction": "down",
        "speed": 0.5,
        "areaWidthTiles": 3,
        "areaHeightTiles": 3
      },
      {
        "id": "flier18",
        "tx": 62,
        "ty": 59,
        "direction": "right",
        "speed": 0.7,
        "areaWidthTiles": 3,
        "areaHeightTiles": 3
      },
      {
        "id": "flier19",
        "tx": 25,
        "ty": 61,
        "direction": "down",
        "speed": 0.3,
        "areaWidthTiles": 5,
        "areaHeightTiles": 5
      }
    ],
    "mazeBots": [
      {
        "id": "mazeBot0",
        "tx": 5,
        "ty": 4,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot1",
        "tx": 16,
        "ty": 10,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot2",
        "tx": 29,
        "ty": 10,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot3",
        "tx": 40,
        "ty": 13,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot4",
        "tx": 52,
        "ty": 16,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot5",
        "tx": 1,
        "ty": 17,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot6",
        "tx": 19,
        "ty": 17,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot7",
        "tx": 58,
        "ty": 26,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot8",
        "tx": 19,
        "ty": 31,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot9",
        "tx": 37,
        "ty": 31,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot10",
        "tx": 46,
        "ty": 34,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot11",
        "tx": 63,
        "ty": 38,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot12",
        "tx": 28,
        "ty": 41,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot13",
        "tx": 23,
        "ty": 43,
        "direction": "down",
        "speed": 0.72
      },
      {
        "id": "mazeBot14",
        "tx": 49,
        "ty": 45,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot15",
        "tx": 55,
        "ty": 50,
        "direction": "right",
        "speed": 0.72
      },
      {
        "id": "mazeBot16",
        "tx": 43,
        "ty": 52,
        "direction": "right",
        "speed": 0.72
      }
    ],
    "mines": [],
    "wallMines": [
      {
        "id": "wallMine0",
        "tx": 4,
        "ty": 1,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine1",
        "tx": 35,
        "ty": 1,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine2",
        "tx": 49,
        "ty": 1,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine3",
        "tx": 12,
        "ty": 4,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine4",
        "tx": 13,
        "ty": 4,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine5",
        "tx": 14,
        "ty": 4,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine6",
        "tx": 46,
        "ty": 7,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine7",
        "tx": 59,
        "ty": 7,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine8",
        "tx": 28,
        "ty": 10,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine9",
        "tx": 7,
        "ty": 13,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine10",
        "tx": 52,
        "ty": 13,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine11",
        "tx": 14,
        "ty": 19,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine12",
        "tx": 63,
        "ty": 19,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine13",
        "tx": 19,
        "ty": 25,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine14",
        "tx": 64,
        "ty": 25,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine15",
        "tx": 65,
        "ty": 25,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine16",
        "tx": 14,
        "ty": 28,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine17",
        "tx": 16,
        "ty": 28,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine18",
        "tx": 15,
        "ty": 29,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine19",
        "tx": 64,
        "ty": 31,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine20",
        "tx": 26,
        "ty": 34,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine21",
        "tx": 60,
        "ty": 34,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine22",
        "tx": 26,
        "ty": 36,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine23",
        "tx": 35,
        "ty": 41,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine24",
        "tx": 35,
        "ty": 42,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine25",
        "tx": 16,
        "ty": 43,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine26",
        "tx": 22,
        "ty": 43,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine27",
        "tx": 22,
        "ty": 44,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine28",
        "tx": 56,
        "ty": 44,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine29",
        "tx": 22,
        "ty": 45,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine30",
        "tx": 56,
        "ty": 45,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine31",
        "tx": 8,
        "ty": 46,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine32",
        "tx": 26,
        "ty": 46,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine33",
        "tx": 28,
        "ty": 46,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine34",
        "tx": 29,
        "ty": 46,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine35",
        "tx": 26,
        "ty": 47,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine36",
        "tx": 65,
        "ty": 48,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine37",
        "tx": 11,
        "ty": 49,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine38",
        "tx": 67,
        "ty": 51,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine39",
        "tx": 65,
        "ty": 54,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine40",
        "tx": 30,
        "ty": 56,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine41",
        "tx": 29,
        "ty": 57,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine42",
        "tx": 31,
        "ty": 57,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine43",
        "tx": 30,
        "ty": 58,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine44",
        "tx": 19,
        "ty": 64,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine45",
        "tx": 20,
        "ty": 64,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine46",
        "tx": 21,
        "ty": 64,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine47",
        "tx": 22,
        "ty": 64,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine48",
        "tx": 23,
        "ty": 64,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine49",
        "tx": 24,
        "ty": 64,
        "side": "ceiling",
        "active": true
      }
    ],
    "lasers": [
      {
        "id": "laser0",
        "tx": 14,
        "ty": 10,
        "active": true,
        "radiusTiles": 5,
        "chargeMs": 2000,
        "fireMs": 230,
        "cooldownMs": 850
      },
      {
        "id": "laser1",
        "tx": 32,
        "ty": 59,
        "active": true,
        "radiusTiles": 12,
        "chargeMs": 2000,
        "fireMs": 230,
        "cooldownMs": 850
      }
    ],
    "slopes": [],
    "bombs": [
      {
        "id": "bomb0",
        "tx": 38,
        "ty": 2,
        "active": true
      },
      {
        "id": "bomb1",
        "tx": 43,
        "ty": 2,
        "active": true
      },
      {
        "id": "bomb2",
        "tx": 45,
        "ty": 2,
        "active": true
      },
      {
        "id": "bomb3",
        "tx": 47,
        "ty": 2,
        "active": true
      },
      {
        "id": "bomb4",
        "tx": 68,
        "ty": 2,
        "active": true
      },
      {
        "id": "bomb5",
        "tx": 64,
        "ty": 5,
        "active": true
      },
      {
        "id": "bomb6",
        "tx": 38,
        "ty": 8,
        "active": true
      },
      {
        "id": "bomb7",
        "tx": 68,
        "ty": 11,
        "active": true
      },
      {
        "id": "bomb8",
        "tx": 20,
        "ty": 14,
        "active": true
      },
      {
        "id": "bomb9",
        "tx": 31,
        "ty": 14,
        "active": true
      },
      {
        "id": "bomb10",
        "tx": 44,
        "ty": 14,
        "active": true
      },
      {
        "id": "bomb11",
        "tx": 7,
        "ty": 20,
        "active": true
      },
      {
        "id": "bomb12",
        "tx": 16,
        "ty": 20,
        "active": true
      },
      {
        "id": "bomb13",
        "tx": 17,
        "ty": 20,
        "active": true
      },
      {
        "id": "bomb14",
        "tx": 29,
        "ty": 20,
        "active": true
      },
      {
        "id": "bomb15",
        "tx": 68,
        "ty": 26,
        "active": true
      },
      {
        "id": "bomb16",
        "tx": 41,
        "ty": 29,
        "active": true
      },
      {
        "id": "bomb17",
        "tx": 15,
        "ty": 32,
        "active": true
      },
      {
        "id": "bomb18",
        "tx": 31,
        "ty": 38,
        "active": true
      },
      {
        "id": "bomb19",
        "tx": 68,
        "ty": 41,
        "active": true
      },
      {
        "id": "bomb20",
        "tx": 32,
        "ty": 50,
        "active": true
      },
      {
        "id": "bomb21",
        "tx": 44,
        "ty": 50,
        "active": true
      }
    ]
  }
});
