import { describe, expect, it } from 'vitest'
import type { CloudVoice } from '../../../shared/types'
import { pickDefaultEnglishVoice } from './cloudVoiceFormatting'
const v = (Locale: string, ShortName: string) => ({ Locale, ShortName }) as CloudVoice
describe('English voice fallback', () => {
  it('prefers English, and handles missing voices', () => {
    expect(pickDefaultEnglishVoice([v('pt-BR','pt-BR-X'),v('en-US','en-US-AriaNeural')])?.ShortName).toBe('en-US-AriaNeural')
    expect(pickDefaultEnglishVoice([v('pt-BR','pt-BR-X')])?.Locale).toBe('pt-BR')
    expect(pickDefaultEnglishVoice([])).toBeNull()
  })
})
