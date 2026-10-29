import type { ScreenProps } from '../app/types.ts'
import { text } from '../content/loader.ts'
import { useI18n } from '../i18n/context.tsx'
import { Icon } from '../ui/Icon.tsx'
import { Photo } from '../ui/Photo.tsx'
import { BackLink, IconTile } from '../ui/ui.tsx'
import { kindLabel } from './kind.ts'

export function CategoryScreen({ content, id }: ScreenProps & { id: string }) {
  const { t, language } = useI18n()
  const category = content.categories.find((entry) => entry.id === id)
  if (!category) {
    return (
      <div className="screen">
        <BackLink href="#/" label={t.category.back} />
        <p className="muted">{t.category.notFound}</p>
      </div>
    )
  }
  const guides = content.guides.filter((guide) => guide.categoryId === id)
  const banner = content.images.find((image) => image.id === category.image)

  return (
    <div className="screen">
      <BackLink href="#/" label={t.category.back} />
      {banner && <Photo image={banner} language={language} eager caption />}
      <header className="page-head">
        <IconTile icon={category.icon} tone={category.tone} size={60} />
        <h1 className="screen-title">{text(category.title, language)}</h1>
      </header>
      <div className="list">
        {guides.map((guide) => (
          <a key={guide.id} className="card" href={`#/g/${guide.id}`}>
            <IconTile icon={guide.icon} tone={category.tone} size={44} />
            <span className="card-text">
              <strong>{text(guide.title, language)}</strong>
              <span className="muted small">
                {text(guide.summary, language)}
              </span>
              <span className="badge">{kindLabel(guide.kind, t)}</span>
            </span>
            <Icon name="chevron" size={20} />
          </a>
        ))}
      </div>
    </div>
  )
}
