import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'

import {
  BEND_RADIUS,
  BEND_STRENGTH,
  GRID_CELL,
  bendPoint,
  cellFromPoint,
  cellPosition,
  horizontalLines,
  verticalLines,
} from '../lib/grid'

interface GridBackdropProps {
  children: ReactNode
}

interface Cell {
  col: number
  row: number
}

interface TrailCell extends Cell {
  // When the cell lit up, so the highlight can ramp in
  litAt: number
  // When the pointer left it, so the fade can start after the hold
  leftAt: number | null
}

interface Box {
  left: number
  top: number
  width: number
  height: number
}

interface Well {
  // Eased position of the cursor: the well slides toward it instead of snapping
  x: number
  y: number
  // Eased bend strength, 0 when the pointer is away
  strength: number
  targetX: number
  targetY: number
  targetStrength: number
}

// Cells that keep fading at the same time. A trail only stays on screen for the width of
// the viewport (~27 columns of 48px), so this covers any trail you can actually see. Past
// it the ring overwrites the oldest, most faded cell.
const POOL_SIZE = 32

// How far the well moves toward the cursor each frame. The grid lags a touch behind the
// pointer, which is what makes it read as something bending rather than jumping.
const EASE = 0.18

// Distance between samples along a grid line. 6px is well under the ~150px bend radius, so
// the curve stays smooth, and short enough that a 1280x384 backdrop is ~3.7k points.
const SAMPLE_STEP = 6

// Below these the motion is invisible; snapping the rest of the way lets the loop stop.
const SETTLED_POSITION = 0.25
const SETTLED_STRENGTH = 0.004

// Highlight timing. The cell ramps in fast so a flick still reaches full brightness, holds
// for a beat after the pointer leaves, then fades linearly — a shorter or eased fade made
// the trail read as a flick rather than a trail.
const ENTER_MS = 90
const HOLD_MS = 250
const FADE_MS = 1250
const TINT_ALPHA = 0.22

