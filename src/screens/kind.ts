import type { Guide } from '../content/schemas.ts'
import type { Messages } from '../i18n/i18n.ts'

export function kindLabel(kind: Guide['kind'], t: Messages): string {
  switch (kind) {
    case 'culture':
      return t.guide.kindCulture
    case 'procedure':
      return t.guide.kindProcedure
    default:
      return t.guide.kindExplainer
  }
}
