import { mapWithConcurrency } from '@/lib/admin/concurrency'

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

describe('mapWithConcurrency', () => {
  it('preserves result order regardless of completion order', async () => {
    // El primer item tarda más que los siguientes: si el orden no se
    // preservara, terminaría último en el array.
    const items = [50, 10, 30, 5]
    const results = await mapWithConcurrency(items, 2, async (ms, index) => {
      await delay(ms)
      return index
    })
    expect(results).toEqual([0, 1, 2, 3])
  })

  it('never exceeds the concurrency limit', async () => {
    let active = 0
    let maxActive = 0
    const items = Array.from({ length: 10 }, (_, i) => i)

    await mapWithConcurrency(items, 3, async (value) => {
      active += 1
      maxActive = Math.max(maxActive, active)
      await delay(5)
      active -= 1
      return value
    })

    expect(maxActive).toBeLessThanOrEqual(3)
    expect(maxActive).toBeGreaterThan(1) // confirma que sí corre en paralelo
  })

  it('applies the function to every item exactly once', async () => {
    const items = ['a', 'b', 'c']
    const seen: string[] = []
    const results = await mapWithConcurrency(items, 5, async (value) => {
      seen.push(value)
      return value.toUpperCase()
    })
    expect(results).toEqual(['A', 'B', 'C'])
    expect(seen.sort()).toEqual(['a', 'b', 'c'])
  })

  it('returns an empty array for empty input', async () => {
    const results = await mapWithConcurrency([], 3, async (value) => value)
    expect(results).toEqual([])
  })

  it('handles a limit larger than the number of items', async () => {
    const items = [1, 2]
    const results = await mapWithConcurrency(items, 10, async (value) => value * 2)
    expect(results).toEqual([2, 4])
  })

  it('falls back to at least one worker for invalid limits', async () => {
    const items = [1, 2, 3]
    const results = await mapWithConcurrency(items, 0, async (value) => value)
    expect(results).toEqual([1, 2, 3])
  })
})
