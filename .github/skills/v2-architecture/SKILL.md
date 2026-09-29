---
name: v2-architecture
description: >-
  Patterns and rules for writing code in packages/v2/. USE FOR: creating new
  components in v2/, using the OpenAPI-generated backend client, structuring
  API contracts, import conventions with .js suffix, and migrating old code
  to v2.
---

# v2 Architecture

Code in `packages/v2/` follows stricter TypeScript rules and different conventions than the rest of the monorepo.

## v2 development checklist

Use these sections for new v2 components and for migrations. Complete the additional migration checklist below only when replacing an existing panel.

### Backend types (when using backend data)

- [ ] Stable DTO re-export created in `packages/v2/backend/src/k9sak/kontrakt/<domain>/`
- [ ] Kodeverk enum re-exports created in `packages/v2/backend/src/k9sak/kodeverk/<path>/` for each enum used

### API contract (when calling a backend)

- [ ] API contract created with the `v2-api-contract` skill (`.github/skills/v2-api-contract/SKILL.md`), which defines names, file locations and templates. For a feature called `OmPleietrengende` against k9sak this gives:
  - `OmPleietrengendeBackendApiType` (interface, extends `BackendTilhørighet`)
  - `K9SakOmPleietrengendeBackendClient` (class, `readonly backend = 'k9sak'`)
  - `omPleietrengendeQueryOptions`
  - `OmPleietrengendeApiContext`
  Name the client after the backend: `K9Sak…`, `K9Klage…`, `K9Tilbake…`, `UngSak…` or `UngTilbake…`. Never call a raw URL or import directly from `generated/sdk.js`

### v2 component

- [ ] When the component is the sole consumer of an endpoint, it fetches its own data via `useSuspenseQuery` + API context instead of receiving that data from the shell
- [ ] If kodeverk lookups are needed, uses `K9KodeverkoppslagContext` — no `alleKodeverk` / `kodeverk` prop
- [ ] CSS module class names use bracket notation: `styles['myClass']` (required by `noPropertyAccessFromIndexSignature`)
- [ ] All imports use `.js` suffix
- [ ] No imports from non-v2 packages (`@k9-sak-web/utils`, `@k9-sak-web/types`, `@k9-sak-web/shared-components`, etc.)
- [ ] Avoid type assertions (`as Type`, especially `as any` / `as unknown as Type`) and non-null assertions (`!`) in both code and tests. Prefer inferred types, `satisfies`, typed helpers and explicit guards; handle invalid or missing values rather than asserting them away.

### Stories

- [ ] `<Feature>.stories.tsx` created next to the component in `packages/v2/gui/src/fakta/<feature>/`
- [ ] Reusable `withFake<Feature>Api(data)` decorator in `packages/v2/gui/src/storybook/decorators/` provides the API context + `<Suspense>` when the component fetches data (the `QueryClientProvider` comes from the global `withQueryClientProvider`, which creates a new client per story). Do not define local `withFakeApi` decorators inside stories
- [ ] `withK9Kodeverkoppslag()` decorator added if component uses kodeverk
- [ ] At least one story per ytelsestype (if behaviour differs) and one empty-state story
- [ ] When mocking backend data, use generated DTO types (flat string codes) — not old kodeverk objects
- [ ] For display components, prefer Storybook stories with `play` tests over React Testing Library (RTL) tests. When migrating an existing component, replace its RTL tests only after the stories cover the same rendering states and interactions. Keep pure logic tests, such as grouping and data transformations, in Vitest.

### Verification

- [ ] `yarn ts-check` passes with zero errors
- [ ] Run the affected Storybook `play` tests for display components; run Vitest (`yarn test`) for logic tests

## Migration checklist

Only apply these steps when replacing an existing fakta/prosess panel. Work through them in order.

### Feature toggle

