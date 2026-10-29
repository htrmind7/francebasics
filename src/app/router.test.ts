import { describe, expect, it } from 'vitest'
import { parseRoute, routeHref, type Route } from './router.ts'

describe('router', () => {
  it('falls back to home for empty or unknown hashes', () => {
    expect(parseRoute('')).toEqual({ name: 'home' })
    expect(parseRoute('#/nope')).toEqual({ name: 'home' })
    expect(parseRoute('#/g/')).toEqual({ name: 'home' })
  })

  it('round-trips every route', () => {
    const routes: Route[] = [
      { name: 'home' },
      { name: 'category', id: 'first-days' },
      { name: 'guide', id: 'open-bank-account' },
      { name: 'search' },
      { name: 'checklist' },
      { name: 'settings' },
    ]
    for (const route of routes) {
      expect(parseRoute(routeHref(route))).toEqual(route)
    }
  })
})
