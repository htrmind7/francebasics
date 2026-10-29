# FranceBasics — everyday life in France, explained

A small installable PWA for people who have just arrived in France (international
students first). It explains how daily life, social codes and "how things work"
make sense, with short illustrated cards. English by default, Vietnamese as an option.

## 1. Scope rule (the most important one)

This app **explains**; it never **informs officially**.

- Explain what a procedure is, why it exists, in which order things happen, and what
  people usually get wrong.
- Never state figures, amounts, deadlines, eligibility rules, form numbers or
  documents lists as facts. These change; the official site is the source of truth.
- Every procedure card ends with a clear "Official source" button that opens the
  relevant government page (service-public.gouv.fr, ameli.fr, caf.fr, etc.).
- A permanent disclaimer: "General explanations, not legal or official advice.
  Always check the official site."
- Social and cultural content (greetings, meals, politeness, tipping, noise rules
  in buildings, strikes, shops closing...) is stable and can be stated directly.

## 2. Audience

International students and newcomers with little French. Test user: a student
arriving in Reims. Level of English: simple, short sentences, no idioms.

## 2b. Languages

- English is the default; Vietnamese (vi) is selectable in Settings (per device,
  `localStorage`), more languages can be added later.
- UI texts live in one file per language (`i18n/en.json`, `i18n/vi.json`), same keys.
- Guides keep one shared structure; every text field is an object `{ en, vi }`.
  A guide is publishable in English alone: a missing `vi` falls back to `en`.
- French phrases (with audio) are never translated, only their meaning is.
- Official links stay the same in all languages (French government sites).
- A test checks that `vi.json` has exactly the keys of `en.json`.

## 3. Content model

Static JSON, no server, no accounts, no API keys, no personal data.

- `Category`: id, title, icon, order (e.g. First days, Money, Housing, Health,
  Getting around, Food and meals, Social codes, Study life, Emergencies).
- `Guide` (a card): id (never changes), categoryId, title, icon, summary (one
  sentence), `kind` = `explainer` | `culture` | `procedure`, `sections[]`
  (heading + text, max ~5), `keyPoints[]` (3 to 5 bullets), `commonMistakes[]`,
  `phrases[]` (optional: French phrase + English meaning + tap to listen),
  `officialLinks[]` (required for `procedure`), `lastChecked` (ISO date),
  `status` = `draft` | `validated`.
- `Checklist`: ordered steps for a situation ("First 2 weeks"), each step linking to
  a guide. Ticks stored in localStorage.
- Only `validated` guides are published; a validated guide's id never changes.

## 4. Screens

1. **Home**: "I just arrived" checklist progress, situations ("I need a bank
   account", "I'm invited to dinner"), category grid.
2. **Category**: list of guides with icons.
3. **Guide**: illustrated card, key points, common mistakes, phrases with audio,
   official source button, last checked date.
4. **Search**: local full-text over titles, summaries and keywords.
5. **Checklist**: "First days / first month" steps, tickable.
6. **Settings**: appearance (light, dark, mint), text size, export/reset progress.

## 5. Illustration

Hand-made SVG icons and simple scene illustrations in one consistent style. No
photos, no third-party artwork, no licensing issues. Colors from CSS tokens.

## 6. Stack

Vite, React, TypeScript (strict), vite-plugin-pwa (offline), Vitest, zod,
GitHub Pages (public repo, non-commercial), @fontsource fonts (no CDN).
Pure logic (search, checklist progress, content loading) is tested.

## 7. Content rules

- Written directly as drafts, then validated by the owner. Doubts go in
  `reviewNotes`.
- Each `procedure` guide has at least one official link and a `lastChecked` date;
  a CI/test fails if one is missing.
- Review of links and dates every 6 months; stale guides (> 12 months) show a
  "may be outdated" badge.
- Neutral tone: no political opinions, no generalisations about people.

## 8. Milestones

- Status: M0 to M5 done (23 guides, 2 checklists, EN + VI). M6 is user testing.
- M0 Setup: repo, Vite/React/TS, lint, tests, CI, Pages deploy.
- M1 Content schemas, loader, validation test (official link required).
- M2 Home, category and guide screens, icons.
- M3 Search and checklist (localStorage).
- M4 PWA offline, appearances, settings, export/reset.
- M5 Content V0: about 20 guides (first days, money, housing, health, transport,
  social codes, emergencies), reviewed by the owner.
- M6 Test with the first user, then public launch.

## 9. Open decisions

- Final URL (name: FranceBasics; default is htrmind7.github.io/francebasics).
- Whether to add a French-phrase audio feature (Web Speech API).
