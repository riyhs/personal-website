export const GRID_CELL = 48

// Mirrors `.grid-backdrop`'s `background-position: center top`, so a point maps to the
// same 48px tile the grid lines are drawn in. Coordinates are relative to the backdrop.
export function cellFromPoint(x: number, y: number, width: number) {
  const originX = (width - GRID_CELL) / 2
  return {
    col: Math.floor((x - originX) / GRID_CELL),
    row: Math.floor(y / GRID_CELL),
  }
}

// Top-left corner of a cell, in backdrop coordinates. Inverse of `cellFromPoint`.
export function cellPosition(col: number, row: number, width: number) {
  return {
    x: (width - GRID_CELL) / 2 + col * GRID_CELL,
    y: row * GRID_CELL,
  }
}

// Cells around a centre cell grouped into rings, for the intro ripple: ring k holds the
// cells whose centres round to k cells away. Four rings are 1 + 8 + 12 + 16 = 37 cells,
// which fits the 40-cell trail pool without overwriting a ring that is still visible.
export function rippleRings(col: number, row: number, rings: number) {
  const result = Array.from({ length: rings }, () => [] as Array<{ col: number; row: number }>)
  for (let dy = -rings; dy <= rings; dy += 1) {
    for (let dx = -rings; dx <= rings; dx += 1) {
      const ring = Math.round(Math.hypot(dx, dy))
      if (ring < rings) result[ring].push({ col: col + dx, row: row + dy })
    }
  }
  return result
}

// Reach of the well: how far from the cursor the grid feels it. The pull is a bell curve,
// so the sheet is flat again by three radii out and the rest of the grid never drifts.
export const BEND_RADIUS = 150

// Peak fraction of the distance to the centre that the grid closes. 0.3 keeps the 48px
// spacing from collapsing on itself: the tightest cells stay above 30px.
export const BEND_STRENGTH = 0.4

// A point dragged toward the well. Points at the centre stay put (there is no direction to
// pull), the pull peaks halfway out, and e^-9 of it is left at three radii, so the dent is
// local. A 1/r² falloff instead leaves the whole viewport sliding toward the cursor.
export function bendPoint(
  x: number,
  y: number,
  cx: number,
  cy: number,
  strength = BEND_STRENGTH,
) {
  if (strength <= 0) return { x, y }
  const dx = x - cx
  const dy = y - cy
  const falloff = Math.exp(-(dx * dx + dy * dy) / (BEND_RADIUS * BEND_RADIUS))
  const pull = strength * falloff
  return { x: cx + dx * (1 - pull), y: cy + dy * (1 - pull) }
}

// Mirror of `.grid-backdrop`'s `background-position: center top` tiling, as the x positions
// the canvas has to stroke. K is the tile index, so the list covers the whole width.
export function verticalLines(width: number) {
  const originX = (width - GRID_CELL) / 2
  const first = Math.ceil(-originX / GRID_CELL)
  const last = Math.floor((width - originX) / GRID_CELL)
  const lines: number[] = []
  for (let k = first; k <= last; k += 1) lines.push(originX + k * GRID_CELL)
  return lines
}

export function horizontalLines(height: number) {
  const lines: number[] = []
  for (let y = 0; y <= height; y += GRID_CELL) lines.push(y)
  return lines
}
