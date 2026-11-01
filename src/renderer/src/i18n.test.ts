import { describe, expect, it } from 'vitest'
import { normalizeLocale } from './localization/locale'
import { translate } from './i18n'
describe('translation catalogs', () => {
  it('defaults to English and preserves explicit choices', () => {
    expect(normalizeLocale(null)).toBe('en')
    expect(normalizeLocale('it')).toBe('it')
    expect(normalizeLocale('pt-BR')).toBe('pt-BR')
  })
  it('provides translations and interpolates named placeholders', () => {
    expect(translate('en', 'nav.settings')).toBe('Settings')
    expect(translate('it', 'nav.settings')).toBe('Impostazioni')
    expect(translate('pt-BR', 'nav.settings')).toBe('Configurações')
    expect(translate('it', 'voices.count', { count: 2 })).toContain('2')
  })
})