- [ ] `BRUK_V2_<FEATURE>: false` added to `rootFeatureToggles` in `FeatureToggles.ts`
- [ ] Toggle enabled in `qFeatureToggles` in `k9/featureToggles.ts` for Q; after validation, remove the toggle and v1 code together so v2 becomes the default in Q and prod
- [ ] Ask the user whether they want a v1/v2 toggle using `VersjonsvelgerV1V2` for manual regression testing. Only add the versjonsvelger if they say yes.

### FaktaPanelDef wiring (one per behandling package)

- [ ] `getKomponent` is toggle-guarded — v2 branch passes only what the component needs (typically `behandlingUuid`), v1 branch unchanged
- [ ] v2 branch passes props explicitly by name — never `{...props}` / `{...deepCopyProps}` spread onto the v2 component
- [ ] `getEndepunkter` **kept** in the old `FaktaPanelDef` for v1 backwards compatibility (removed only when deleting v1 code)
- [ ] Compile-time deletion guard added to the **old v1 package files** — not the `FaktaPanelDef` (see "Marking old files for deletion" section below)

### AppConfigResolver

- [ ] Client context provider added (e.g. `<OmPleietrengendeApiContext value={new K9SakOmPleietrengendeBackendClient()}>`) in `packages/sak-app/src/app/AppConfigResolver.tsx`
- [ ] Add to ung `AppConfigResolver` too if the feature exists there

### Suspense boundary

- [ ] `<Suspense fallback={<LoadingPanel />}>` wraps the `<ErrorBoundary>` in each behandling `*Fakta.tsx` that renders the panel

### Comparison story (optional)

- [ ] If the user wants a v1/v2 versjonsvelger, ask as a separate follow-up whether they also want a comparison story for visual regression testing. If yes, render both versions with matching data through the feature-toggled `FaktaPanelDef` and `VersjonsvelgerV1V2`; keep the v2 component's own story independent. Add a compile-time deletion guard tied to the feature toggle in the comparison story so it is removed with the v1 branch.

## Directory Structure

```
packages/v2/
├── backend/src/          # TypeScript API clients, generated types, combined types
│   ├── k9sak/            # Generated from k9-sak OpenAPI spec
│   ├── k9klage/          # Generated from k9-klage OpenAPI spec
│   ├── k9tilbake/        # Generated from k9-tilbake OpenAPI spec
│   ├── ungsak/           # Generated from ung-sak OpenAPI spec
│   ├── ungtilbake/       # Generated from ung-tilbake OpenAPI spec
│   ├── k9formidling/     # Manual client for k9-formidling
│   └── combined/         # Types combining generated types from multiple backends
├── gui/src/              # React components
│   ├── behandling/       # Behandling-level components
│   ├── fakta/            # Fakta-panel components
│   ├── prosess/          # Prosess-panel components
│   ├── sak/              # Sak-level components
│   ├── shared/           # Shared utilities and components
│   └── storybook/        # Storybook mocks and decorators
└── lib/src/              # UI-independent utility functions
```

## Available backends

The `backend` value is one of the folders under `packages/v2/backend/src/`: `k9sak`, `ungsak`, `k9klage`, `k9tilbake`, `ungtilbake` (generated clients, see the mapping table in the `v2-api-contract` skill) and `k9formidling` (manual client). `combined/` holds types shared across several backends and is not a backend value.

## Import Rules

### Use `.js` suffix — always

```typescript
// ✅ Correct — modern TypeScript ESM convention
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';

// ❌ Wrong — no suffix or .ts suffix
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType';
```

### Import directly from stable files — avoid barrel `index.ts` re-exports

```typescript
// ✅ Direct file import
import type { UtenlandsoppholdDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/UtenlandsoppholdDto.js';

// ❌ Avoid generic barrel imports
import type { BehandlingDto } from '@k9-sak-web/backend';
```

### No imports from non-v2 packages

```typescript
// ✅ OK inside packages/v2/
import { something } from '@k9-sak-web/backend/k9sak/...';
import { something } from '@k9-sak-web/gui/...';
import { something } from 'react';
import { something } from '@navikt/ds-react';

// ❌ Never inside packages/v2/
import { something } from '@k9-sak-web/utils';
import { something } from '@k9-sak-web/shared-components';
import { something } from '@k9-sak-web/types';
```

