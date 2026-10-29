import { DIGIT_INPUT_SIZE, DIGIT_INPUT_VALUES } from './digitModel'

export function rgbaToDigitInput(data: Uint8ClampedArray): Uint8Array {
  if (data.length !== DIGIT_INPUT_VALUES * 4) {
    throw new Error(
      `Expected ${DIGIT_INPUT_VALUES * 4} RGBA values, got ${data.length}`,
    )
  }

  const input = new Uint8Array(DIGIT_INPUT_VALUES)
  for (let index = 0; index < DIGIT_INPUT_VALUES; index += 1) {
    const offset = index * 4
    input[index] = Math.round(
      data[offset] * 0.299 + data[offset + 1] * 0.587 + data[offset + 2] * 0.114,
    )
  }
  return input
}

export function createDigitInput(source: HTMLCanvasElement): Uint8Array {
  const canvas = document.createElement('canvas')
  canvas.width = DIGIT_INPUT_SIZE
  canvas.height = DIGIT_INPUT_SIZE

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Canvas 2D is not available')
  }

  context.fillStyle = '#fff'
  context.fillRect(0, 0, DIGIT_INPUT_SIZE, DIGIT_INPUT_SIZE)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(source, 0, 0, DIGIT_INPUT_SIZE, DIGIT_INPUT_SIZE)

  return rgbaToDigitInput(
    context.getImageData(0, 0, DIGIT_INPUT_SIZE, DIGIT_INPUT_SIZE).data,
  )
}
