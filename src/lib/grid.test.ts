import { describe, expect, it } from 'vitest'

import {
  BEND_RADIUS,
  BEND_STRENGTH,
  GRID_CELL,
  bendPoint,
  cellFromPoint,
  cellPosition,
  horizontalLines,
  verticalLines,
} from './grid'

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

describe('bendPoint', () => {
  it('leaves every point alone with no strength', () => {
    expect(bendPoint(300, 120, 640, 192, 0)).toEqual({ x: 300, y: 120 })
  })

  it('leaves the point under the cursor where it is', () => {
    expect(bendPoint(640, 192, 640, 192)).toEqual({ x: 640, y: 192 })
  })

  it('pulls points toward the cursor and never past it', () => {
    const { x } = bendPoint(640 + BEND_RADIUS, 192, 640, 192)
    expect(x).toBeLessThan(640 + BEND_RADIUS)
    expect(x).toBeGreaterThan(640)
  })

  it('pulls the rim by e^-1 of the peak strength', () => {
    const distance = BEND_RADIUS
    const { x } = bendPoint(640 + distance, 192, 640, 192)
    expect(640 + distance - x).toBeCloseTo(distance * BEND_STRENGTH * Math.exp(-1), 6)
  })

  it('is local: three radii out the grid is flat again', () => {
    const near = 640 + BEND_RADIUS
    const far = 640 + BEND_RADIUS * 3
    const nearPull = near - bendPoint(near, 192, 640, 192).x
    const farPull = far - bendPoint(far, 192, 640, 192).x
    expect(nearPull).toBeGreaterThan(10)
    expect(farPull).toBeLessThan(0.05)
  })

  it('keeps a point on the vertical axis on that axis', () => {
    const { x } = bendPoint(640, 400, 640, 192)
    expect(x).toBeCloseTo(640, 9)
  })

  it('is symmetric around the cursor', () => {
    const left = bendPoint(540, 192, 640, 192)
    const right = bendPoint(740, 192, 640, 192)
    expect(640 - left.x).toBeCloseTo(right.x - 640, 9)
  })
})

describe('verticalLines', () => {
  it('starts at the centred tile origin and steps by one cell', () => {
    const lines = verticalLines(1280)
    expect(lines).toContain(616)
    expect(lines).toContain(616 + GRID_CELL)
    expect(lines).toContain(616 - GRID_CELL)
    for (let i = 1; i < lines.length; i += 1) {
      expect(lines[i] - lines[i - 1]).toBeCloseTo(GRID_CELL, 9)
    }
  })

  it('covers the width without drawing off-screen lines', () => {
    for (const width of [390, 768, 1280, 1920]) {
      const lines = verticalLines(width)
      expect(lines[0]).toBeGreaterThanOrEqual(0)
      expect(lines[lines.length - 1]).toBeLessThanOrEqual(width)
      expect(lines.length).toBeGreaterThanOrEqual(Math.floor(width / GRID_CELL))
    }
  })
})

describe('horizontalLines', () => {
  it('runs from the top edge every cell down to the bottom', () => {
    expect(horizontalLines(384)).toEqual([0, 48, 96, 144, 192, 240, 288, 336, 384])
  })
})
