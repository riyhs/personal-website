// @vitest-environment node
import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import {
  DIGIT_INPUT_VALUES,
  DIGIT_WEIGHTS_BYTES,
  loadDigitWeights,
  predictDigit,
} from './digitModel'

interface ParitySample {
  name: string
  input: number[]
  expected: number[]
}

interface ParityFixture {
  source: string
  modelSha256: string
  weightsSha256: string
  samples: ParitySample[]
}

const weightsBytes = readFileSync(
  new URL('../../public/models/bangkit-digit-weights.bin', import.meta.url),
)
const weights = loadDigitWeights(new Uint8Array(weightsBytes).buffer as ArrayBuffer)
const fixture = JSON.parse(
  readFileSync(new URL('./__fixtures__/digitParity.json', import.meta.url), 'utf8'),
) as ParityFixture

describe('loadDigitWeights', () => {
  it('loads every exported tensor', () => {
    expect(weights.conv1Kernel).toHaveLength(3 * 3 * 1 * 32)
    expect(weights.conv1Bias).toHaveLength(32)
    expect(weights.conv2Kernel).toHaveLength(3 * 3 * 32 * 16)
    expect(weights.conv2Bias).toHaveLength(16)
    expect(weights.denseKernel).toHaveLength(1600 * 10)
    expect(weights.denseBias).toHaveLength(10)
  })

  it('rejects a file with the wrong byte length', () => {
    expect(() => loadDigitWeights(new ArrayBuffer(DIGIT_WEIGHTS_BYTES - 4))).toThrow(
      `Expected ${DIGIT_WEIGHTS_BYTES} weight bytes`,
    )
  })
})

describe('predictDigit', () => {
  it('matches Keras for every parity sample', () => {
    for (const sample of fixture.samples) {
      const probabilities = predictDigit(Uint8Array.from(sample.input), weights)
      let maxDifference = 0
      for (let digit = 0; digit < 10; digit += 1) {
        maxDifference = Math.max(
          maxDifference,
          Math.abs(probabilities[digit] - sample.expected[digit]),
        )
      }
      expect(maxDifference, sample.name).toBeLessThan(1e-5)
    }
  })

  it('returns a normalized probability distribution', () => {
    const probabilities = predictDigit(new Uint8Array(DIGIT_INPUT_VALUES), weights)
    let total = 0
    for (const probability of probabilities) {
      expect(probability).toBeGreaterThanOrEqual(0)
      total += probability
    }
    expect(total).toBeCloseTo(1, 5)
  })

  it('rejects the wrong input length', () => {
    expect(() => predictDigit(new Uint8Array(10), weights)).toThrow(
      `Expected ${DIGIT_INPUT_VALUES} input values`,
    )
  })
})
