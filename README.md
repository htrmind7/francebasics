# FranceBasics

Everyday life in France, explained. A small installable PWA for newcomers
(international students first): short illustrated cards about daily life, social
codes and how things work. English by default, Vietnamese as an option.

The app explains; it never gives official information. Procedures always link to
the official government site. See [SPEC.md](SPEC.md).

## Content

Guides live in `content/guides/*.json` (one file per topic), topics in
`content/categories.json`, checklists in `content/checklists.json`. Every text has an
English version and, optionally, a Vietnamese one. Procedure guides must have an
official link (checked by the tests). Only `validated` guides are published.

## Commands

- `npm run dev` start the dev server
- `npm test` / `npm run lint` / `npm run build`
- `npm run format` Prettier

## Deployment

GitHub Pages through `.github/workflows/deploy.yml` (lint, tests, build, deploy on
push to `main`). Site: https://htrmind7.github.io/francebasics/
GitHub Pages does not allow commercial use.
