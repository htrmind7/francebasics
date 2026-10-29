import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  getMessages,
  loadLanguage,
  saveLanguage,
  type Language,
  type Messages,
} from './i18n.ts'

type I18n = {
  language: Language
  t: Messages
  setLanguage: (language: Language) => void
}

const I18nContext = createContext<I18n | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(loadLanguage)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  function setLanguage(next: Language) {
    saveLanguage(next)
    setLanguageState(next)
  }

  return (
    <I18nContext.Provider
      value={{ language, t: getMessages(language), setLanguage }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18n {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n needs an I18nProvider')
  return value
}
