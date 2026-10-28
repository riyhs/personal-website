import { describe, expect, it } from 'vitest'

import { GRID_CELL, cellFromPoint, cellPosition } from './grid'

// A centered tile starts at (width - 48) / 2: 1280 -> 616, 1000 -> 476
describe('cellFromPoint', () => {
  it('starts cell 0 at the centered tile origin', () => {
    expect(cellFromPoint(616, 0, 1280)).toEqual({ col: 0, row: 0 })
    expect(cellFromPoint(476, 0, 1000)).toEqual({ col: 0, row: 0 })
  })

  it('keeps a cell 48px wide and tall', () => {
    expect(cellFromPoint(616 + 47, 0, 1280).col).toBe(0)
    expect(cellFromPoint(616 + 48, 0, 1280).col).toBe(1)
    expect(cellFromPoint(616, 47, 1280).row).toBe(0)
    expect(cellFromPoint(616, 48, 1280).row).toBe(1)
  })

  it('maps points left of the origin to negative cells', () => {
    // 400 falls in the tile spanning 376..424
    expect(cellFromPoint(400, 148, 1280)).toEqual({ col: -5, row: 3 })
    expect(cellFromPoint(0, 0, 1280).col).toBe(-13)
    expect(cellFromPoint(615, 0, 1280).col).toBe(-1)
  })
})

describe('cellPosition', () => {
  it('returns the top-left corner of a cell', () => {
    expect(cellPosition(0, 0, 1280)).toEqual({ x: 616, y: 0 })
    expect(cellPosition(-5, 3, 1280)).toEqual({ x: 376, y: 144 })
    expect(cellPosition(0, 4, 390)).toEqual({ x: 171, y: 192 })
  })

  it('is the inverse of cellFromPoint at both cell edges', () => {
    for (const col of [-13, -5, 0, 1, 7, 25]) {
      for (const row of [0, 1, 7]) {
        const { x, y } = cellPosition(col, row, 1280)
        expect(cellFromPoint(x, y, 1280)).toEqual({ col, row })
        expect(cellFromPoint(x + GRID_CELL - 1, y + GRID_CELL - 1, 1280)).toEqual({
          col,
          row,
        })
      }
    }
  })
})
