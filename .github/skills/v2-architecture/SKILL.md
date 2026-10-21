---
name: v2-architecture
description: >-
  Entry point for writing code in packages/v2/: directory structure, available
  backends, which v2 skill owns which pattern, and the v2 development checklist.
  USE FOR: creating a new v2 component, finding the right v2 skill, reviewing
  v2 changes against the checklist. Code conventions (imports, CSS) are in
  .github/instructions/v2.instructions.md; type safety is in the typescript
  skill. For migrating a v1 panel use v2-migration; for removing a v1/v2
  toggle and v1 code use v1-cleanup.
---

# v2 Architecture

Code in `packages/v2/` follows stricter TypeScript rules and different conventions than the rest of the monorepo. The conventions are in `.github/instructions/v2.instructions.md`. This skill is the entry point; each topic is owned by one skill:

| Topic | Skill |
| --- | --- |
| Type safety, tsconfig and `yarn ts-check` | `typescript` |
| Stable re-exports of generated DTOs and kodeverk | `generated-types` |
| BackendClient, BackendApiType, API context and provider | `backend-client` |
| queryOptions, query keys, mutations, `useSuspenseQuery` | `data-fetching` |
| Kodeverk constants and name lookups | `kodeverk` |
| Stories, decorators and tests | `storybook` |
| Adding and reading feature toggles | `feature-toggles` |
| Migrating a v1 panel behind a toggle | `v2-migration` |
| Removing the toggle and v1 code | `v1-cleanup` |

## v2 development checklist

Use for new v2 components and for the v2 part of a migration. Apply only the items relevant to the change.

- [ ] Code follows `.github/instructions/v2.instructions.md`
- [ ] Backend types are imported from stable re-exports (`generated-types`)
- [ ] Backend calls go through a BackendClient from the API context (`backend-client`)
- [ ] A component that is the only consumer of an endpoint fetches its own data, with correct query keys (`data-fetching`)
- [ ] Kodeverk uses generated constants and the kodeverkoppslag context, with no `alleKodeverk`/`kodeverk` prop (`kodeverk`)
- [ ] Stories cover ytelsestyper with different behaviour and the empty state, with tests as described in `storybook`
- [ ] `yarn ts-check` passes, and the affected Storybook and Vitest tests pass

## Directory structure

```
packages/v2/
├── backend/src/          # API-klienter, genererte typer og stabile re-eksporter
│   ├── k9sak/            # Generert fra OpenAPI-spesifikasjonen til k9-sak
│   ├── k9klage/          # Generert fra OpenAPI-spesifikasjonen til k9-klage
│   ├── k9tilbake/        # Generert fra OpenAPI-spesifikasjonen til k9-tilbake
│   ├── ungsak/           # Generert fra OpenAPI-spesifikasjonen til ung-sak
│   ├── ungtilbake/       # Generert fra OpenAPI-spesifikasjonen til ung-tilbake
│   ├── k9formidling/     # Manuell klient for k9-formidling
│   └── combined/         # Typer som kombinerer genererte typer fra flere backends
├── gui/src/              # React-komponenter
│   ├── behandling/       # Komponenter på behandlingsnivå
│   ├── fakta/            # Faktapaneler
│   ├── prosess/          # Prosesspaneler
│   ├── sak/              # Komponenter på saksnivå
│   ├── shared/           # Delte hjelpefunksjoner og komponenter
│   └── storybook/        # Storybook-mocker og decorators
└── lib/src/              # Hjelpefunksjoner uten UI
```

## Available backends

The `backend` value is one of the folders under `packages/v2/backend/src/`: `k9sak`, `ungsak`, `k9klage`, `k9tilbake`, `ungtilbake` (generated clients, see `generated-types`) and `k9formidling` (manual client). `combined/` holds types shared across several backends and is not a backend value.
