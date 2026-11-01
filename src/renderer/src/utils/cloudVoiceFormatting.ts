import type { CloudVoice } from '../../../shared/types'

export const POPULAR_LOCALES = [
  'en-US',
  'en-GB',
  'pt-BR',
  'pt-PT',
  'es-ES',
  'es-MX',
  'fr-FR',
  'de-DE',
  'it-IT',
  'ja-JP',
]

export const SAMPLE_TEXT_BY_LOCALE: Record<string, string> = {
  'pt-BR': 'Ola! Eu sou a voz que voce esta ouvindo.',
  'pt-PT': 'Ola! Eu sou a voz que estas a ouvir.',
  'en-US': "Hello! I'm the voice you're listening to.",
  'en-GB': "Hello! I'm the voice you're listening to.",
  'es-ES': 'Hola! Soy la voz que estas escuchando.',
  'es-MX': 'Hola! Soy la voz que estas escuchando.',
  'fr-FR': 'Bonjour! Je suis la voix que vous entendez.',
  'de-DE': 'Hallo! Ich bin die Stimme, die du hoerst.',
  'it-IT': 'Ciao! Sono la voce che stai ascoltando.',
  'ja-JP': 'Konnichiwa.',
}

export function localeFlag(locale: string): string {
  const region = locale.split('-')[1]
  if (!region) return '🌐'
  const codePoints = [...region.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export function shortVoiceLabel(voice: CloudVoice): string {
  const friendly = voice.FriendlyName?.replace(/^Microsoft\s+/i, '').replace(/\s+Online\s+\(Natural\).*$/i, '')
  return friendly || voice.ShortName.split('-').slice(-1)[0].replace(/Neural$/, '')
}

export function sortAvailableLocales(voices: CloudVoice[]): string[] {
  const set = new Set<string>()
  for (const voice of voices) set.add(voice.Locale)
  const sorted = Array.from(set).sort()
  const popular = POPULAR_LOCALES.filter((locale) => set.has(locale))
  const rest = sorted.filter((locale) => !popular.includes(locale))
  return [...popular, ...rest]
}

export function filterCloudVoices(
  voices: CloudVoice[],
  options: { localeFilter: string; search: string },
): CloudVoice[] {
  const query = options.search.trim().toLowerCase()
  return voices
    .filter((voice) => (options.localeFilter === 'all' ? true : voice.Locale === options.localeFilter))
    .filter((voice) => {
      if (!query) return true
      return (
        voice.ShortName.toLowerCase().includes(query) ||
        voice.FriendlyName.toLowerCase().includes(query) ||
        (voice.VoiceTag?.VoicePersonalities ?? []).some((tag) => tag.toLowerCase().includes(query))
      )
    })
    .sort((a, b) => shortVoiceLabel(a).localeCompare(shortVoiceLabel(b)))
}

/** Resolve an English voice from the actual catalog, with a safe fallback. */
export function pickDefaultEnglishVoice(voices: CloudVoice[]): CloudVoice | null {
  const preferred = ['en-US-JennyNeural', 'en-US-AriaNeural', 'en-US-GuyNeural', 'en-GB-SoniaNeural']
  for (const name of preferred) {
    const voice = voices.find((candidate) => candidate.ShortName === name)
    if (voice) return voice
  }
  return voices.find((voice) => voice.Locale === 'en-US')
    ?? voices.find((voice) => voice.Locale.startsWith('en-'))
    ?? voices[0]
    ?? null
}
