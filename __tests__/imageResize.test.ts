import {
  computeTargetDimensions,
  CLIENT_MAX_EDGE,
  CLIENT_JPEG_QUALITY,
  SERVER_MAX_EDGE,
  SERVER_JPEG_QUALITY,
} from '@/lib/admin/imageResize'

describe('computeTargetDimensions', () => {
  it('does not enlarge an image already within the limit', () => {
    expect(computeTargetDimensions(800, 600, 2000)).toEqual({ width: 800, height: 600 })
  })

  it('keeps dimensions when the longest edge equals the limit', () => {
    expect(computeTargetDimensions(2000, 1000, 2000)).toEqual({ width: 2000, height: 1000 })
  })

  it('scales down a landscape image preserving aspect ratio', () => {
    // 4000x3000 (4:3) con maxEdge 2000 => 2000x1500
    expect(computeTargetDimensions(4000, 3000, 2000)).toEqual({ width: 2000, height: 1500 })
  })

  it('scales down a portrait image using the longest (vertical) edge', () => {
    // 3000x4000 (3:4) con maxEdge 2000 => 1500x2000
    expect(computeTargetDimensions(3000, 4000, 2000)).toEqual({ width: 1500, height: 2000 })
  })

  it('rounds fractional results to whole pixels', () => {
    const result = computeTargetDimensions(4032, 3024, 2000)
    expect(Number.isInteger(result.width)).toBe(true)
    expect(Number.isInteger(result.height)).toBe(true)
    expect(result.width).toBe(2000)
    expect(result.height).toBe(1500)
  })

  it('returns zero dimensions for invalid input', () => {
    expect(computeTargetDimensions(0, 0, 2000)).toEqual({ width: 0, height: 0 })
    expect(computeTargetDimensions(-100, 200, 2000)).toEqual({ width: 0, height: 0 })
    expect(computeTargetDimensions(NaN, 200, 2000)).toEqual({ width: 0, height: 0 })
  })

  it('exposes sane shared constants', () => {
    expect(CLIENT_MAX_EDGE).toBeGreaterThan(0)
    expect(CLIENT_JPEG_QUALITY).toBeGreaterThan(0)
    expect(CLIENT_JPEG_QUALITY).toBeLessThanOrEqual(1)
    expect(SERVER_MAX_EDGE).toBeGreaterThan(0)
    expect(SERVER_JPEG_QUALITY).toBeGreaterThan(0)
    expect(SERVER_JPEG_QUALITY).toBeLessThanOrEqual(100)
  })
})
