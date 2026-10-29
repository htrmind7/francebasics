import en from './en.json'
import vi from './vi.json'

export type Language = 'en' | 'vi'

export const LANGUAGES: Language[] = ['en', 'vi']

export type Messages = typeof en

const MESSAGES: Record<Language, Messages> = { en, vi }

/** Per-device preference, kept apart from any progress data. */
export const LANGUAGE_KEY = 'francebasics.language'

export function parseLanguage(value: string | null): Language | null {
  return LANGUAGES.find((language) => language === value) ?? null
}

/** English is the default; Vietnamese is only used when chosen. */
export function loadLanguage(): Language {
  try {
    return parseLanguage(localStorage.getItem(LANGUAGE_KEY)) ?? 'en'
  } catch {
    return 'en'
  }
}

export function saveLanguage(language: Language): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, language)
  } catch {
    // blocked storage: the choice only lasts for this visit
  }
}

export function getMessages(language: Language): Messages {
  return MESSAGES[language]
}
