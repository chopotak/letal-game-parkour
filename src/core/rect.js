export function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function tileRect(tx, ty, tileSize) {
  return { x: tx * tileSize, y: ty * tileSize, w: tileSize, h: tileSize };
}
