import { z } from 'zod'
import type { Checklist } from '../content/schemas.ts'

/** Checklist ticks, stored per device; export/import lets people keep a copy. */
export const PROGRESS_KEY = 'francebasics.progress'
export const CURRENT_VERSION = 1

const progressSchema = z.object({
  version: z.literal(CURRENT_VERSION),
  done: z.array(z.string()),
})

export type Progress = z.infer<typeof progressSchema>

export function emptyProgress(): Progress {
  return { version: CURRENT_VERSION, done: [] }
}

export function stepKey(checklistId: string, stepId: string): string {
  return `${checklistId}/${stepId}`
}

export function isDone(
  progress: Progress,
  checklistId: string,
  stepId: string,
): boolean {
  return progress.done.includes(stepKey(checklistId, stepId))
}

export function toggleStep(
  progress: Progress,
  checklistId: string,
  stepId: string,
): Progress {
  const key = stepKey(checklistId, stepId)
  const done = progress.done.includes(key)
    ? progress.done.filter((entry) => entry !== key)
    : [...progress.done, key]
  return { ...progress, done }
}

export function checklistProgress(
  checklist: Checklist,
  progress: Progress,
): { done: number; total: number } {
  const done = checklist.steps.filter((step) =>
    isDone(progress, checklist.id, step.id),
  ).length
  return { done, total: checklist.steps.length }
}

/** Throws a readable Error when the text is not a progress export. */
export function parseProgress(text: string): Progress {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new Error('not a JSON file')
  }
  const parsed = progressSchema.safeParse(raw)
  if (!parsed.success) throw new Error('unknown format')
  return { ...parsed.data, done: [...new Set(parsed.data.done)] }
}

export function exportProgress(progress: Progress): string {
  return JSON.stringify(progress, null, 2)
}

export function exportFileName(today: string): string {
  return `francebasics-progress-${today}.json`
}

export function loadProgress(): Progress {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (stored) return parseProgress(stored)
  } catch {
    // unreadable or blocked storage: start from scratch
  }
  return emptyProgress()
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    // the ticks then only last until the app is closed
  }
}
