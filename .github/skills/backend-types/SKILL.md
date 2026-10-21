---
name: backend-types
description: 'Stable re-exports of OpenAPI-generated DTO types and kodeverk enums in packages/v2/backend/src/<backend>/. USE FOR: creating or reviewing files under kontrakt/ or kodeverk/, choosing between export and export type, finding generated types in the published typescript clients, combined types, linking an unreleased backend client. DO NOT USE FOR: BackendClient, queryOptions or API context (use api-contract), or general v2 conventions (use v2-architecture).'
---

# v2 Backend Types

Generated types and SDK functions come from the published client packages and are re-exported with `export *` in `packages/v2/backend/src/<backend>/generated/`. Generated names such as `k9_sak_kontrakt_uttak_UtenlandsoppholdDto` change when the OpenAPI spec changes, so GUI code never imports from `generated/types.js`. Create a stable re-export with a friendly alias in the backend package and import from that.

## Backend → client package

| Backend      | Client package                          | Import prefix                     |
| ------------ | --------------------------------------- | --------------------------------- |
| `ungsak`     | `@navikt/ung-sak-typescript-client`     | `@k9-sak-web/backend/ungsak/`     |
| `k9sak`      | `@navikt/k9-sak-typescript-client`      | `@k9-sak-web/backend/k9sak/`      |
| `k9klage`    | `@navikt/k9-klage-typescript-client`    | `@k9-sak-web/backend/k9klage/`    |
| `k9tilbake`  | `@navikt/k9-tilbake-typescript-client`  | `@k9-sak-web/backend/k9tilbake/`  |
| `ungtilbake` | `@navikt/ung-tilbake-typescript-client` | `@k9-sak-web/backend/ungtilbake/` |

Search for types in `node_modules/<client-package>/src/types.gen.ts` and for endpoints in `sdk.gen.ts`. These are the definitive sources.

## Where to put the re-export

Check whether a re-export already exists before creating one.

| Kind | Path | Example |
| --- | --- | --- |
| DTO | `packages/v2/backend/src/<backend>/kontrakt/<domain>/<TypeName>.ts` | `k9_sak_kontrakt_uttak_UtenlandsoppholdDto` → `kontrakt/uttak/UtenlandsoppholdDto.ts` |
| Kodeverk | `packages/v2/backend/src/<backend>/kodeverk/<path>/<EnumName>.ts`, mirroring the package path in the generated name | `k9_kodeverk_geografisk_Region` → `kodeverk/geografisk/Region.ts` |
| Shared across backends | `packages/v2/backend/src/combined/` | `combined/kontrakt/behandling/BehandlingDto.ts` |

The alias is the generated name without the package prefix. The prefix depends on the backend:

| Backend | Generated name | Alias |
| --- | --- | --- |
| `k9sak` | `k9_sak_kontrakt_uttak_UtenlandsoppholdDto` | `UtenlandsoppholdDto` |
| `ungsak` | `ung_sak_kontrakt_kontroll_RapportertInntektDto` | `RapportertInntektDto` |
| `k9klage` | `k9_klage_kontrakt_dokument_BestillBrevDto` | `BestillBrevDto` |
| `k9tilbake` | `foreldrepenger_tilbakekreving_web_app_tjenester_behandling_dto_BestillBrevDto` | `BestillBrevDto` |
| `ungtilbake` | `sif_tilbakekreving_web_app_tjenester_behandling_dto_BestillBrevDto` | `BestillBrevDto` |

Re-export files may import from `@k9-sak-web/backend/<backend>/generated/types.js` or directly from `<client-package>/types`.

## Export syntax — mandatory

Check the generated exports before choosing the syntax:

- **Const and type with the same name** (kodeverk enums): use exactly one `export { GeneratedName as Alias }`. It re-exports both the value and the type. Never use `export type` for that symbol, never split it into separate exports, and never add a `Type`-suffixed alias.
- **Type-only symbols** (DTOs): use `export type { GeneratedName as Alias }`.
- Write one export declaration per symbol, on one line.

```typescript
// kontrakt/uttak/UtenlandsoppholdDto.ts
export type { k9_sak_kontrakt_uttak_UtenlandsoppholdDto as UtenlandsoppholdDto } from '@navikt/k9-sak-typescript-client/types';
export type { k9_sak_kontrakt_uttak_UtenlandsoppholdPeriodeDto as UtenlandsoppholdPeriodeDto } from '@navikt/k9-sak-typescript-client/types';

// kodeverk/geografisk/Region.ts
export { k9_kodeverk_geografisk_Region as Region } from '@navikt/k9-sak-typescript-client/types';
```

```typescript
// ❌ Wrong for a const + type symbol
export { k9_kodeverk_geografisk_Region as Region } from '@navikt/k9-sak-typescript-client/types';
export type { k9_kodeverk_geografisk_Region as RegionType } from '@navikt/k9-sak-typescript-client/types';
```

## Importing

Import from the stable path with `.js` suffix:

```typescript
import type { UtenlandsoppholdDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/UtenlandsoppholdDto.js';
import { Region } from '@k9-sak-web/backend/k9sak/kodeverk/geografisk/Region.js';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
```

## Wrong or missing generated types

Fix the OpenAPI definition in the backend. Never write manual TypeScript types that duplicate generated ones.

To test against an unreleased k9-sak API:

```bash
# I k9-sak: kjør IntelliJ-konfigurasjonen "web/generate typescript client"
yarn link ~/path/to/k9-sak/web/target/ts-client
# Husk å fjerne linken før commit
yarn unlink @navikt/k9-sak-typescript-client
```
