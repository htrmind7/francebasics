import { describe, expect, it } from 'vitest'
import type { Guide } from '../content/schemas.ts'
import { normalize, searchGuides } from './search.ts'

function guide(id: string, title: string, extra: Partial<Guide> = {}): Guide {
  return {
    id,
    categoryId: 'c',
    title: { en: title },
    icon: 'book',
    summary: { en: 'summary' },
    kind: 'explainer',
    sections: [{ heading: { en: 'h' }, body: { en: 'body' } }],
    keyPoints: [{ en: 'a' }, { en: 'b' }, { en: 'c' }],
    commonMistakes: [],
    phrases: [],
    keywords: [],
    officialLinks: [],
    lastChecked: '2026-01-01',
    status: 'validated',
    ...extra,
  }
}

describe('searchGuides', () => {
  const bank = guide('bank', 'Opening a bank account', { keywords: ['rib'] })
  const doctor = guide('doctor', 'Seeing a doctor', {
    summary: { en: 'Visit with a médecin', vi: 'Đi khám bác sĩ' },
  })

  it('ignores accents and case', () => {
    expect(normalize('Médecin Đi')).toBe('medecin di')
    expect(searchGuides([bank, doctor], 'MEDECIN', 'en')).toEqual([doctor])
  })

  it('needs every word to match', () => {
    expect(searchGuides([bank, doctor], 'bank doctor', 'en')).toEqual([])
    expect(searchGuides([bank, doctor], 'bank account', 'en')).toEqual([bank])
  })

  it('ranks title matches above summary matches', () => {
    const a = guide('a', 'Other', { summary: { en: 'about bank things' } })
    expect(searchGuides([a, bank], 'bank', 'en').map((g) => g.id)).toEqual([
      'bank',
      'a',
    ])
  })

  it('finds keywords and Vietnamese text when Vietnamese is selected', () => {
    expect(searchGuides([bank], 'rib', 'en')).toEqual([bank])
    expect(searchGuides([doctor], 'bác sĩ', 'vi')).toEqual([doctor])
    expect(searchGuides([doctor], 'bác sĩ', 'en')).toEqual([])
  })

  it('returns nothing for an empty query', () => {
    expect(searchGuides([bank], '  ', 'en')).toEqual([])
  })
})
