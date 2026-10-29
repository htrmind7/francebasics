import { describe, expect, it } from 'vitest'
import categories from '../../content/categories.json'
import checklists from '../../content/checklists.json'
import guides from '../../content/guides.json'
import {
  ContentError,
  isStale,
  parseContent,
  publishedContent,
  text,
} from './loader.ts'

const category = { id: 'c1', title: { en: 'C' }, icon: 'x', order: 1 }

function guide(overrides: Record<string, unknown> = {}) {
  return {
    id: 'g1',
    categoryId: 'c1',
    title: { en: 'G' },
    icon: 'x',
    summary: { en: 'S' },
    kind: 'culture',
    sections: [{ heading: { en: 'H' }, body: { en: 'B' } }],
    keyPoints: [{ en: 'a' }, { en: 'b' }, { en: 'c' }],
    lastChecked: '2026-01-01',
    status: 'validated',
    ...overrides,
  }
}

const link = {
  label: { en: 'Service-Public' },
  url: 'https://www.service-public.gouv.fr/',
}

function content(guideList: unknown[], checklistList: unknown[] = []) {
  return {
    categories: [category],
    guides: guideList,
    checklists: checklistList,
  }
}

describe('content files', () => {
  it('are valid', () => {
    expect(() => parseContent({ categories, guides, checklists })).not.toThrow()
  })
})

describe('parseContent', () => {
  it('requires an official link on a procedure', () => {
    expect(() => parseContent(content([guide({ kind: 'procedure' })]))).toThrow(
      /official link/,
    )
    expect(() =>
      parseContent(
        content([guide({ kind: 'procedure', officialLinks: [link] })]),
      ),
    ).not.toThrow()
  })

  it('rejects non-https official links', () => {
    const bad = { ...link, url: 'http://example.fr/' }
    expect(() =>
      parseContent(
        content([guide({ kind: 'procedure', officialLinks: [bad] })]),
      ),
    ).toThrow(ContentError)
  })

  it('rejects duplicate ids and unknown references', () => {
    expect(() => parseContent(content([guide(), guide()]))).toThrow(
      /duplicate guide/,
    )
    expect(() =>
      parseContent(content([guide({ categoryId: 'nope' })])),
    ).toThrow(/unknown category/)
    expect(() =>
      parseContent(
        content(
          [guide()],
          [
            {
              id: 'l',
              title: { en: 'L' },
              steps: [{ id: 's', guideId: 'nope' }],
            },
          ],
        ),
      ),
    ).toThrow(/unknown guide/)
  })

  it('requires English text and a valid date', () => {
    expect(() =>
      parseContent(content([guide({ title: { vi: 'Chỉ tiếng Việt' } })])),
    ).toThrow(ContentError)
    expect(() =>
      parseContent(content([guide({ lastChecked: '01/01/2026' })])),
    ).toThrow(ContentError)
  })
})

describe('publishedContent', () => {
  it('hides drafts, empty categories and steps pointing to hidden guides', () => {
    const parsed = parseContent(
      content(
        [guide({ id: 'ok' }), guide({ id: 'draft', status: 'draft' })],
        [
          {
            id: 'l',
            title: { en: 'L' },
            steps: [
              { id: 'a', guideId: 'ok' },
              { id: 'b', guideId: 'draft' },
            ],
          },
          {
            id: 'empty',
            title: { en: 'E' },
            steps: [{ id: 'c', guideId: 'draft' }],
          },
        ],
      ),
    )
    const published = publishedContent(parsed)
    expect(published.guides.map((g) => g.id)).toEqual(['ok'])
    expect(published.checklists.map((c) => c.steps.length)).toEqual([1])
    expect(published.categories).toHaveLength(1)
  })
})

describe('text', () => {
  it('falls back to English without a translation', () => {
    expect(text({ en: 'Hello', vi: 'Xin chào' }, 'vi')).toBe('Xin chào')
    expect(text({ en: 'Hello' }, 'vi')).toBe('Hello')
  })
})

describe('isStale', () => {
  it('flags guides checked more than 12 months ago', () => {
    expect(isStale('2025-10-29', '2026-10-29')).toBe(false)
    expect(isStale('2025-10-28', '2026-10-29')).toBe(true)
  })
})