## Generated Backend Client

Generated types and SDK functions come from published client packages (`@navikt/k9-sak-typescript-client`, `@navikt/k9-klage-typescript-client`, etc.) and are re-exported via `@k9-sak-web/backend` using `export *`. All types and SDK functions are available through the `@k9-sak-web/backend` imports. When searching for available types/endpoints, search in `node_modules/@navikt/k9-sak-typescript-client/src/types.gen.ts` and `sdk.gen.ts` — the re-export layer (`packages/v2/backend/src/k9sak/generated/`) uses `export *` so everything is available, but the source files are the definitive reference.

**GUI components should not import directly from `generated/types.js`.** The generated type names (e.g. `k9_sak_kontrakt_uttak_UtenlandsoppholdDto`) can change when the OpenAPI spec changes. Instead, create stable re-exports under `packages/v2/backend/src/k9sak/` with friendly aliases, then import from those. Backend re-export files may import from `generated/types.js` or directly from the published client:

**DTO types** — re-export in `kontrakt/<domain>/`:

```typescript
// packages/v2/backend/src/k9sak/kontrakt/uttak/UtenlandsoppholdDto.ts
export type {
  k9_sak_kontrakt_uttak_UtenlandsoppholdDto as UtenlandsoppholdDto,
  k9_sak_kontrakt_uttak_UtenlandsoppholdPeriodeDto as UtenlandsoppholdPeriodeDto,
} from '@navikt/k9-sak-typescript-client/types';
```

**Kodeverk const enums** — re-export under `kodeverk/` mirroring the package path from the generated type name:

```typescript
// k9_kodeverk_geografisk_Region → kodeverk/geografisk/Region.ts
export { k9_kodeverk_geografisk_Region as Region } from '@navikt/k9-sak-typescript-client/types';
export type { k9_kodeverk_geografisk_Region as RegionType } from '@navikt/k9-sak-typescript-client/types';

// k9_kodeverk_uttak_UtenlandsoppholdÅrsak → kodeverk/uttak/UtenlandsoppholdÅrsak.ts
export { k9_kodeverk_uttak_UtenlandsoppholdÅrsak as UtenlandsoppholdÅrsak } from '@navikt/k9-sak-typescript-client/types';
export type { k9_kodeverk_uttak_UtenlandsoppholdÅrsak as UtenlandsoppholdÅrsakType } from '@navikt/k9-sak-typescript-client/types';
```

Then import from the stable paths:

```typescript
import type { UtenlandsoppholdDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/UtenlandsoppholdDto.js';
import { Region } from '@k9-sak-web/backend/k9sak/kodeverk/geografisk/Region.js';
import { UtenlandsoppholdÅrsak } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/UtenlandsoppholdÅrsak.js';
```

### Combined types

Use `combined/` for types shared across multiple backends:

```typescript
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
```

### Fix OpenAPI spec instead of duplicating types

If a generated type is wrong or missing, **fix the OpenAPI definition in the backend** rather than writing manual TypeScript types.

### Local development with unreleased backend

If the k9-sak API hasn't been released yet:

```bash
# In k9-sak project: run "web/generate typescript client" IntelliJ run config
yarn link ~/path/to/k9-sak/web/target/ts-client
# Remember to unlink before committing!
yarn unlink @navikt/k9-sak-typescript-client
```

## API Contract Pattern

Components receive their backend client via React Context (`<Feature>ApiContext`). The interface, client, `queryOptions()` and context are created with the `v2-api-contract` skill (`.github/skills/v2-api-contract/SKILL.md`), which defines names, file locations and templates.

## No i18n or Translation Layer

v2 code has no internationalization support. Use plain Norwegian strings directly.

## Key Kodeverk/Constants

Use generated kodeverk constants — never hardcode string literals for domain codes:

