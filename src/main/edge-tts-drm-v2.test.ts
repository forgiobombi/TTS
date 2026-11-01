import { describe, expect, it } from 'vitest'
import { generateSecMsGecV2 } from './edge-tts-drm-v2'
describe('Edge GEC v2', () => {
  it('returns the required new CS64-SHA256 format', () => {
    expect(generateSecMsGecV2(1791897600)).toMatch(/^[0-9A-F]{16}-[0-9A-F]{64}$/)
  })
  it('is stable within a five-minute window and rotates afterwards', () => {
    const a = generateSecMsGecV2(1791897600)
    expect(generateSecMsGecV2(1791897600 + 120)).toBe(a)
    expect(generateSecMsGecV2(1791897600 + 301)).not.toBe(a)
  })
})
