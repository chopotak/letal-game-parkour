export const CustomLevelLast = Object.freeze({
  "name": "Летальность бытия",
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
    "##################################################",
    "##..............................................U#",
    "##..............................................U#",
    "##..............................................U#",
    "##............######.........########...........U#",
    "#U...........########.......##########..........U#",
    "#U.....######......###.....###......###.........U#",
    "#U..########........##..M..##........##..TT.....U#",
    "##..U...............##.....##........##.........U#",
    "##..U.###...........##.....##........##......TT.U#",
    "##..U..K#...........#########........##.........U#",
    "#U..#.###............#######.............TT.....U#",
    "#U..#.......................................M...U#",
    "#U..#######..........................##.........U#",
    "##..U#######.........................###........U#",
    "##........###...TT....................############",
    "##.........##...................#......###########",
    "#U..#...M..##......######......###............####",
    "#UT.##.....##.....########......###...........####",
    "#U..###.SS.##....U##....###......#...........#####",
    "#U..#######UU....##......##.................######",
    "#U....####UU.....##......U#.TT.............#######",
    "#U....U#.........##....M.U#...............###....#",
    "#UT...U#.........U#......U#...............##.....#",
    "#U....U#......TT.U#.TT...U#....TT...#.....##....D#",
    "#U....U#.........U#......U#........###....##...###",
    "#U....U#..TT......##.....##.........#...M.##..####",
    "#U...TU#...........#U....###..............##..####",
    "#U....U#......TT...##....#####.........#####...###",
    "#U.....##..........##....U#####.......######....##",
    "#U......##.......M.##....UUUUU##.....###...##....#",
    "#UT......##........#U..........########.....##...#",
    "#U........##########.............#####......###..#",
    "#U.........########.........................###..#",
    "##.....................TT...................###..#",
    "###......................................P...#...#",
    "####..................SSSS...................G...#",
    "##################################################",
    "##################################################",
    "##################################################"
  ],
  "messages": [
    "Пользовательский уровень. Проверяй свои ловушки честно."
  ],
  "labels": [],
  "buttonActions": {},
  "coinActions": {},
  "onKey": {},
  "triggers": [],
  "textZones": [],
  "hazards": {
    "hiddenSpikes": [],
    "saws": [
      {
        "id": "saw0",
        "tx": 9,
        "ty": 3,
        "r": 16,
        "axis": "y",
        "spanTiles": 3,
        "speed": 0.8,
        "t": 0,
        "active": true
      }
    ],
    "rockets": [],
    "turrets": [
      {
        "id": "turret0",
        "tx": 31,
        "ty": 7,
        "active": true,
        "radiusTiles": 12,
        "rocketSpeed": 0.32,
        "cooldownFrames": 500,
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
        "tx": 41,
        "ty": 19,
        "active": true,
        "radiusTiles": 12,
        "rocketSpeed": 0.32,
        "cooldownFrames": 500,
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
        "tx": 9,
        "ty": 23,
        "active": true,
        "radiusTiles": 13,
        "rocketSpeed": 0.32,
        "cooldownFrames": 500,
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
        "tx": 22,
        "ty": 9,
        "direction": "right",
        "maxSpeed": 2.2,
        "cooldownFrames": 90,
        "acceleration": 0.08
      },
      {
        "id": "robot1",
        "tx": 40,
        "ty": 14,
        "direction": "right",
        "maxSpeed": 2.2,
        "cooldownFrames": 90,
        "acceleration": 0.08
      },
      {
        "id": "robot2",
        "tx": 11,
        "ty": 31,
        "direction": "right",
        "maxSpeed": 2.2,
        "cooldownFrames": 90,
        "acceleration": 0.08
      }
    ],
    "fliers": [
      {
        "id": "flier0",
        "tx": 5,
        "ty": 8,
        "direction": "right",
        "speed": 1,
        "areaWidthTiles": 5,
        "areaHeightTiles": 5
      },
      {
        "id": "flier1",
        "tx": 32,
        "ty": 30,
        "direction": "right",
        "speed": 0.8,
        "areaWidthTiles": 5,
        "areaHeightTiles": 1
      }
    ],
    "mazeBots": [],
    "mines": [],
    "wallMines": [
      {
        "id": "wallMine0",
        "tx": 15,
        "ty": 3,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine1",
        "tx": 16,
        "ty": 3,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine2",
        "tx": 17,
        "ty": 3,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine3",
        "tx": 32,
        "ty": 3,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine4",
        "tx": 33,
        "ty": 3,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine5",
        "tx": 34,
        "ty": 3,
        "side": "floor",
        "active": true
      },
      {
        "id": "wallMine6",
        "tx": 29,
        "ty": 8,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine7",
        "tx": 36,
        "ty": 8,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine8",
        "tx": 29,
        "ty": 9,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine9",
        "tx": 36,
        "ty": 9,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine10",
        "tx": 29,
        "ty": 10,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine11",
        "tx": 36,
        "ty": 10,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine12",
        "tx": 10,
        "ty": 17,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine13",
        "tx": 10,
        "ty": 18,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine14",
        "tx": 27,
        "ty": 19,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine15",
        "tx": 27,
        "ty": 20,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine16",
        "tx": 27,
        "ty": 21,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine17",
        "tx": 27,
        "ty": 22,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine18",
        "tx": 27,
        "ty": 23,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine19",
        "tx": 27,
        "ty": 24,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine20",
        "tx": 27,
        "ty": 25,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine21",
        "tx": 45,
        "ty": 26,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine22",
        "tx": 45,
        "ty": 27,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine23",
        "tx": 47,
        "ty": 33,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine24",
        "tx": 11,
        "ty": 34,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine25",
        "tx": 12,
        "ty": 34,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine26",
        "tx": 17,
        "ty": 34,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine27",
        "tx": 18,
        "ty": 34,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine28",
        "tx": 47,
        "ty": 34,
        "side": "left",
        "active": true
      }
    ],
    "lasers": [
      {
        "id": "laser0",
        "tx": 14,
        "ty": 7,
        "active": true,
        "radiusTiles": 15,
        "chargeMs": 2000,
        "fireMs": 230,
        "cooldownMs": 850
      },
      {
        "id": "laser1",
        "tx": 20,
        "ty": 20,
        "active": true,
        "radiusTiles": 12,
        "chargeMs": 2000,
        "fireMs": 230,
        "cooldownMs": 850
      },
      {
        "id": "laser2",
        "tx": 2,
        "ty": 26,
        "active": true,
        "radiusTiles": 8,
        "chargeMs": 2000,
        "fireMs": 230,
        "cooldownMs": 850
      },
      {
        "id": "laser3",
        "tx": 29,
        "ty": 26,
        "active": true,
        "radiusTiles": 14,
        "chargeMs": 2000,
        "fireMs": 230,
        "cooldownMs": 850
      }
    ],
    "slopes": [
      {
        "id": "slope0",
        "tx": 2,
        "ty": 1,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope1",
        "tx": 13,
        "ty": 4,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope2",
        "tx": 20,
        "ty": 4,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope3",
        "tx": 28,
        "ty": 4,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope4",
        "tx": 37,
        "ty": 4,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope5",
        "tx": 21,
        "ty": 5,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope6",
        "tx": 27,
        "ty": 5,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope7",
        "tx": 38,
        "ty": 5,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope8",
        "tx": 6,
        "ty": 6,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope9",
        "tx": 13,
        "ty": 6,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope10",
        "tx": 18,
        "ty": 6,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope11",
        "tx": 30,
        "ty": 6,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope12",
        "tx": 35,
        "ty": 6,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope13",
        "tx": 12,
        "ty": 7,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope14",
        "tx": 19,
        "ty": 7,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope15",
        "tx": 29,
        "ty": 7,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope16",
        "tx": 36,
        "ty": 7,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope17",
        "tx": 20,
        "ty": 11,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope18",
        "tx": 28,
        "ty": 11,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope19",
        "tx": 11,
        "ty": 13,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope20",
        "tx": 39,
        "ty": 13,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope21",
        "tx": 12,
        "ty": 14,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope22",
        "tx": 9,
        "ty": 15,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope23",
        "tx": 37,
        "ty": 15,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope24",
        "tx": 10,
        "ty": 16,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope25",
        "tx": 31,
        "ty": 16,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope26",
        "tx": 33,
        "ty": 16,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope27",
        "tx": 38,
        "ty": 16,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope28",
        "tx": 5,
        "ty": 17,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope29",
        "tx": 18,
        "ty": 17,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope30",
        "tx": 25,
        "ty": 17,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope31",
        "tx": 34,
        "ty": 17,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope32",
        "tx": 45,
        "ty": 17,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope33",
        "tx": 6,
        "ty": 18,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope34",
        "tx": 17,
        "ty": 18,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope35",
        "tx": 26,
        "ty": 18,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope36",
        "tx": 31,
        "ty": 18,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope37",
        "tx": 45,
        "ty": 18,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope38",
        "tx": 7,
        "ty": 19,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope39",
        "tx": 10,
        "ty": 19,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope40",
        "tx": 20,
        "ty": 19,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope41",
        "tx": 23,
        "ty": 19,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope42",
        "tx": 32,
        "ty": 19,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope43",
        "tx": 34,
        "ty": 19,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope44",
        "tx": 44,
        "ty": 19,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope45",
        "tx": 19,
        "ty": 20,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope46",
        "tx": 24,
        "ty": 20,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope47",
        "tx": 43,
        "ty": 20,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope48",
        "tx": 5,
        "ty": 21,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope49",
        "tx": 42,
        "ty": 21,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope50",
        "tx": 8,
        "ty": 22,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope51",
        "tx": 45,
        "ty": 22,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope52",
        "tx": 44,
        "ty": 23,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope53",
        "tx": 35,
        "ty": 24,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope54",
        "tx": 37,
        "ty": 24,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope55",
        "tx": 19,
        "ty": 25,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope56",
        "tx": 46,
        "ty": 25,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope57",
        "tx": 17,
        "ty": 26,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope58",
        "tx": 20,
        "ty": 26,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope59",
        "tx": 27,
        "ty": 26,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope60",
        "tx": 35,
        "ty": 26,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope61",
        "tx": 37,
        "ty": 26,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope62",
        "tx": 18,
        "ty": 27,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope63",
        "tx": 28,
        "ty": 27,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope64",
        "tx": 8,
        "ty": 28,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope65",
        "tx": 30,
        "ty": 28,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope66",
        "tx": 38,
        "ty": 28,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope67",
        "tx": 46,
        "ty": 28,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope68",
        "tx": 6,
        "ty": 29,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope69",
        "tx": 9,
        "ty": 29,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope70",
        "tx": 31,
        "ty": 29,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope71",
        "tx": 37,
        "ty": 29,
        "rotation": 0,
        "sizeTiles": 1
      },
      {
        "id": "slope72",
        "tx": 44,
        "ty": 29,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope73",
        "tx": 47,
        "ty": 29,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope74",
        "tx": 7,
        "ty": 30,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope75",
        "tx": 10,
        "ty": 30,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope76",
        "tx": 40,
        "ty": 30,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope77",
        "tx": 42,
        "ty": 30,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope78",
        "tx": 45,
        "ty": 30,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope79",
        "tx": 48,
        "ty": 30,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope80",
        "tx": 8,
        "ty": 31,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope81",
        "tx": 30,
        "ty": 31,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope82",
        "tx": 39,
        "ty": 31,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope83",
        "tx": 43,
        "ty": 31,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope84",
        "tx": 46,
        "ty": 31,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope85",
        "tx": 9,
        "ty": 32,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope86",
        "tx": 20,
        "ty": 32,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope87",
        "tx": 32,
        "ty": 32,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope88",
        "tx": 38,
        "ty": 32,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope89",
        "tx": 10,
        "ty": 33,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope90",
        "tx": 19,
        "ty": 33,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope91",
        "tx": 2,
        "ty": 34,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope92",
        "tx": 3,
        "ty": 35,
        "rotation": 90,
        "sizeTiles": 1
      },
      {
        "id": "slope93",
        "tx": 44,
        "ty": 35,
        "rotation": 270,
        "sizeTiles": 1
      },
      {
        "id": "slope94",
        "tx": 46,
        "ty": 35,
        "rotation": 180,
        "sizeTiles": 1
      },
      {
        "id": "slope95",
        "tx": 4,
        "ty": 36,
        "rotation": 90,
        "sizeTiles": 1
      }
    ],
    "bombs": [
      {
        "id": "bomb0",
        "tx": 14,
        "ty": 36,
        "active": true
      },
      {
        "id": "bomb1",
        "tx": 15,
        "ty": 36,
        "active": true
      }
    ]
  }
});
