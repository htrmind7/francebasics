import { checklistProgress } from '../app/progress.ts'
import type { ScreenProps } from '../app/types.ts'
import { text } from '../content/loader.ts'
import { format } from '../i18n/format.ts'
import { useI18n } from '../i18n/context.tsx'
import { Icon } from '../ui/Icon.tsx'
import { Disclaimer, IconTile, ProgressBar } from '../ui/ui.tsx'

export function HomeScreen({ content, progress }: ScreenProps) {
  const { t, language } = useI18n()
  const emergency = content.guides.find((guide) => guide.id === 'emergencies')
  const firstWeeks = content.checklists[0]
  const counts = firstWeeks ? checklistProgress(firstWeeks, progress) : null

  return (
    <div className="screen">
      <header className="hero">
        <h1 className="app-title">{t.app.name}</h1>
        <p className="muted">{t.app.tagline}</p>
      </header>

      <a className="search-bar" href="#/search">
        <Icon name="search" size={20} />
        {t.home.searchPlaceholder}
      </a>

      {emergency && (
        <a className="card emergency" href={`#/g/${emergency.id}`}>
          <IconTile icon="alert" tone="coral" />
          <span className="card-text">
            <strong>{t.home.emergency}</strong>
            <span className="muted">{t.home.emergencyHint}</span>
          </span>
          <Icon name="chevron" size={20} />
        </a>
      )}

      {firstWeeks && counts && (
        <a className="card" href="#/checklist">
          <IconTile icon="list" tone="teal" />
          <span className="card-text">
            <strong>{text(firstWeeks.title, language)}</strong>
            <span className="muted">
              {format(t.home.firstWeeksProgress, counts)}
            </span>
            <ProgressBar value={counts.done} total={counts.total} />
          </span>
        </a>
      )}

      <h2 className="section-title">{t.home.browse}</h2>
      {content.categories.length === 0 ? (
        <p className="muted">{t.home.empty}</p>
      ) : (
        <div className="grid">
          {content.categories.map((category) => {
            const count = content.guides.filter(
              (guide) => guide.categoryId === category.id,
            ).length
            return (
              <a
                key={category.id}
                className="card tall"
                href={`#/c/${category.id}`}
              >
                <IconTile icon={category.icon} tone={category.tone} />
                <strong>{text(category.title, language)}</strong>
                <span className="muted small">
                  {format(
                    count === 1 ? t.home.guideCountOne : t.home.guideCount,
                    {
                      n: count,
                    },
                  )}
                </span>
              </a>
            )
          })}
        </div>
      )}

      <Disclaimer>{t.app.disclaimer}</Disclaimer>
    </div>
  )
}
