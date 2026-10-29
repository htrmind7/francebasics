import categories from '../../content/categories.json'
import checklists from '../../content/checklists.json'
import guides from '../../content/guides.json'
import { parseContent, publishedContent, type Content } from './loader.ts'

/** The published content bundled with the app; throws if the files are invalid. */
export function loadPublishedContent(): Content {
  return publishedContent(parseContent({ categories, guides, checklists }))
}