```typescript
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
```

## Kodeverk — use `K9KodeverkoppslagContext` (type-safe)

Kodeverk data is available via context provided high up in the tree. **Never** accept `alleKodeverk` or a `kodeverk` object as a React prop in v2 components. **Never** use the old `useKodeverkContext()` hook in new code — it is untyped and being phased out.

Use `K9KodeverkoppslagContext` with `useContext` (or `use` in React 19):

```typescript
import { useContext } from 'react';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.js';

const kodeverkoppslag = useContext(K9KodeverkoppslagContext);

// Type-safe lookup — kode param is a union of valid enum values
const årsak = kodeverkoppslag.k9sak.utenlandsoppholdÅrsaker('INGEN');
årsak.navn; // string

// With optional (returns undefined instead of throwing)
import { OrUndefined } from '@k9-sak-web/gui/kodeverk/oppslag/GeneriskKodeverkoppslag.js';
const maybeÅrsak = kodeverkoppslag.k9sak.utenlandsoppholdÅrsaker(kode, OrUndefined);
maybeÅrsak?.navn; // string | undefined
```

Methods exist per kodeverk type on `kodeverkoppslag.k9sak`, e.g. `behandlingTyper()`, `fagsakYtelseTyper()`, `avslagsårsaker()`, `utenlandsoppholdÅrsaker()`, etc.

For klage/tilbake-specific kodeverk, use `kodeverkoppslag.k9klage` or `kodeverkoppslag.k9tilbake`.

### KodeverkType enum (legacy)

`KodeverkType` from `@k9-sak-web/lib/kodeverk/types.js` is part of the old `useKodeverkContext()` system. Avoid in new code — use `K9KodeverkoppslagContext` methods instead.

## Feature Toggles — required for every migration

All migrations from old packages to v2 MUST be guarded by a feature toggle so both implementations can coexist during rollout.

### Adding a toggle

1. Add `BRUK_V2_MY_FEATURE: false` to `rootFeatureToggles` in [FeatureToggles.ts](../../../packages/v2/gui/src/featuretoggles/FeatureToggles.ts)
2. In [k9/featureToggles.ts](../../../packages/v2/gui/src/featuretoggles/k9/featureToggles.ts), add it to `qFeatureToggles` with `true` to enable in Q
3. After validating v2 in Q, remove the toggle and old v1 implementation together so v2 becomes the default in both Q and prod.

### Using a toggle in a FaktaPanelDef

The old-style `FaktaPanelDef` classes receive `props.featureToggles` from the behandling framework.

If the v2 component fetches generated DTOs itself, pass only what it needs (for example `behandlingUuid`); no kodeverk conversion is needed at the shell boundary. If the v2 component must receive legacy props containing kodeverk objects (`{ kode, kodeverk }`), map the needed values to the v2 prop types explicitly. Use `konverterKodeverkTilKode` at the boundary only when such legacy data actually needs recursive conversion; it converts two-field kodeverk objects but leaves objects with additional fields unchanged. Do not use `JSON.parse(JSON.stringify(props))` as a default copying or typing strategy.

**Never spread `{...props}` or `{...deepCopyProps}` onto the v2 component.** Pass each prop the component's typed interface declares, by name. Spreading the whole legacy props object defeats the v2 component's prop typing and silently forwards props it never asked for. The `{...props}` on the **old** v1 branch is fine to leave as-is.

### Marking old files for deletion — compile-time guard

Add a compile-time type lookup in every **old v1 package file** (e.g. in `packages/fakta-<feature>/src/`).  The `FaktaPanelDef` files are **not** the right place — they survive the migration (their v1 branch just gets removed). The old package files are what get deleted entirely.

This causes a TypeScript compile error when the toggle key is removed from `FeatureToggles`, forcing cleanup before the build passes:

```typescript
// Kompileringsfeil her betyr at BRUK_V2_MY_FEATURE er fjernet fra FeatureToggles.
// Slett hele packages/fakta-<feature> og fjern v1-grenen i FaktaPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_MY_FEATURE'];
```

