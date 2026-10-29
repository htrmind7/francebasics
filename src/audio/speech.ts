const MALE_NAMES = /thomas|daniel|paul|henri|claude|antoine|nicolas|jean/i

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/** Prefers fr-FR, then voices that are not known male ones (the API has no gender). */
export function pickFrenchVoice(
  voices: readonly SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  const score = (voice: SpeechSynthesisVoice) => {
    const lang = voice.lang.replace('_', '-').toLowerCase()
    if (!lang.startsWith('fr')) return -Infinity
    return (lang === 'fr-fr' ? 100 : 0) - (MALE_NAMES.test(voice.name) ? 20 : 0)
  }
  return [...voices]
    .filter((voice) => score(voice) > -Infinity)
    .sort((a, b) => score(b) - score(a))[0]
}

/** Browsers load their voices lazily: ask early so the first tap finds them. */
export function primeVoices(): void {
  if (!isSpeechSupported()) return
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    window.speechSynthesis.getVoices()
  })
}

/** Must be called synchronously from a tap: mobile browsers block other playback. */
export function speakFrench(text: string): void {
  if (!isSpeechSupported()) return
  const synth = window.speechSynthesis
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'fr-FR'
  utterance.rate = 0.9
  const voice = pickFrenchVoice(synth.getVoices())
  if (voice) utterance.voice = voice
  // cancel() with nothing playing can swallow the next utterance in Chromium
  if (synth.speaking || synth.pending) synth.cancel()
  synth.speak(utterance)
}