// Drafting grid behind every page title, drawn on a canvas so hovering can bend it like a
// mass sitting on a rubber sheet: every line is resampled through a radial pull toward the
// cursor. The hovered cell lights green and leaves a fading trail, and because the tint is
// drawn as the quad between that cell's four bent corners it bends with the grid instead of
// drifting off it. Touch gets the same effect: a tap pulses the grid under the finger and a
// sideways drag sweeps it, while vertical drags still scroll the page.
export function GridBackdrop({ children }: GridBackdropProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastRef = useRef<Cell | null>(null)
  const trailRef = useRef<Array<TrailCell | null>>(
    Array.from({ length: POOL_SIZE }, () => null),
  )
  const slotRef = useRef(0)
  const activeSlotRef = useRef(-1)
  // Cached so pointermove never reads layout: the writes below dirty style, and a read
  // straight after would force a synchronous layout on every cell change
  const boxRef = useRef<Box | null>(null)
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })
  const wellRef = useRef<Well>({
    x: 0,
    y: 0,
    strength: 0,
    targetX: 0,
    targetY: 0,
    targetStrength: 0,
  })
  const rafRef = useRef(0)
  const reduceRef = useRef(false)
  const strokeRef = useRef('rgba(255, 255, 255, 0.05)')
  const tintRef = useRef('74, 222, 128')

  const readColours = () => {
    const styles = getComputedStyle(document.documentElement)
    const [r, g, b] = styles.getPropertyValue('--foreground').trim().split(/[\s,]+/).map(Number)
    if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) {
      strokeRef.current = `rgba(${r}, ${g}, ${b}, 0.05)`
    }
    const tint = styles.getPropertyValue('--grid-hover').trim()
    if (tint) tintRef.current = tint.split(/[\s,]+/).join(', ')
  }

  const sizeCanvas = () => {
    const canvas = canvasRef.current
    const backdrop = backdropRef.current
    if (!canvas || !backdrop) return
    const { width, height } = backdrop.getBoundingClientRect()
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    sizeRef.current = { width, height, dpr }
    canvas.width = Math.max(1, Math.round(width * dpr))
    canvas.height = Math.max(1, Math.round(height * dpr))
    draw(performance.now())
  }

  const measure = () => {
    const backdrop = backdropRef.current
    if (!backdrop) return
    const { left, top, width, height } = backdrop.getBoundingClientRect()
    boxRef.current = { left, top, width, height }
    if (width !== sizeRef.current.width || height !== sizeRef.current.height) {
      sizeCanvas()
    }
  }

  const cellAlpha = (cell: TrailCell, now: number) => {
    if (reduceRef.current) return cell.leftAt === null ? 1 : 0
    const enter = Math.min(1, (now - cell.litAt) / ENTER_MS)
    // ease-out cubic, matching the CSS ramp the cell used to have
    const eased = 1 - (1 - enter) ** 3
    if (cell.leftAt === null) return eased
    const age = now - cell.leftAt
    if (age <= HOLD_MS) return eased
    const fade = 1 - (age - HOLD_MS) / FADE_MS
    return Math.max(0, eased * Math.min(1, fade))
  }

  const drawCells = (ctx: CanvasRenderingContext2D, now: number) => {
    const { width } = sizeRef.current
    const { x: cx, y: cy, strength } = wellRef.current
    for (let index = 0; index < POOL_SIZE; index += 1) {
      const cell = trailRef.current[index]
      if (!cell) continue
      const alpha = cellAlpha(cell, now)
      if (alpha <= 0) {
        // Once invisible the slot is free; reusing it later is then not a cut-short fade
        if (cell.leftAt !== null) trailRef.current[index] = null
        continue
      }
      const { x, y } = cellPosition(cell.col, cell.row, width)
      const corners = [
        bendPoint(x, y, cx, cy, strength),
        bendPoint(x + GRID_CELL, y, cx, cy, strength),
        bendPoint(x + GRID_CELL, y + GRID_CELL, cx, cy, strength),
        bendPoint(x, y + GRID_CELL, cx, cy, strength),
      ]
      ctx.beginPath()
      ctx.moveTo(corners[0].x, corners[0].y)
      for (let corner = 1; corner < 4; corner += 1) {
        ctx.lineTo(corners[corner].x, corners[corner].y)
      }
      ctx.closePath()
      ctx.fillStyle = `rgba(${tintRef.current}, ${TINT_ALPHA * alpha})`
      ctx.fill()
    }
  }

  const draw = (now: number) => {
    const canvas = canvasRef.current
    if (!canvas || canvas.width === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height, dpr } = sizeRef.current
    const { x: cx, y: cy, strength } = wellRef.current
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.lineWidth = 1

    // The 0.5 offset puts a 1px stroke on a pixel centre so straight lines stay crisp;
    // once bent the extra half pixel is irrelevant
    const half = 0.5
    // Past three radii the pull is e^-9, so those stretches can stay a straight two-point
    // segment. Only the band around the cursor gets resampled, which is what keeps this
    // affordable on a software canvas.
    const reach = BEND_RADIUS * 3
    const bent = strength > 0

    // One path and one stroke for the whole grid: 36 stroked paths cost noticeably more
    ctx.beginPath()
    ctx.strokeStyle = strokeRef.current

    for (const x of verticalLines(width)) {
      const lineX = x + half
      if (!bent || Math.abs(lineX - cx) >= reach) {
        ctx.moveTo(lineX, 0)
        ctx.lineTo(lineX, height)
        continue
      }
      const top = Math.max(0, cy - reach)
      const bottom = Math.min(height, cy + reach)
      ctx.moveTo(lineX, 0)
      if (top > 0) ctx.lineTo(lineX, top)
      for (let y = top; y < bottom; y += SAMPLE_STEP) {
        const point = bendPoint(lineX, y + half, cx, cy, strength)
        ctx.lineTo(point.x, point.y)
      }
      const end = bendPoint(lineX, bottom, cx, cy, strength)
      ctx.lineTo(end.x, end.y)
      if (bottom < height) ctx.lineTo(lineX, height)
    }

    for (const y of horizontalLines(height)) {
      const lineY = y + half
      if (!bent || Math.abs(lineY - cy) >= reach) {
        ctx.moveTo(0, lineY)
        ctx.lineTo(width, lineY)
        continue
      }
      const left = Math.max(0, cx - reach)
      const right = Math.min(width, cx + reach)
      ctx.moveTo(0, lineY)
      if (left > 0) ctx.lineTo(left, lineY)
      for (let x = left; x < right; x += SAMPLE_STEP) {
        const point = bendPoint(x, lineY, cx, cy, strength)
        ctx.lineTo(point.x, point.y)
      }
      const end = bendPoint(right, lineY, cx, cy, strength)
      ctx.lineTo(end.x, end.y)
      if (right < width) ctx.lineTo(width, lineY)
    }

    ctx.stroke()

    // Tint last, so the green sits over the lines the way the DOM cells did
    drawCells(ctx, now)
  }

  // True only while something can still change on screen. A lit cell that has finished its
  // ramp-in is static, so leaving it out lets the loop stop with the highlight still on.
  const hasLiveCells = (now: number) => {
    for (const cell of trailRef.current) {
      if (!cell) continue
      if (cell.leftAt !== null) return true
      if (now - cell.litAt < ENTER_MS) return true
    }
    return false
  }

  const tick = () => {
    const now = performance.now()
    const well = wellRef.current
    well.x += (well.targetX - well.x) * EASE
    well.y += (well.targetY - well.y) * EASE
    well.strength += (well.targetStrength - well.strength) * EASE

    const settled =
      Math.abs(well.targetX - well.x) < SETTLED_POSITION &&
      Math.abs(well.targetY - well.y) < SETTLED_POSITION &&
      Math.abs(well.targetStrength - well.strength) < SETTLED_STRENGTH

    if (settled) {
      well.x = well.targetX
      well.y = well.targetY
      well.strength = well.targetStrength
    }

    draw(now)

    if (settled && !hasLiveCells(now)) {
      rafRef.current = 0
      return
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const start = () => {
    if (rafRef.current === 0) rafRef.current = requestAnimationFrame(tick)
  }

  const releaseActive = (now: number) => {
    const slot = activeSlotRef.current
    if (slot >= 0) {
      const cell = trailRef.current[slot]
      if (cell && cell.leftAt === null) cell.leftAt = now
    }
    activeSlotRef.current = -1
    lastRef.current = null
  }

  const hide = () => {
    releaseActive(performance.now())
    wellRef.current.targetStrength = 0
    start()
  }

  useEffect(() => {
    readColours()
    measure()
    // The canvas reproduces the CSS grid, so the static background only has to cover the
    // pre-hydration paint; dropping it keeps the two from doubling their alpha
    if (canvasRef.current) backdropRef.current?.setAttribute('data-canvas', 'true')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceRef.current = reduced.matches
    const onReducedChange = () => {
      reduceRef.current = reduced.matches
      if (reduced.matches) {
        const well = wellRef.current
        well.strength = 0
        well.targetStrength = 0
      }
      draw(performance.now())
    }
    reduced.addEventListener('change', onReducedChange)

    const observer = new MutationObserver(() => {
      readColours()
      draw(performance.now())
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    })

    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, { passive: true })
    return () => {
      reduced.removeEventListener('change', onReducedChange)
      observer.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
  }, [])

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const box = boxRef.current
    if (!box) return

    const now = performance.now()
    const x = event.clientX - box.left
    const y = event.clientY - box.top

    if (!reduceRef.current) {
      const well = wellRef.current
      well.targetX = x
      well.targetY = y
      well.targetStrength = BEND_STRENGTH
    }

    if (y < 0 || y >= box.height) {
      hide()
      return
    }

    const cell = cellFromPoint(x, y, box.width)
    const last = lastRef.current
    if (last && last.col === cell.col && last.row === cell.row) {
      start()
      return
    }

    // The cell being left keeps fading where it sits; this one lights up in place. Only
    // after POOL_SIZE moves does a slot get reused, and by then that cell is the dimmest
    // end of the trail.
    releaseActive(now)
    const slot = slotRef.current
    slotRef.current = (slot + 1) % POOL_SIZE
    trailRef.current[slot] = { col: cell.col, row: cell.row, litAt: now, leftAt: null }
    activeSlotRef.current = slot
    lastRef.current = cell
    start()
  }

  return (
    // `pan-y` keeps vertical swipes scrolling (the browser then fires pointercancel) while a
    // sideways drag stays with the grid; `pinch-zoom` keeps zoom working
    <div
      className="relative touch-pan-y touch-pinch-zoom"
      onPointerEnter={measure}
      onPointerDown={handlePointerMove}
      onPointerMove={handlePointerMove}
      onPointerLeave={hide}
      onPointerCancel={hide}
    >
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="grid-backdrop pointer-events-none absolute inset-x-0 top-0 h-[24rem]"
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
      {children}
    </div>
  )
}
