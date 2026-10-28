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
