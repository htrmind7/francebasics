import { describe, expect, it } from 'vitest'
import en from './en.json'
import vi from './vi.json'
import { getMessages, parseLanguage } from './i18n.ts'

function keysOf(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix]
  return Object.entries(value).flatMap(([key, child]) =>
    keysOf(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('i18n', () => {
  it('has exactly the same keys in English and Vietnamese', () => {
    expect(keysOf(vi).sort()).toEqual(keysOf(en).sort())
  })

  it('has no empty text', () => {
    for (const messages of [en, vi]) {
      const texts = JSON.stringify(messages).match(/:\s*""/g)
      expect(texts).toBeNull()
    }
  })

  it('only accepts known languages', () => {
    expect(parseLanguage('vi')).toBe('vi')
    expect(parseLanguage('fr')).toBeNull()
    expect(parseLanguage(null)).toBeNull()
  })

  it('returns the messages of a language', () => {
    expect(getMessages('en').settings.language).toBe('Language')
  })
})
