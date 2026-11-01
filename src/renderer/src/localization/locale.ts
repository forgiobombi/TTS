export type AppLocale = 'en' | 'it' | 'pt-BR'
export const SUPPORTED_LOCALES: { code: AppLocale; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt-BR', name: 'Português (Brasil)' },
]
export function normalizeLocale(value: unknown): AppLocale {
  return value === 'it' || value === 'pt-BR' ? value : 'en'
}
