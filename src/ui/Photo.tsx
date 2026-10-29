import type { Image } from '../content/schemas.ts'
import { text } from '../content/loader.ts'
import type { Language } from '../i18n/i18n.ts'

export function imageSrc(image: Image): string {
  return `${import.meta.env.BASE_URL}images/${image.file}`
}

/** Photo with its credit: free licences still require naming the author. */
export function Photo({
  image,
  language,
  eager = false,
  caption = false,
}: {
  image: Image
  language: Language
  eager?: boolean
  caption?: boolean
}) {
  return (
    <figure className="photo">
      <img
        src={imageSrc(image)}
        alt={text(image.alt, language)}
        width={800}
        height={450}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      {caption && (
        <figcaption>
          <a href={image.source} target="_blank" rel="noopener noreferrer">
            {image.author} · {image.license}
          </a>
        </figcaption>
      )}
    </figure>
  )
}
