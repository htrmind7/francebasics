import { useRef, useState } from 'react'
import {
  APPEARANCES,
  applyAppearance,
  loadAppearance,
  saveAppearance,
  type Appearance,
} from '../app/appearance.ts'
import {
  exportFileName,
  exportProgress,
  parseProgress,
} from '../app/progress.ts'
import type { ScreenProps } from '../app/types.ts'
import {
  TEXT_SIZES,
  applyTextSize,
  loadTextSize,
  saveTextSize,
  type TextSize,
} from '../app/textsize.ts'
import { format } from '../i18n/format.ts'
import { useI18n } from '../i18n/context.tsx'
import { LANGUAGES } from '../i18n/i18n.ts'
import { Icon } from '../ui/Icon.tsx'

const APPEARANCE_ICONS: Record<Appearance, string> = {
  light: 'sun',
  dark: 'moon',
  mint: 'leaf',
}

function localToday(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function download(fileName: string, text: string): void {
  const url = URL.createObjectURL(
    new Blob([text], { type: 'application/json' }),
  )
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export function SettingsScreen({
  progress,
  onResetProgress,
  onImportProgress,
}: ScreenProps) {
  const { t, language, setLanguage } = useI18n()
  const [appearance, setAppearance] = useState<Appearance>(loadAppearance)
  const [textSize, setTextSize] = useState<TextSize>(loadTextSize)
  const [message, setMessage] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  const appearanceLabels: Record<Appearance, string> = {
    light: t.settings.appearanceLight,
    dark: t.settings.appearanceDark,
    mint: t.settings.appearanceMint,
  }
  const sizeLabels: Record<TextSize, string> = {
    normal: t.settings.textNormal,
    large: t.settings.textLarge,
  }

  function chooseAppearance(next: Appearance) {
    saveAppearance(next)
    applyAppearance(next)
    setAppearance(next)
  }

  function chooseTextSize(next: TextSize) {
    saveTextSize(next)
    applyTextSize(next)
    setTextSize(next)
  }

  async function importFile(file: File | undefined) {
    if (!file) return
    try {
      const imported = parseProgress(await file.text())
      if (!window.confirm(t.settings.importConfirm)) return
      onImportProgress(imported)
      setMessage(t.settings.importOk)
    } catch (error) {
      setMessage(
        format(t.settings.importError, { reason: (error as Error).message }),
      )
    }
  }

  function reset() {
    if (!window.confirm(t.settings.resetConfirm)) return
    onResetProgress()
  }

  return (
    <div className="screen">
      <h1 className="screen-title">{t.settings.title}</h1>

      <h2 className="section-title">{t.settings.language}</h2>
      <div className="pills">
        {LANGUAGES.map((option) => (
          <button
            key={option}
            type="button"
            className={`pill ${language === option ? 'pill-active' : ''}`}
            aria-pressed={language === option}
            onClick={() => setLanguage(option)}
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
            <Icon name={APPEARANCE_ICONS[option]} size={18} />
            {appearanceLabels[option]}
          </button>
        ))}
      </div>

      <h2 className="section-title">{t.settings.textSize}</h2>
      <div className="pills">
        {TEXT_SIZES.map((option) => (
          <button
            key={option}
            type="button"
            className={`pill ${textSize === option ? 'pill-active' : ''}`}
            aria-pressed={textSize === option}
            onClick={() => chooseTextSize(option)}
          >
            {sizeLabels[option]}
          </button>
        ))}
      </div>

      <h2 className="section-title">{t.settings.progress}</h2>
      <p className="muted small">{t.settings.progressHint}</p>
      <div className="pills">
        <button
          type="button"
          className="pill"
          onClick={() =>
            download(exportFileName(localToday()), exportProgress(progress))
          }
        >
          {t.settings.export}
        </button>
        <button
          type="button"
          className="pill"
          onClick={() => fileInput.current?.click()}
        >
          {t.settings.import}
        </button>
        <button type="button" className="pill danger" onClick={reset}>
          {t.settings.reset}
        </button>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(event) => {
          void importFile(event.target.files?.[0])
          event.target.value = ''
        }}
      />
      {message && (
        <p className="muted small" role="status">
          {message}
        </p>
      )}

      <p className="meta">
        {format(t.settings.version, { version: __APP_VERSION__ })}
      </p>
    </div>
  )
}
