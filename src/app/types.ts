import type { Content } from '../content/loader.ts'
import type { Progress } from './progress.ts'

export type ScreenProps = {
  content: Content
  progress: Progress
  onToggleStep: (checklistId: string, stepId: string) => void
  onResetProgress: () => void
  onImportProgress: (progress: Progress) => void
}
