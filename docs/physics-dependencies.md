# Physics And Hazard Dependencies

Keep this checklist short and use it before touching movement, slopes, rockets, lasers, or editor export.

## Core Files

- `src/core/physicsWorld.js`: player movement, wall latch, jumps, slopes, collisions.
- `src/core/game.js`: runtime hazards, triggers, text zones, pickup checks.
- `src/core/level.js`: level data normalization, hitboxes, solid/slope lookup.
- `src/editor/levelEditor.js`: editor metadata, export/import shape.
- `src/rendering/spritePainter.js`: visible sprites only.
- `src/rendering/gameRenderer.js`: camera, hitbox debug, draw order.

## Movement Rules To Preserve

- Never reset velocity when switching state unless death/spawn requires it.
- Wall contact uses two timers: latch/control lock and slide delay. Do not merge them.
- Slope uphill input must not add downhill slide force.
- Slope idle/downhill movement may slide; uphill movement must stay controllable.
- `S` double tap drops through floor slopes by temporarily ignoring slope support.

## Visibility Rules

- Solid blocks `#`/`F`/closed gates block turret, rocket, and laser line of sight.
- Slopes are physical player surfaces, but do not block turret/rocket sight or rocket collision.
- Laser beams are finite segments from laser to nearest solid block or max radius.
- Detection radii are editor-only. Do not draw them in gameplay or hitbox debug.

## Editor Export Contract

- Runtime-only action zones use `triggers`.
- Text-only zones use top-level `textZones`.
- Hazard metadata must import back into the same editor tool with the same properties.

## Minimum Checks After Changes

- Run JS syntax checks.
- Export/import one editor level.
- Test: wall jump after pressing away within 500 ms.
- Test: idle slope slide, uphill slope movement, double `S` slope drop.
- Test: turret cannot shoot through a wall, rocket dies on square blocks, laser stops at blocks.
