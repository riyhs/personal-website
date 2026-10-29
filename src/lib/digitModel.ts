export const DIGIT_INPUT_SIZE = 48
export const DIGIT_INPUT_VALUES = DIGIT_INPUT_SIZE * DIGIT_INPUT_SIZE
export const DIGIT_WEIGHT_COUNT = 20954
export const DIGIT_WEIGHTS_BYTES = DIGIT_WEIGHT_COUNT * 4

export interface DigitWeights {
  conv1Kernel: Float32Array
  conv1Bias: Float32Array
  conv2Kernel: Float32Array
  conv2Bias: Float32Array
  denseKernel: Float32Array
  denseBias: Float32Array
}

// Order must match WEIGHT_SPECS in scripts/export-digit-model.py.
export function loadDigitWeights(buffer: ArrayBuffer): DigitWeights {
  if (buffer.byteLength !== DIGIT_WEIGHTS_BYTES) {
    throw new Error(
      `Expected ${DIGIT_WEIGHTS_BYTES} weight bytes, got ${buffer.byteLength}`,
    )
  }

  const view = new DataView(buffer)
  let offset = 0

  const read = (length: number) => {
    const values = new Float32Array(length)
    for (let index = 0; index < length; index += 1) {
      values[index] = view.getFloat32(offset, true)
      offset += 4
    }
    return values
  }

  return {
    conv1Kernel: read(3 * 3 * 1 * 32),
    conv1Bias: read(32),
    conv2Kernel: read(3 * 3 * 32 * 16),
    conv2Bias: read(16),
    denseKernel: read(1600 * 10),
    denseBias: read(10),
  }
}

export function predictDigit(input: Uint8Array, weights: DigitWeights): Float32Array {
  if (input.length !== DIGIT_INPUT_VALUES) {
    throw new Error(
      `Expected ${DIGIT_INPUT_VALUES} input values, got ${input.length}`,
    )
  }

  const scaled = new Float32Array(DIGIT_INPUT_VALUES)
  for (let index = 0; index < DIGIT_INPUT_VALUES; index += 1) {
    scaled[index] = input[index] / 255
  }

  const conv1Kernel = weights.conv1Kernel
  const conv1Bias = weights.conv1Bias
  const conv1Size = 46
  const conv1Channels = 32
  const conv1 = new Float32Array(conv1Size * conv1Size * conv1Channels)

  for (let y = 0; y < conv1Size; y += 1) {
    for (let x = 0; x < conv1Size; x += 1) {
      for (let channel = 0; channel < conv1Channels; channel += 1) {
        let sum = conv1Bias[channel]
        for (let ky = 0; ky < 3; ky += 1) {
          for (let kx = 0; kx < 3; kx += 1) {
            sum +=
              scaled[(y + ky) * DIGIT_INPUT_SIZE + (x + kx)] *
              conv1Kernel[(ky * 3 + kx) * conv1Channels + channel]
          }
        }
        conv1[(y * conv1Size + x) * conv1Channels + channel] = sum > 0 ? sum : 0
      }
    }
  }

  const pool1Size = 23
  const pool1 = new Float32Array(pool1Size * pool1Size * conv1Channels)
  for (let y = 0; y < pool1Size; y += 1) {
    for (let x = 0; x < pool1Size; x += 1) {
      for (let channel = 0; channel < conv1Channels; channel += 1) {
        const topLeft =
          (y * 2 * conv1Size + x * 2) * conv1Channels + channel
        const topRight = topLeft + conv1Channels
        const bottomLeft = topLeft + conv1Size * conv1Channels
        const bottomRight = bottomLeft + conv1Channels
        pool1[(y * pool1Size + x) * conv1Channels + channel] = Math.max(
          conv1[topLeft],
          conv1[topRight],
          conv1[bottomLeft],
          conv1[bottomRight],
        )
      }
    }
  }

  const conv2Kernel = weights.conv2Kernel
  const conv2Bias = weights.conv2Bias
  const conv2Size = 21
  const conv2Channels = 16
  const conv2 = new Float32Array(conv2Size * conv2Size * conv2Channels)

  for (let y = 0; y < conv2Size; y += 1) {
    for (let x = 0; x < conv2Size; x += 1) {
      for (let channel = 0; channel < conv2Channels; channel += 1) {
        let sum = conv2Bias[channel]
        for (let ky = 0; ky < 3; ky += 1) {
          for (let kx = 0; kx < 3; kx += 1) {
            for (let inputChannel = 0; inputChannel < conv1Channels; inputChannel += 1) {
              sum +=
                pool1[((y + ky) * pool1Size + (x + kx)) * conv1Channels + inputChannel] *
                conv2Kernel[((ky * 3 + kx) * conv1Channels + inputChannel) * conv2Channels + channel]
            }
          }
        }
        conv2[(y * conv2Size + x) * conv2Channels + channel] = sum > 0 ? sum : 0
      }
    }
  }

  const pool2Size = 10
  const pool2 = new Float32Array(pool2Size * pool2Size * conv2Channels)
  for (let y = 0; y < pool2Size; y += 1) {
    for (let x = 0; x < pool2Size; x += 1) {
      for (let channel = 0; channel < conv2Channels; channel += 1) {
        const topLeft =
          (y * 2 * conv2Size + x * 2) * conv2Channels + channel
        const topRight = topLeft + conv2Channels
        const bottomLeft = topLeft + conv2Size * conv2Channels
        const bottomRight = bottomLeft + conv2Channels
        pool2[(y * pool2Size + x) * conv2Channels + channel] = Math.max(
          conv2[topLeft],
          conv2[topRight],
          conv2[bottomLeft],
          conv2[bottomRight],
        )
      }
    }
  }

  const denseKernel = weights.denseKernel
  const denseBias = weights.denseBias
  const logits = new Float32Array(10)
  for (let digit = 0; digit < 10; digit += 1) {
    let sum = denseBias[digit]
    for (let index = 0; index < pool2.length; index += 1) {
      sum += pool2[index] * denseKernel[index * 10 + digit]
    }
    logits[digit] = sum
  }

  let max = logits[0]
  for (let digit = 1; digit < 10; digit += 1) {
    if (logits[digit] > max) {
      max = logits[digit]
    }
  }

  const probabilities = new Float32Array(10)
  let total = 0
  for (let digit = 0; digit < 10; digit += 1) {
    const value = Math.exp(logits[digit] - max)
    probabilities[digit] = value
    total += value
  }
  for (let digit = 0; digit < 10; digit += 1) {
    probabilities[digit] /= total
  }

  return probabilities
}
