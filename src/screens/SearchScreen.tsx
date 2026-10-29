import { useState } from 'react'
import { searchGuides } from '../app/search.ts'
import type { ScreenProps } from '../app/types.ts'
import { text } from '../content/loader.ts'
import { format } from '../i18n/format.ts'
import { useI18n } from '../i18n/context.tsx'
import { Icon } from '../ui/Icon.tsx'
import { IconTile } from '../ui/ui.tsx'

export function SearchScreen({ content }: ScreenProps) {
  const { t, language } = useI18n()
  const [query, setQuery] = useState('')
  const results = searchGuides(content.guides, query, language)

  return (
    <div className="screen">
      <h1 className="screen-title">{t.search.title}</h1>
      <label className="search-bar input">
        <Icon name="search" size={20} />
        <input
          type="search"
          value={query}
          autoFocus
          placeholder={t.search.placeholder}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      {query.trim() !== '' && (
        <p className="muted small" role="status">
          {results.length === 0
            ? format(t.search.noResults, { query: query.trim() })
            : format(t.search.results, { n: results.length })}
        </p>
      )}

      <div className="list">
        {results.map((guide) => {
          const category = content.categories.find(
            (entry) => entry.id === guide.categoryId,
          )
          return (
            <a key={guide.id} className="card" href={`#/g/${guide.id}`}>
              <IconTile
                icon={guide.icon}
                tone={category?.tone ?? 'coral'}
                size={44}
              />
              <span className="card-text">
                <strong>{text(guide.title, language)}</strong>
                <span className="muted small">
                  {text(guide.summary, language)}
                </span>
              </span>
              <Icon name="chevron" size={20} />
            </a>
          )
        })}
      </div>
    </div>
  )
}
