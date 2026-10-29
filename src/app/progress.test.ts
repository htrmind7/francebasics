import { describe, expect, it } from 'vitest'
import {
  checklistProgress,
  emptyProgress,
  exportProgress,
  isDone,
  parseProgress,
  toggleStep,
} from './progress.ts'

const checklist = {
  id: 'l',
  title: { en: 'L' },
  steps: [
    { id: 'a', guideId: 'g1' },
    { id: 'b', guideId: 'g2' },
  ],
}

describe('progress', () => {
  it('toggles a step on and off without mutating', () => {
    const start = emptyProgress()
    const ticked = toggleStep(start, 'l', 'a')
    expect(isDone(ticked, 'l', 'a')).toBe(true)
    expect(start.done).toEqual([])
    expect(isDone(toggleStep(ticked, 'l', 'a'), 'l', 'a')).toBe(false)
  })

  it('counts the ticked steps of a checklist', () => {
    const progress = toggleStep(emptyProgress(), 'l', 'b')
    expect(checklistProgress(checklist, progress)).toEqual({
      done: 1,
      total: 2,
    })
  })

  it('round-trips through export and import', () => {
    const progress = toggleStep(emptyProgress(), 'l', 'a')
    expect(parseProgress(exportProgress(progress))).toEqual(progress)
  })

  it('rejects files that are not a progress export', () => {
    expect(() => parseProgress('nope')).toThrow(/JSON/)
    expect(() => parseProgress('{"version":9,"done":[]}')).toThrow(/format/)
  })

  it('removes duplicates when importing', () => {
    const text = '{"version":1,"done":["l/a","l/a"]}'
    expect(parseProgress(text).done).toEqual(['l/a'])
  })
})
