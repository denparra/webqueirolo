import { isValidServerActionId } from '@/lib/admin/serverActionId'

describe('isValidServerActionId', () => {
  it('rejects scanner values and malformed IDs', () => {
    expect(isValidServerActionId('x')).toBe(false)
    expect(isValidServerActionId('')).toBe(false)
    expect(isValidServerActionId('g'.repeat(40))).toBe(false)
    expect(isValidServerActionId('a'.repeat(39))).toBe(false)
  })

  it('accepts hexadecimal action IDs', () => {
    expect(isValidServerActionId('a'.repeat(40))).toBe(true)
    expect(isValidServerActionId('A1'.repeat(25))).toBe(true)
    expect(isValidServerActionId('f'.repeat(64))).toBe(true)
  })

  it('allows requests without a Server Action header', () => {
    expect(isValidServerActionId(null)).toBe(false)
  })
})
