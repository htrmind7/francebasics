import { text } from '../content/loader.ts'
import type { Guide } from '../content/schemas.ts'
import type { Language } from '../i18n/i18n.ts'

/** Lowercase and drop accents so "cafe" finds "café". */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
}

function words(query: string): string[] {
  return normalize(query).split(/\s+/).filter(Boolean)
}

function fields(guide: Guide, language: Language): [string, number][] {
  // English is always searchable: keywords and official terms are written in it
  const both = (value: { en: string; vi?: string }) =>
    `${value.en} ${language === 'vi' ? text(value, 'vi') : ''}`
  return [
    [both(guide.title), 10],
    [guide.keywords.join(' '), 8],
    [both(guide.summary), 4],
    [guide.keyPoints.map(both).join(' '), 3],
    [
      guide.sections.map((s) => `${both(s.heading)} ${both(s.body)}`).join(' '),
      2,
    ],
    [guide.phrases.map((p) => `${p.fr} ${both(p.meaning)}`).join(' '), 2],
  ]
}

/** Every word must match somewhere; the best matches come first. */
export function searchGuides(
  guides: readonly Guide[],
  query: string,
  language: Language,
): Guide[] {
  const wanted = words(query)
  if (wanted.length === 0) return []
  return guides
    .map((guide) => {
      const indexed = fields(guide, language).map(
        ([value, weight]) => [normalize(value), weight] as const,
      )
      let score = 0
      for (const word of wanted) {
        const hit = indexed.filter(([value]) => value.includes(word))
        if (hit.length === 0) return { guide, score: 0 }
        score += Math.max(...hit.map(([, weight]) => weight))
      }
      return { guide, score }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.guide)
}
