# Project: FranceBasics (PWA guide to everyday life in France)

Read SPEC.md before any task. Work only on the requested milestone (M0..M6).

## Stack

Vite, React, TypeScript (strict, ~6.0 for typescript-eslint compatibility), vite-plugin-pwa, Vitest, zod. No server, no accounts, no API keys.

## Hosting

GitHub Pages, public repo, base path `/francebasics/` (vite.config.ts, manifest start_url and scope).

## Content

Guides: content/guides/*.json (one file per topic). Texts are `{ en, vi? }`, English is mandatory. Official links are root pages of French government sites (never deep links that may break).

## Photos

Photos live in public/images (800x450 JPEG) and are described in content/images.json (author, licence, source). Only free licences (public domain, CC0, CC BY, CC BY-SA); always credit the author. Never add a photo without its entry.

## Rules

- Code and identifiers in English; UI texts only in src/i18n/en.json and vi.json (same keys, checked by a test).
- The app explains, it never states official information (amounts, deadlines, eligibility, document lists). Procedure guides must link to the official source.
- Colors as CSS variables (src/styles/tokens.css), three appearances (light, dark, mint) stored per device.
- Preferences (language, appearance) live in localStorage, per device; never store personal data.
- Never modify a validated guide's id. Publish only validated guides.
- Mobile first (360 to 430 px), touch targets of at least 44 px.
- No dependency added without a one-sentence justification.

## Definition of done

Green tests, clean lint, successful build, summary of changes, commit message proposal.
