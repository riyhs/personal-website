import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

import { createDigitInput } from '../lib/digitInput'
import { loadDigitWeights, predictDigit } from '../lib/digitModel'
import type { DigitWeights } from '../lib/digitModel'
import { cn } from '../lib/utils'
import { Button } from './ui/button'

const WEIGHTS_URL = '/models/bangkit-digit-weights.bin'

// The app draws with a 55px brush on a ~1080px-wide canvas, then squashes it to 48x48.
const STROKE_RATIO = 55 / 1080

type ModelStatus = 'idle' | 'loading' | 'ready' | 'error'

const STATUS_LABELS: Record<ModelStatus, string> = {
  idle: 'Model loads on view',
  loading: 'Loading model',
  ready: 'Model ready',
  error: 'Model unavailable',
}

function resetCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.strokeStyle = '#000'
  context.fillStyle = '#000'
  context.lineWidth = canvas.width * STROKE_RATIO
}

export function DigitDemo() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const weightsRef = useRef<DigitWeights | null>(null)
  const drawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)

  const [status, setStatus] = useState<ModelStatus>('idle')
  const [probabilities, setProbabilities] = useState<Float32Array | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) {
      return
    }

    let cancelled = false
    let controller: AbortController | null = null

    const load = () => {
      controller?.abort()
      controller = new AbortController()
      setError(null)
      setStatus('loading')

      fetch(WEIGHTS_URL, { signal: controller.signal })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          return response.arrayBuffer()
        })
        .then((buffer) => {
          const parsed = loadDigitWeights(buffer)
          if (cancelled) {
            return
          }
          weightsRef.current = parsed
          setStatus('ready')
        })
        .catch((cause: unknown) => {
          if (
            cancelled ||
            (cause instanceof DOMException && cause.name === 'AbortError')
          ) {
            return
          }
          setError(cause instanceof Error ? cause.message : 'Could not load the model.')
          setStatus('error')
        })
    }

    if (typeof IntersectionObserver === 'undefined') {
      load()
      return () => {
        cancelled = true
        controller?.abort()
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          load()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(section)

    return () => {
      cancelled = true
      observer.disconnect()
      controller?.abort()
    }
  }, [reloadKey])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const width = Math.max(1, Math.round(rect.width * dpr))
      const height = Math.max(1, Math.round(rect.height * dpr))
      if (canvas.width === width && canvas.height === height) {
        return
      }
      canvas.width = width
      canvas.height = height
      resetCanvas(canvas, context)
      setProbabilities(null)
    }

    resize()

    if (typeof ResizeObserver === 'undefined') {
      return
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  const pointFromEvent = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const scaleX = rect.width > 0 ? event.currentTarget.width / rect.width : 1
    const scaleY = rect.height > 0 ? event.currentTarget.height / rect.height : 1
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    }
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    drawingRef.current = true

    const point = pointFromEvent(event)
    lastPointRef.current = point

    const context = event.currentTarget.getContext('2d')
    if (!context) {
      return
    }
    context.beginPath()
    context.arc(point.x, point.y, context.lineWidth / 2, 0, Math.PI * 2)
    context.fill()
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) {
      return
    }
    const lastPoint = lastPointRef.current
    const context = event.currentTarget.getContext('2d')
    if (!lastPoint || !context) {
      return
    }

    const point = pointFromEvent(event)
    context.beginPath()
    context.moveTo(lastPoint.x, lastPoint.y)
    context.lineTo(point.x, point.y)
    context.stroke()
    lastPointRef.current = point
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) {
      return
    }
    drawingRef.current = false
    lastPointRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const weights = weightsRef.current
    if (!weights) {
      return
    }
    setProbabilities(
      predictDigit(createDigitInput(event.currentTarget), weights),
    )
  }

  const handlePointerCancel = () => {
    drawingRef.current = false
    lastPointRef.current = null
  }

  const clear = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (canvas && context) {
      resetCanvas(canvas, context)
    }
    setProbabilities(null)
  }

  const topDigit = probabilities
    ? probabilities.indexOf(Math.max(...probabilities))
    : null
  const statusLabel = STATUS_LABELS[status]

  return (
    <section ref={sectionRef} className="dashed-rule mt-14 pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="mono-label">Try the model</h2>
        <span className="mono-label text-[0.65rem]">Runs in your browser</span>
      </div>

      <p className="mt-4 max-w-2xl text-[rgb(var(--foreground)/0.75)]">
        Draw a digit 0–9. The capstone CNN runs on the same 20,954 weights here,
        with no API call and no upload. The saved model scored 97.89% on the
        capstone test split.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Draw a digit from 0 to 9 with a mouse, pen, or finger"
            className="aspect-[6/5] w-full touch-none rounded-2xl border border-[rgb(var(--foreground)/0.15)] bg-white"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="mono-label text-[0.65rem]">Mouse, pen, or finger</p>
            <Button type="button" variant="outline" size="sm" onClick={clear}>
              Clear
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="mono-label">Prediction</p>
              <p
                className="mt-2 text-5xl font-semibold leading-none tabular-nums"
                aria-live="polite"
              >
                {topDigit ?? '–'}
              </p>
            </div>
            <p className="mono-label text-[0.65rem]">{statusLabel}</p>
          </div>

          {probabilities ? (
            <div className="mt-6 space-y-2">
              {Array.from(probabilities).map((probability, digit) => (
                <div
                  key={digit}
                  className="grid grid-cols-[1rem_minmax(0,1fr)_3.5rem] items-center gap-2"
                >
                  <span
                    className={cn(
                      'font-mono text-xs tabular-nums',
                      digit === topDigit
                        ? 'text-[rgb(var(--foreground))]'
                        : 'text-[rgb(var(--foreground)/0.6)]',
                    )}
                  >
                    {digit}
                  </span>
                  <div
                    aria-hidden="true"
                    className="h-1.5 overflow-hidden rounded-full bg-[rgb(var(--foreground)/0.08)]"
                  >
                    <div
                      className={cn(
                        'h-full rounded-full',
                        digit === topDigit
                          ? 'bg-[rgb(var(--grid-hover))]'
                          : 'bg-[rgb(var(--foreground)/0.3)]',
                      )}
                      style={{ width: `${probability * 100}%` }}
                    />
                  </div>
                  <span className="text-right font-mono text-xs tabular-nums text-[rgb(var(--foreground)/0.6)]">
                    {(probability * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          ) : status !== 'error' ? (
            <p className="mt-6 text-sm text-[rgb(var(--foreground)/0.6)]">
              {status === 'loading'
                ? 'Loading the 84 KB weight file…'
                : 'Draw a digit to see the probabilities.'}
            </p>
          ) : null}

          {status === 'error' ? (
            <div className="mt-6 rounded-xl border border-dashed border-[rgb(var(--foreground)/0.15)] p-4">
              <p className="text-sm text-[rgb(var(--foreground)/0.75)]">
                {error ?? 'Could not load the model.'}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setReloadKey((key) => key + 1)}
              >
                Retry
              </Button>
            </div>
          ) : probabilities ? (
            <p className="mt-4 text-sm text-[rgb(var(--foreground)/0.6)]">
              Softmax over digits 0–9.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
