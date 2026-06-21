export const Level5 = Object.freeze({
  "name": "Мастер стен",
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
    "######################.........###.........#######",
    "######################....K....###.........#######",
    "##########.........###.........###....M....#######",
    "##########.........###...###...###.........#######",
    "##########.........###...###...###...###...#######",
    "##########.........###...###...###...###...#######",
    "##########.........###.........###...###...#######",
    "##########.........###.........###...###...#######",
    "##########...###...###.........###...###...#######",
    "####...###...###...###...###...###...###...#######",
    "####...###...###...###...###...###...###...#######",
    "####.........###...###...###...###...###...#.....#",
    "####.........###...###...###...###...###...#.....#",
    "####.........###...###...###...###...###...G...D.#",
    "####...###...###...###...###...###...#############",
    "####...###...###...###...###...###...#############",
    "####...###...###...###...###.........#####..##..##",
    "####...###...###...###...###.........#####..##..##",
    "####...###...###...###...###.........#######..####",
    "####...###...###...###...##################....###",
    "####...###...###...###...##################.##.###",
    "####...###...###...###...##################.##.###",
    "####...###...###.........#########################",
    "####...###...###.M.......#########################",
    "####...###...###.........#########################",
    "####...###...#####################################",
    "####...###...#####################################",
    "####.M.###...###.........#########################",
    "##########...###...#.#...#########################",
    "##########...###...#.#...#########################",
    "##########...###.........#########################",
    "#.......##...###..#...#..#########################",
    "#.......##...###...###...#########################",
    "#.......##...###.........#########################",
    "#..P.........#####################################",
    "#............#####################################",
    "##################################################",
    "##################################################",
    "##################################################"
  ],
  "messages": [
    "Мастер стен проверяет не скорость, а timing. Да, это хуже.",
    "Стена держит недолго. Дальше начинается честный спуск.",
    "Если мина мигает, она не здоровается.",
    "Отталкивайся от другой стены. Одна и та же быстро начинает обижаться."
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
    "robots": [],
    "fliers": [],
    "mines": [],
    "wallMines": [
      {
        "id": "wallMine0",
        "tx": 10,
        "ty": 3,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine1",
        "tx": 18,
        "ty": 3,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine2",
        "tx": 10,
        "ty": 4,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine3",
        "tx": 18,
        "ty": 4,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine4",
        "tx": 24,
        "ty": 4,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine5",
        "tx": 28,
        "ty": 4,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine6",
        "tx": 10,
        "ty": 5,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine7",
        "tx": 18,
        "ty": 5,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine8",
        "tx": 24,
        "ty": 5,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine9",
        "tx": 28,
        "ty": 5,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine10",
        "tx": 36,
        "ty": 5,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine11",
        "tx": 24,
        "ty": 6,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine12",
        "tx": 28,
        "ty": 6,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine13",
        "tx": 36,
        "ty": 6,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine14",
        "tx": 40,
        "ty": 7,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine15",
        "tx": 40,
        "ty": 8,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine16",
        "tx": 12,
        "ty": 9,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine17",
        "tx": 22,
        "ty": 9,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine18",
        "tx": 34,
        "ty": 9,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine19",
        "tx": 4,
        "ty": 10,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine20",
        "tx": 5,
        "ty": 10,
        "side": "ceiling",
        "active": true
      },
      {
        "id": "wallMine21",
        "tx": 6,
        "ty": 10,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine22",
        "tx": 12,
        "ty": 10,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine23",
        "tx": 22,
        "ty": 10,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine24",
        "tx": 34,
        "ty": 10,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine25",
        "tx": 42,
        "ty": 10,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine26",
        "tx": 4,
        "ty": 11,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine27",
        "tx": 6,
        "ty": 11,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine28",
        "tx": 42,
        "ty": 11,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine29",
        "tx": 4,
        "ty": 12,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine30",
        "tx": 18,
        "ty": 12,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine31",
        "tx": 24,
        "ty": 12,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine32",
        "tx": 28,
        "ty": 12,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine33",
        "tx": 36,
        "ty": 12,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine34",
        "tx": 4,
        "ty": 13,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine35",
        "tx": 18,
        "ty": 13,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine36",
        "tx": 24,
        "ty": 13,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine37",
        "tx": 28,
        "ty": 13,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine38",
        "tx": 36,
        "ty": 13,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine39",
        "tx": 40,
        "ty": 13,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine40",
        "tx": 4,
        "ty": 14,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine41",
        "tx": 40,
        "ty": 14,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine42",
        "tx": 10,
        "ty": 15,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine43",
        "tx": 16,
        "ty": 15,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine44",
        "tx": 22,
        "ty": 15,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine45",
        "tx": 30,
        "ty": 15,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine46",
        "tx": 34,
        "ty": 15,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine47",
        "tx": 10,
        "ty": 16,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine48",
        "tx": 16,
        "ty": 16,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine49",
        "tx": 22,
        "ty": 16,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine50",
        "tx": 30,
        "ty": 16,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine51",
        "tx": 34,
        "ty": 16,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine52",
        "tx": 6,
        "ty": 17,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine53",
        "tx": 6,
        "ty": 18,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine54",
        "tx": 12,
        "ty": 18,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine55",
        "tx": 18,
        "ty": 18,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine56",
        "tx": 24,
        "ty": 18,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine57",
        "tx": 12,
        "ty": 19,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine58",
        "tx": 18,
        "ty": 19,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine59",
        "tx": 24,
        "ty": 19,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine60",
        "tx": 4,
        "ty": 20,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine61",
        "tx": 4,
        "ty": 21,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine62",
        "tx": 10,
        "ty": 21,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine63",
        "tx": 16,
        "ty": 21,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine64",
        "tx": 22,
        "ty": 21,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine65",
        "tx": 10,
        "ty": 22,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine66",
        "tx": 16,
        "ty": 22,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine67",
        "tx": 22,
        "ty": 22,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine68",
        "tx": 6,
        "ty": 23,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine69",
        "tx": 6,
        "ty": 24,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine70",
        "tx": 12,
        "ty": 24,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine71",
        "tx": 12,
        "ty": 25,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine72",
        "tx": 10,
        "ty": 27,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine73",
        "tx": 10,
        "ty": 28,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine74",
        "tx": 12,
        "ty": 30,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine75",
        "tx": 12,
        "ty": 31,
        "side": "right",
        "active": true
      },
      {
        "id": "wallMine76",
        "tx": 10,
        "ty": 33,
        "side": "left",
        "active": true
      },
      {
        "id": "wallMine77",
        "tx": 10,
        "ty": 34,
        "side": "left",
        "active": true
      }
    ],
    "lasers": [],
    "slopes": [],
    "bombs": []
  },
  "difficulty": 4
});
