import { z } from 'zod'
import type { Language } from '../i18n/i18n.ts'
import {
  categorySchema,
  checklistSchema,
  guideSchema,
  type Category,
  type Checklist,
  type Guide,
  type Localized,
} from './schemas.ts'

export type Content = {
  categories: Category[]
  guides: Guide[]
  checklists: Checklist[]
}

export class ContentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContentError'
  }
}

function duplicates(ids: string[]): string[] {
  return ids.filter((id, index) => ids.indexOf(id) !== index)
}

/** Checks the files and the links between them; the app never runs on bad content. */
export function parseContent(raw: {
  categories: unknown
  guides: unknown
  checklists: unknown
}): Content {
  const parsed = z
    .object({
      categories: z.array(categorySchema),
      guides: z.array(guideSchema),
      checklists: z.array(checklistSchema),
    })
    .safeParse(raw)
  if (!parsed.success) {
    throw new ContentError(z.prettifyError(parsed.error))
  }
  const { categories, guides, checklists } = parsed.data

  const problems: string[] = []
  for (const [name, items] of [
    ['category', categories],
    ['guide', guides],
    ['checklist', checklists],
  ] as const) {
    for (const id of duplicates(items.map((item) => item.id))) {
      problems.push(`duplicate ${name} id "${id}"`)
    }
  }
  const categoryIds = new Set(categories.map((category) => category.id))
  const guideIds = new Set(guides.map((guide) => guide.id))
  for (const guide of guides) {
    if (!categoryIds.has(guide.categoryId)) {
      problems.push(
        `guide "${guide.id}" has unknown category "${guide.categoryId}"`,
      )
    }
  }
  for (const checklist of checklists) {
    for (const step of checklist.steps) {
      if (!guideIds.has(step.guideId)) {
        problems.push(
          `checklist "${checklist.id}" step "${step.id}" has unknown guide "${step.guideId}"`,
        )
      }
    }
  }
  if (problems.length > 0) throw new ContentError(problems.join('\n'))
  return parsed.data
}

/** Only validated guides are shown, and checklists never point to a hidden guide. */
export function publishedContent(content: Content): Content {
  const guides = content.guides.filter((guide) => guide.status === 'validated')
  const visible = new Set(guides.map((guide) => guide.id))
  const checklists = content.checklists
    .map((checklist) => ({
      ...checklist,
      steps: checklist.steps.filter((step) => visible.has(step.guideId)),
    }))
    .filter((checklist) => checklist.steps.length > 0)
  const used = new Set(guides.map((guide) => guide.categoryId))
  const categories = content.categories
    .filter((category) => used.has(category.id))
    .sort((a, b) => a.order - b.order)
  return { categories, guides, checklists }
}

export function text(value: Localized, language: Language): string {
  return value[language] ?? value.en
}

const STALE_AFTER_MONTHS = 12

/** A guide not checked for a year gets a "may be outdated" badge. */
export function isStale(lastChecked: string, today: string): boolean {
  const limit = new Date(`${lastChecked}T00:00:00Z`)
  limit.setUTCMonth(limit.getUTCMonth() + STALE_AFTER_MONTHS)
  return new Date(`${today}T00:00:00Z`) > limit
}
