import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-600.css'
import '@fontsource/poppins/latin-700.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { applyAppearance, loadAppearance } from './app/appearance.ts'
import { applyTextSize, loadTextSize } from './app/textsize.ts'
import { primeVoices } from './audio/speech.ts'
import { I18nProvider } from './i18n/context.tsx'
import './styles/tokens.css'
import './styles/global.css'
import './styles/app.css'

applyAppearance(loadAppearance())
applyTextSize(loadTextSize())
primeVoices()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)
