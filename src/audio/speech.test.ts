import { describe, expect, it } from 'vitest'
import { pickFrenchVoice } from './speech.ts'

const voice = (name: string, lang: string) =>
  ({ name, lang }) as SpeechSynthesisVoice

describe('pickFrenchVoice', () => {
  it('prefers fr-FR and avoids known male voices', () => {
    const voices = [
      voice('Thomas', 'fr-FR'),
      voice('Amélie', 'fr-CA'),
      voice('Audrey', 'fr-FR'),
      voice('Alex', 'en-US'),
    ]
    expect(pickFrenchVoice(voices)?.name).toBe('Audrey')
  })

  it('accepts the underscore form and any French voice', () => {
    expect(pickFrenchVoice([voice('x', 'fr_BE')])?.name).toBe('x')
  })

  it('returns undefined without a French voice', () => {
    expect(pickFrenchVoice([voice('Alex', 'en-US')])).toBeUndefined()
  })
})
