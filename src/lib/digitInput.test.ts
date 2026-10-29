// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { rgbaToDigitInput } from './digitInput'
import { DIGIT_INPUT_VALUES } from './digitModel'

function blankRgba() {
  const data = new Uint8ClampedArray(DIGIT_INPUT_VALUES * 4)
  for (let index = 0; index < DIGIT_INPUT_VALUES; index += 1) {
    const offset = index * 4
    data[offset] = 255
    data[offset + 1] = 255
    data[offset + 2] = 255
    data[offset + 3] = 255
  }
  return data
}

describe('rgbaToDigitInput', () => {
  it('keeps white and black pixels at their expected values', () => {
    const data = blankRgba()
    for (let y = 10; y < 14; y += 1) {
      for (let x = 10; x < 14; x += 1) {
        const offset = (y * 48 + x) * 4
        data[offset] = 0
        data[offset + 1] = 0
        data[offset + 2] = 0
      }
    }

    const input = rgbaToDigitInput(data)
    expect(input[0]).toBe(255)
    expect(input[10 * 48 + 10]).toBe(0)
    expect(input[13 * 48 + 13]).toBe(0)
  })

  it('uses the same luma weights as PIL grayscale conversion', () => {
    const data = blankRgba()
    const red = 0
    const green = 1
    const blue = 2
    data[red * 4] = 255
    data[red * 4 + 1] = 0
    data[red * 4 + 2] = 0
    data[green * 4] = 0
    data[green * 4 + 1] = 255
    data[green * 4 + 2] = 0
    data[blue * 4] = 0
    data[blue * 4 + 1] = 0
    data[blue * 4 + 2] = 255

    const input = rgbaToDigitInput(data)
    expect(input[red]).toBe(76)
    expect(input[green]).toBe(150)
    expect(input[blue]).toBe(29)
  })

  it('rejects the wrong buffer length', () => {
    expect(() => rgbaToDigitInput(new Uint8ClampedArray(10))).toThrow(
      `Expected ${DIGIT_INPUT_VALUES * 4} RGBA values`,
    )
  })
})