Note: Use the inline `import(...)` form so you don't need to add a top-level import just for the guard.

The `FeatureToggles['BRUK_V2_MY_FEATURE']` lookup will fail with `Property 'BRUK_V2_MY_FEATURE' does not exist on type 'FeatureToggles'` the moment the key is deleted, making it impossible to merge that deletion without also cleaning up the v1 code.

## Suspense boundary — required for `useSuspenseQuery`

v2 components that use `useSuspenseQuery` suspend while loading by throwing a Promise. The render tree **must** have a `<Suspense>` boundary to catch it — otherwise React crashes.

The old-style `*Fakta.tsx` files (e.g. `PleiepengerFakta.tsx`, `OpplaeringspengerFakta.tsx`, `PleiepengerSluttfaseFakta.tsx`) render `getKomponent` inside an `<ErrorBoundary>`. A `<Suspense>` should wrap the ErrorBoundary:

```tsx
import { Suspense } from 'react';

<Suspense fallback={<LoadingPanel />}>
  <ErrorBoundary errorMessageCallback={addErrorMessage}>
    {valgtPanel.getPanelDef().getKomponent({ ... })}
  </ErrorBoundary>
</Suspense>
```

This was added to all 3 behandling Fakta shells. Any new behandling type that renders FaktaPanelDefs must also include it.

## Wiring API contexts in AppConfigResolver

When a v2 component uses an API context (e.g. `UtenlandsoppholdApiContext`), the provider must be added in the relevant `AppConfigResolver.tsx`, following the existing pattern of nested context providers:

- K9: `packages/sak-app/src/app/AppConfigResolver.tsx`
- Ung: `packages/ung/sak-app/app/AppConfigResolver.tsx`

```tsx
import { MyFeatureApiContext } from '@k9-sak-web/gui/fakta/myfeature/api/MyFeatureApiContext.js';
import { K9SakMyFeatureBackendClient } from '@k9-sak-web/gui/fakta/myfeature/api/K9SakMyFeatureBackendClient.js';

// In the render tree:
<MyFeatureApiContext value={new K9SakMyFeatureBackendClient()}>{children}</MyFeatureApiContext>;
```

## Data fetching — prefer `useSuspenseQuery` in the component

When a v2 component is the **sole consumer** of a backend endpoint, it should fetch the data itself rather than receiving it as a prop. Use `useSuspenseQuery` from `@tanstack/react-query` with the API context:

```typescript
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { MyFeatureApiContext } from './api/MyFeatureApiContext.js';

const api = useContext(MyFeatureApiContext);
if (!api) throw new Error('MyFeatureApiContext not provided');

// myFeatureQueryOptions er definert med queryOptions() i api/myFeatureQueryOptions.ts
const { data } = useSuspenseQuery(myFeatureQueryOptions(api, behandlingUuid));
```

This eliminates the need for `konverterKodeverkTilKode` at the shell boundary, since the SDK response already uses generated types.

## verbatimModuleSyntax — import type required for re-exported types

v2 uses `"verbatimModuleSyntax": true`. Any import that is **only used as a type** must use `import type`:

```typescript
// ✅ Correct
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

// ❌ Wrong — TypeScript will error
import { fagsakYtelsesType, FagsakYtelsesType } from '...';
```

## noPropertyAccessFromIndexSignature — CSS module classes

With `"noPropertyAccessFromIndexSignature": true`, CSS module class names must use bracket notation:

```typescript
// ✅ Correct
<div className={styles['myClass']} />

// ❌ Wrong — TypeScript will error
<div className={styles.myClass} />
```

## noUncheckedIndexedAccess — array index access returns T | undefined

With `"noUncheckedIndexedAccess": true`, `array[n]` returns `T | undefined`. Check that the element exists instead of using `!`, including in stories and tests:

```typescript
const first = items[0];
if (first === undefined) {
  throw new Error('Expected at least one item');
}
```
