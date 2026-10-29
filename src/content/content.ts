import categories from '../../content/categories.json'
import checklists from '../../content/checklists.json'
import { parseContent, publishedContent, type Content } from './loader.ts'

// One JSON file per topic keeps reviews small
const guideFiles = import.meta.glob<unknown[]>('../../content/guides/*.json', {
  eager: true,
  import: 'default',
})

/** Every guide, drafts included; throws if the files are invalid. */
export function loadAllContent(): Content {
  const guides = Object.values(guideFiles).flat()
  return parseContent({ categories, guides, checklists })
}

/** The published content bundled with the app. */
export function loadPublishedContent(): Content {
  return publishedContent(loadAllContent())
}
