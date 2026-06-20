export const LevelTwo = Object.freeze({
  "name": "Второй уровень бытия",
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
  "physicsMode": "moon",
  "physicsOverrides": {},
  "camera": {
    "deadZoneWidth": 200,
    "deadZoneHeight": 150,
    "startOffsetX": 0,
    "startOffsetY": 0
  },
  "map": [
    "##############################",
    "#...##################.......#",
    "#.M.##################.......#",
    "#...##################.......#",
    "#............................#",
    "#..........................M.#",
    "#............................#",
    "#################...##########",
    "#################...##########",
    "#..............##.T........###",
    "#.K........................###",
    "#..........................###",
    "########################...###",
    "########################...###",
    "#...##...................T.###",
    "#...##.....................###",
    "#M..##.....................###",
    "#...########...###############",
    "#...########...###############",
    "#............T........##.....#",
    "#.....................##.....#",
    "#.....................##.....#",
    "###################...##.....#",
    "###################...##.....#",
    "#.....................##.....#",
    "#.....................##.....#",
    "#...P..................G..D..#",
    "##############################",
    "##############################",
    "##############################"
  ],
  "messages": [
    "Стены здесь не декорация. Они ждут, когда ты начнешь от них отталкиваться.",
    "A/D плюс Space у стены - и кот делает вид, что так и было задумано.",
    "Монетки выглядят одинаково. Лабиринт этим очень гордится.",
    "Если робот летит по маршруту, это не значит, что маршрут одобряет тебя."
  ],
  "labels": [],
  "buttonActions": {},
  "coinActions": {},
  "onKey": {},
  "triggers": [],
  "textZones": [
    {
      "id": "tutorialWall0",
      "tx": 1,
      "ty": 22,
      "wTiles": 14,
      "hTiles": 5,
      "text": "У стены можно цепляться и отталкиваться: держи A/D к стене и нажми Space."
    },
    {
      "id": "tutorialWall1",
      "tx": 15,
      "ty": 18,
      "wTiles": 12,
      "hTiles": 5,
      "text": "Отпрыгивай от стены заранее. Поздний прыжок обычно звучит как шипы."
    }
  ],
  "hazards": {
    "hiddenSpikes": [],
    "saws": [],
    "rockets": [],
    "turrets": [],
    "robots": [],
    "fliers": [
      {
        "id": "flier0",
        "tx": 1,
        "ty": 9,
        "direction": "right",
        "speed": 1,
        "areaWidthTiles": 14,
        "areaHeightTiles": 3
      },
      {
        "id": "flier1",
        "tx": 24,
        "ty": 9,
        "direction": "left",
        "speed": 0.8,
        "areaWidthTiles": 3,
        "areaHeightTiles": 8
      },
      {
        "id": "flier2",
        "tx": 6,
        "ty": 14,
        "direction": "down",
        "speed": 0.8,
        "areaWidthTiles": 21,
        "areaHeightTiles": 3
      }
    ],
    "mines": [
      {
        "id": "mine0",
        "tx": 6,
        "ty": 6,
        "active": true
      },
      {
        "id": "mine1",
        "tx": 11,
        "ty": 6,
        "active": true
      },
      {
        "id": "mine2",
        "tx": 8,
        "ty": 21,
        "active": true
      },
      {
        "id": "mine3",
        "tx": 9,
        "ty": 26,
        "active": true
      },
      {
        "id": "mine4",
        "tx": 14,
        "ty": 26,
        "active": true
      }
    ],
    "lasers": [
      {
        "id": "laser0",
        "tx": 27,
        "ty": 2,
        "active": true,
        "radiusTiles": 7,
        "chargeMs": 2000,
        "fireMs": 230,
        "cooldownMs": 850
      }
    ],
    "slopes": [],
    "bombs": [
      {
        "id": "bomb0",
        "tx": 3,
        "ty": 14,
        "active": true
      },
      {
        "id": "bomb1",
        "tx": 3,
        "ty": 16,
        "active": true
      },
      {
        "id": "bomb2",
        "tx": 3,
        "ty": 18,
        "active": true
      }
    ]
  }
});
