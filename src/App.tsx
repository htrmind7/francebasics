import { useEffect, useState } from 'react'
import {
  APPEARANCES,
  applyAppearance,
  loadAppearance,
  saveAppearance,
  type Appearance,
} from './app/appearance.ts'
import {
  getMessages,
  LANGUAGES,
  loadLanguage,
  saveLanguage,
  type Language,
} from './i18n/i18n.ts'

export default function App() {
  const [language, setLanguage] = useState<Language>(loadLanguage)
  const [appearance, setAppearance] = useState<Appearance>(loadAppearance)
  const t = getMessages(language)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const labels: Record<Appearance, string> = {
    light: t.settings.appearanceLight,
    dark: t.settings.appearanceDark,
    mint: t.settings.appearanceMint,
  }

  function chooseLanguage(next: Language) {
    saveLanguage(next)
    setLanguage(next)
  }

  function chooseAppearance(next: Appearance) {
    saveAppearance(next)
    applyAppearance(next)
    setAppearance(next)
  }

  return (
    <main className="screen">
      <h1 className="app-title">{t.app.name}</h1>
      <p className="muted">{t.app.tagline}</p>

      <h2 className="section-title">{t.settings.language}</h2>
      <div className="pills">
        {LANGUAGES.map((option) => (
          <button
            key={option}
            type="button"
            className={`pill ${language === option ? 'pill-active' : ''}`}
            aria-pressed={language === option}
            onClick={() => chooseLanguage(option)}
          >
            {t.languages[option]}
          </button>
        ))}
      </div>

      <h2 className="section-title">{t.settings.appearance}</h2>
      <div className="pills">
        {APPEARANCES.map((option) => (
          <button
            key={option}
            type="button"
            className={`pill ${appearance === option ? 'pill-active' : ''}`}
            aria-pressed={appearance === option}
            onClick={() => chooseAppearance(option)}
          >
            {labels[option]}
          </button>
        ))}
      </div>

      <p className="disclaimer">{t.app.disclaimer}</p>
    </main>
  )
}
