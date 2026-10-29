import { z } from 'zod'

/** English is mandatory; a missing translation falls back to it. */
export const localizedSchema = z.object({
  en: z.string().min(1),
  vi: z.string().min(1).optional(),
})

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD')

export const officialLinkSchema = z.object({
  label: localizedSchema,
  // Official sources are French government sites: always served over https
  url: z.url().refine((url) => url.startsWith('https://'), 'must use https'),
})

export const sectionSchema = z.object({
  heading: localizedSchema,
  body: localizedSchema,
})

export const phraseSchema = z.object({
  fr: z.string().min(1),
  meaning: localizedSchema,
})

export const categorySchema = z.object({
  id: z.string().min(1),
  title: localizedSchema,
  icon: z.string().min(1),
  order: z.number().int(),
})

export const guideKinds = ['explainer', 'culture', 'procedure'] as const

export const guideSchema = z
  .object({
    id: z.string().min(1),
    categoryId: z.string().min(1),
    title: localizedSchema,
    icon: z.string().min(1),
    summary: localizedSchema,
    kind: z.enum(guideKinds),
    sections: z.array(sectionSchema).min(1).max(5),
    keyPoints: z.array(localizedSchema).min(3).max(5),
    commonMistakes: z.array(localizedSchema).default([]),
    phrases: z.array(phraseSchema).default([]),
    keywords: z.array(z.string().min(1)).default([]),
    officialLinks: z.array(officialLinkSchema).default([]),
    lastChecked: isoDate,
    status: z.enum(['draft', 'validated']),
    reviewNotes: z.string().optional(),
  })
  .refine(
    (guide) => guide.kind !== 'procedure' || guide.officialLinks.length > 0,
    {
      message: 'a procedure guide needs at least one official link',
      path: ['officialLinks'],
    },
  )

export const checklistSchema = z.object({
  id: z.string().min(1),
  title: localizedSchema,
  steps: z
    .array(z.object({ id: z.string().min(1), guideId: z.string().min(1) }))
    .min(1),
})

export type Localized = z.infer<typeof localizedSchema>
export type Category = z.infer<typeof categorySchema>
export type Guide = z.infer<typeof guideSchema>
export type Checklist = z.infer<typeof checklistSchema>
