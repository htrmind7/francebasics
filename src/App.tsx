import { useState } from 'react'
import {
  emptyProgress,
  loadProgress,
  saveProgress,
  toggleStep,
} from './app/progress.ts'
import { useRoute, type Route } from './app/router.ts'
import type { ScreenProps } from './app/types.ts'
import { loadPublishedContent } from './content/content.ts'
import { useI18n } from './i18n/context.tsx'
import { CategoryScreen } from './screens/CategoryScreen.tsx'
import { ChecklistScreen } from './screens/ChecklistScreen.tsx'
import { GuideScreen } from './screens/GuideScreen.tsx'
import { HomeScreen } from './screens/HomeScreen.tsx'
import { SearchScreen } from './screens/SearchScreen.tsx'
import { SettingsScreen } from './screens/SettingsScreen.tsx'
import { Icon } from './ui/Icon.tsx'

const content = loadPublishedContent()

const NAV = [
  { name: 'home', href: '#/', icon: 'home' },
  { name: 'search', href: '#/search', icon: 'search' },
  { name: 'checklist', href: '#/checklist', icon: 'list' },
  { name: 'settings', href: '#/settings', icon: 'gear' },
] as const

/** Which tab is highlighted: guides and topics belong to Home. */
function activeTab(route: Route): (typeof NAV)[number]['name'] {
  return route.name === 'category' || route.name === 'guide'
    ? 'home'
    : route.name
}

export default function App() {
  const { t } = useI18n()
  const route = useRoute()
  const [progress, setProgress] = useState(loadProgress)

  function update(next: typeof progress) {
    saveProgress(next)
    setProgress(next)
  }

  const props: ScreenProps = {
    content,
    progress,
    onToggleStep: (checklistId, stepId) =>
      update(toggleStep(progress, checklistId, stepId)),
    onResetProgress: () => update(emptyProgress()),
    onImportProgress: update,
  }

  const labels = {
    home: t.nav.home,
    search: t.nav.search,
    checklist: t.nav.checklist,
    settings: t.nav.settings,
  }
  const current = activeTab(route)

  return (
    <>
      <main>
        {route.name === 'home' && <HomeScreen {...props} />}
        {route.name === 'category' && (
          <CategoryScreen {...props} id={route.id} />
        )}
        {route.name === 'guide' && <GuideScreen {...props} id={route.id} />}
        {route.name === 'search' && <SearchScreen {...props} />}
        {route.name === 'checklist' && <ChecklistScreen {...props} />}
        {route.name === 'settings' && <SettingsScreen {...props} />}
      </main>
      <nav className="tabbar" aria-label="Main">
        {NAV.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={current === item.name ? 'tab tab-active' : 'tab'}
            aria-current={current === item.name ? 'page' : undefined}
          >
            <Icon name={item.icon} size={22} />
            <span>{labels[item.name]}</span>
          </a>
        ))}
      </nav>
    </>
  )
}
