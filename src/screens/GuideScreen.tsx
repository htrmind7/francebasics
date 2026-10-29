import type { ScreenProps } from '../app/types.ts'
import { isStale, text } from '../content/loader.ts'
import { speakFrench, isSpeechSupported } from '../audio/speech.ts'
import { format } from '../i18n/format.ts'
import { useI18n } from '../i18n/context.tsx'
import { Icon } from '../ui/Icon.tsx'
import { Photo } from '../ui/Photo.tsx'
import { BackLink, Disclaimer, IconTile } from '../ui/ui.tsx'
import { kindLabel } from './kind.ts'

function today(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function GuideScreen({ content, id }: ScreenProps & { id: string }) {
  const { t, language } = useI18n()
  const guide = content.guides.find((entry) => entry.id === id)
  if (!guide) {
    return (
      <div className="screen">
        <BackLink href="#/" label={t.guide.back} />
        <p className="muted">{t.guide.notFound}</p>
      </div>
    )
  }
  const category = content.categories.find(
    (entry) => entry.id === guide.categoryId,
  )
  const tone = category?.tone ?? 'coral'
  const hero = content.images.find((image) => image.id === guide.image)

  return (
    <div className="screen">
      <BackLink
        href={category ? `#/c/${category.id}` : '#/'}
        label={category ? text(category.title, language) : t.guide.back}
      />

      {hero && <Photo image={hero} language={language} eager caption />}

      <header className="guide-head">
        <IconTile icon={guide.icon} tone={tone} size={64} />
        <div>
          <span className="badge">{kindLabel(guide.kind, t)}</span>
          <h1 className="screen-title">{text(guide.title, language)}</h1>
        </div>
      </header>
      <p className="lead">{text(guide.summary, language)}</p>

      <section className="panel">
        <h2 className="panel-title">{t.guide.keyPoints}</h2>
        <ul className="points">
          {guide.keyPoints.map((point) => (
            <li key={point.en}>
              <span className={`dot tone-${tone}`}>
                <Icon name="check" size={14} />
              </span>
              {text(point, language)}
            </li>
          ))}
        </ul>
      </section>

      {guide.sections.map((section) => (
        <section key={section.heading.en} className="prose">
          <h2>{text(section.heading, language)}</h2>
          <p>{text(section.body, language)}</p>
        </section>
      ))}

      {guide.commonMistakes.length > 0 && (
        <section className="panel warn">
          <h2 className="panel-title">
            <Icon name="alert" size={18} />
            {t.guide.mistakes}
          </h2>
          <ul className="plain">
            {guide.commonMistakes.map((mistake) => (
              <li key={mistake.en}>{text(mistake, language)}</li>
            ))}
          </ul>
        </section>
      )}

      {guide.phrases.length > 0 && (
        <section className="panel">
          <h2 className="panel-title">{t.guide.phrases}</h2>
          <ul className="phrases">
            {guide.phrases.map((phrase) => (
              <li key={phrase.fr}>
                <span>
                  <strong lang="fr">{phrase.fr}</strong>
                  <span className="muted small">
                    {text(phrase.meaning, language)}
                  </span>
                </span>
                {isSpeechSupported() && (
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`${t.guide.listen}: ${phrase.fr}`}
                    onClick={() => speakFrench(phrase.fr)}
                  >
                    <Icon name="speaker" size={20} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {guide.officialLinks.length > 0 && (
        <section className="official">
          <p className="muted small">{t.guide.officialHint}</p>
          {guide.officialLinks.map((link) => (
            <a
              key={link.url}
              className="button"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="external" size={18} />
              {t.guide.official}: {text(link.label, language)}
            </a>
          ))}
        </section>
      )}

      <p className="meta">
        {format(t.guide.lastChecked, { date: guide.lastChecked })}
        {isStale(guide.lastChecked, today()) && (
          <span className="badge stale">{t.guide.outdated}</span>
        )}
      </p>
      <Disclaimer>{t.app.disclaimer}</Disclaimer>
    </div>
  )
}
