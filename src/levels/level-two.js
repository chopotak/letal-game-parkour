export const LevelTwo = Object.freeze({
  "name": "Опасное место",
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
  "difficulty": 2,
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
    "################U...U#########",
    "################U...U#########",
    "#..............#U.T........U##",
    "#.K........................U##",
    "#..........................U##",
    "#######################U...U##",
    "#######################U...U##",
    "#...##...................T.U##",
    "#...##.....................U##",
    "#M..##.....................U##",
    "#...#######U...U##############",
    "#...#######U...U##############",
    "#............T........U#.....#",
    "#.....................U#.....#",
    "#.....................U#.....#",
    "##################U...##.....#",
    "##################U...##.....#",
    "#.....................U#.....#",
    "#.....................U#.....#",
    "#...P..................G..D..#",
    "##############################",
    "##############################",
    "##############################"
  ],
  "messages": [
    "Удачки в паркурах."
  ],
  "labels": [],
  "buttonActions": {},
  "coinActions": {},
  "onKey": {},
  "triggers": [],
  "textZones": [
    {
      "id": "textZone0",
      "tx": 16,
      "ty": 18,
      "wTiles": 7,
      "hTiles": 9,
      "text": "От черных стен отпрыгивать нельзя."
    },
    {
      "id": "textZone1",
      "tx": 1,
      "ty": 22,
      "wTiles": 14,
      "hTiles": 5,
      "text": "Тут можно цепляться за стены. Удерживайте A/D у стены, чтобы не падать, и нажимайте A/D + Space/W, чтобы оттолкнуться от нее."
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
    "wallMines": [],
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
