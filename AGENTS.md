# AGENTS.md — navikt/k9-sak-web

## Repository Overview

React/TypeScript monorepo for NAV's K9 case handling system (K9 Sak). Processes benefits including Pleiepenger, Omsorgspenger, Opplæringspenger, and Ungdomsytelse.

## Tech Stack

- **React 19** + TypeScript 5 (strict in `packages/v2/`)
- **Vite 7** for building and dev server
- **Yarn 4** (ALWAYS use yarn, never npm)
- **NAV Aksel Design System** (`@navikt/ds-react`, `@navikt/ds-css`, `@navikt/ds-tailwind`)
- **CSS Modules + Tailwind CSS** for styling
- **react-hook-form**, **react-router 7**
- **Vitest** for unit tests, **Storybook** for UI component tests

## Build & Test Commands

```bash
yarn install        # Installer avhengigheter
yarn dev            # Start utviklingsserver (K9)
yarn dev:ung        # Start utviklingsserver (Ungdomsytelse)
yarn test           # Kjør tester
yarn test:watch     # Kjør tester i watch-modus
yarn ts-check       # Typekontroll
yarn lint           # Lint kode
yarn lint:fix       # Auto-fiks linting
yarn storybook      # Start Storybook
yarn build          # Bygg for produksjon
```

## Project Structure

```
packages/
├── v2/              # Moderne kode med strikt TypeScript (ny kode hit)
├── behandling-*     # Behandlingsmoduler per ytelsestype
├── fakta-*          # Fakta-innhentings-komponenter
├── prosess-*        # Prosesssteg-komponenter
├── shared-components/
├── types/
├── utils/
└── rest-api/
```

## Code Standards

- TypeScript strict mode (required in `packages/v2/`)
- Functional React components with typed props interfaces
- CSS Modules (`.module.css`) for styling — no inline styles
- Use `@navikt/ds-react` components (Button, TextField, Alert, etc.)
- Norwegian for domain language; English for technical terms
- Accessibility: always include ARIA labels and semantic HTML
- No i18n frameworks — use plain strings or centralized constants

## Boundaries

### ✅ Always

- Bruk `yarn`, aldri `npm`
- Følg eksisterende kode‑mønstre i pakken du jobber i
- Ny kode i `packages/v2/` — ikke importer fra ikke-v2-pakker der inne
- Sjekk null/undefined eksplisitt (strict null checks)
- Inkluder loading-, error- og empty-states
- Kjør `yarn test` og `yarn ts-check` før commit

### ⚠️ Spør først

- Endre autentiseringsmekanismer
- Legge til nye pakke-avhengigheter
- Endre delte typer i `packages/types/`
- Synkroniserte pakker (må ha samme versjon overalt): `@navikt/aksel-icons`, `@navikt/ds-css`, `@navikt/ds-react`, `@navikt/ds-tailwind`, `@navikt/ft-plattform-komponenter`

### 🚫 Never

- Bruk `npm install` — alltid `yarn`
- Commit hemmeligheter eller credentials
- Bruk `any` uten god grunn
- Inline styles (`style={{ ... }}`)
- Importer på tvers av pakker med relative stier (`../../`)
- Importer fra ikke-v2-pakker inne i `packages/v2/`
- Bruk MSW eller `vi.spyOn` for HTTP-mocking i tester

## Relevant Agents

- **`@aksel-agent`** — NAV Aksel Design System, tokens, responsive layouts
- **`@auth-agent`** — Azure AD, TokenX, sikkerhet
- **`@nais-agent`** — NAIS-deployment og infrastruktur
- **`@security-champion-agent`** — Trusselmodellering, GDPR
- **`@research-agent`** — Kodebase-research og kontekstinnhenting
