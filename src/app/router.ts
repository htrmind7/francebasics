import { useEffect, useState } from 'react'

export type Route =
  | { name: 'home' }
  | { name: 'category'; id: string }
  | { name: 'guide'; id: string }
  | { name: 'search' }
  | { name: 'checklist' }
  | { name: 'settings' }
  | { name: 'credits' }

/** Hash routes keep the browser back button working inside the installed app. */
export function parseRoute(hash: string): Route {
  const [, kind, id] = hash.replace(/^#/, '').split('/')
  switch (kind) {
    case 'c':
      return id
        ? { name: 'category', id: decodeURIComponent(id) }
        : { name: 'home' }
    case 'g':
      return id
        ? { name: 'guide', id: decodeURIComponent(id) }
        : { name: 'home' }
    case 'search':
      return { name: 'search' }
    case 'checklist':
      return { name: 'checklist' }
    case 'settings':
      return { name: 'settings' }
    case 'credits':
      return { name: 'credits' }
    default:
      return { name: 'home' }
  }
}

export function routeHref(route: Route): string {
  switch (route.name) {
    case 'category':
      return `#/c/${encodeURIComponent(route.id)}`
    case 'guide':
      return `#/g/${encodeURIComponent(route.id)}`
    case 'home':
      return '#/'
    default:
      return `#/${route.name}`
  }
}

export function useRoute(): Route {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return parseRoute(hash)
}
