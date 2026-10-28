import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react'

import { cellFromPoint, cellPosition } from '../lib/grid'

interface GridBackdropProps {
  children: ReactNode
}

interface Cell {
  col: number
  row: number
}

interface Box {
  left: number
  top: number
  width: number
  height: number
}

// Cells that keep fading at the same time. A trail only stays on screen for the width of
// the viewport (~27 columns of 48px), so this covers any trail you can actually see. Past
// it the ring overwrites the oldest, most faded cell.
const POOL_SIZE = 32

// Drafting grid behind every page title. Hovering a cell tints only that cell; every cell
// you cross keeps fading on its own, so a fast sweep leaves a trail. Each tint sits inside
// `.grid-backdrop`, so they inherit its bottom-fade mask and stay dimmer toward the bottom.
export function GridBackdrop({ children }: GridBackdropProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const cellsRef = useRef<Array<HTMLSpanElement | null>>([])
  // Ring index of the next cell to light, so a fade is only cut short after POOL_SIZE moves
  const cursorRef = useRef(0)
  const activeRef = useRef<HTMLSpanElement | null>(null)
  const lastRef = useRef<Cell | null>(null)
  // Cached so pointermove never reads layout: the writes below dirty style, and a read
  // straight after would force a synchronous layout on every cell change
  const boxRef = useRef<Box | null>(null)

  const measure = () => {
    const backdrop = backdropRef.current
    if (!backdrop) return
    const { left, top, width, height } = backdrop.getBoundingClientRect()
    boxRef.current = { left, top, width, height }
  }

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, { passive: true })
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
    }
  }, [])

  const hide = () => {
    activeRef.current?.classList.remove('is-active')
    activeRef.current = null
    lastRef.current = null
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return

    const box = boxRef.current
    if (!box) return

    const y = event.clientY - box.top
    if (y < 0 || y >= box.height) {
      hide()
      return
    }

    const cell = cellFromPoint(event.clientX - box.left, y, box.width)
    const last = lastRef.current
    if (last && last.col === cell.col && last.row === cell.row) return
    lastRef.current = cell

    // Take the next ring slot: the cell leaving keeps fading where it sits, and this one
    // lights up in place. Only after POOL_SIZE moves does a slot get reused, and by then
    // that cell is the dimmest end of the trail.
    const next = cellsRef.current[cursorRef.current]
    if (!next) return
    cursorRef.current = (cursorRef.current + 1) % POOL_SIZE

    const { x, y: cellY } = cellPosition(cell.col, cell.row, box.width)
    next.style.transform = `translate3d(${x}px, ${cellY}px, 0)`
    activeRef.current?.classList.remove('is-active')
    activeRef.current = next
    next.classList.add('is-active')
  }

  return (
    <div
      className="relative"
      onPointerEnter={measure}
      onPointerMove={handlePointerMove}
      onPointerLeave={hide}
    >
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="grid-backdrop pointer-events-none absolute inset-x-0 top-0 h-[24rem]"
      >
        {Array.from({ length: POOL_SIZE }, (_, index) => (
          <span
            key={index}
            ref={(el) => { cellsRef.current[index] = el }}
            className="grid-hover-cell"
          />
        ))}
      </div>
      {children}
    </div>
  )
}
