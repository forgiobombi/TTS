import { useAppStore } from './stores/appStore'
import en from './localization/en.json'
import it from './localization/it.json'
import ptBR from './localization/pt-BR.json'
import { type AppLocale } from './localization/locale'
export { SUPPORTED_LOCALES } from './localization/locale'
const catalogs: Record<AppLocale, Record<string, string>> = { en, it, 'pt-BR': ptBR }
/** Standard JSON string keys; untranslated keys fall back to English. */
export function translate(language: AppLocale, key: string, params?: Record<string, string | number>): string {
  const template = catalogs[language][key] ?? catalogs.en[key] ?? key
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, name: string) =>
    params?.[name] === undefined ? match : String(params[name]))
}
export function useTranslation() {
  const language = useAppStore((state) => state.language)
  return { language, t: (key: string, params?: Record<string, string | number>) => translate(language, key, params) }
}
