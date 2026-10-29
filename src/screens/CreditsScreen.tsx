import type { ScreenProps } from '../app/types.ts'
import { useI18n } from '../i18n/context.tsx'
import { imageSrc } from '../ui/Photo.tsx'
import { BackLink } from '../ui/ui.tsx'

export function CreditsScreen({ content }: ScreenProps) {
  const { t } = useI18n()
  return (
    <div className="screen">
      <BackLink href="#/settings" label={t.credits.back} />
      <h1 className="screen-title">{t.credits.title}</h1>
      <p className="muted small">{t.credits.intro}</p>
      <ul className="credits">
        {content.images.map((image) => (
          <li key={image.id}>
            <a href={image.source} target="_blank" rel="noopener noreferrer">
              <img
                src={imageSrc(image)}
                alt=""
                width={96}
                height={54}
                loading="lazy"
                decoding="async"
              />
              <span>
                <strong>{image.title}</strong>
                <span className="muted small">
                  {t.credits.author}: {image.author}
                </span>
                <span className="muted small">{image.license}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
