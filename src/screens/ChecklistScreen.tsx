import { checklistProgress, isDone } from '../app/progress.ts'
import type { ScreenProps } from '../app/types.ts'
import { text } from '../content/loader.ts'
import { format } from '../i18n/format.ts'
import { useI18n } from '../i18n/context.tsx'
import { Icon } from '../ui/Icon.tsx'
import { ProgressBar } from '../ui/ui.tsx'

export function ChecklistScreen({
  content,
  progress,
  onToggleStep,
}: ScreenProps) {
  const { t, language } = useI18n()

  return (
    <div className="screen">
      <h1 className="screen-title">{t.checklist.title}</h1>
      {content.checklists.length === 0 && (
        <p className="muted">{t.checklist.empty}</p>
      )}
      {content.checklists.map((checklist) => {
        const counts = checklistProgress(checklist, progress)
        return (
          <section key={checklist.id} className="panel">
            <h2 className="panel-title">{text(checklist.title, language)}</h2>
            <p className="muted small">
              {counts.done === counts.total
                ? t.checklist.allDone
                : format(t.checklist.progress, counts)}
            </p>
            <ProgressBar value={counts.done} total={counts.total} />
            <ul className="steps">
              {checklist.steps.map((step) => {
                const guide = content.guides.find(
                  (entry) => entry.id === step.guideId,
                )
                if (!guide) return null
                const done = isDone(progress, checklist.id, step.id)
                return (
                  <li key={step.id} className={done ? 'step done' : 'step'}>
                    <button
                      type="button"
                      className="checkbox"
                      role="checkbox"
                      aria-checked={done}
                      aria-label={text(guide.title, language)}
                      onClick={() => onToggleStep(checklist.id, step.id)}
                    >
                      {done && <Icon name="check" size={16} />}
                    </button>
                    <a href={`#/g/${guide.id}`}>
                      {text(guide.title, language)}
                    </a>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
