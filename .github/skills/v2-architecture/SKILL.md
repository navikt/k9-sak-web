---
name: v2-architecture
description: 'Patterns and rules for writing code in packages/v2/. USE FOR: creating new components in v2/, using the OpenAPI-generated backend client, structuring API contracts, import conventions with .js suffix, and migrating old code to v2. DO NOT USE FOR: code outside packages/v2/, NAV Aksel component usage (use @aksel-agent), or general React patterns.'
---

# v2 Architecture

Code in `packages/v2/` follows stricter TypeScript rules and different conventions than the rest of the monorepo.

## Directory Structure

```
packages/v2/
├── backend/src/          # TypeScript API clients, generated types, combined types
│   ├── k9sak/            # Generated from k9-sak OpenAPI spec
│   ├── k9klage/          # Generated from k9-klage OpenAPI spec
│   ├── k9tilbake/        # Generated from k9-tilbake OpenAPI spec
│   ├── ungsak/           # Generated from ung-sak OpenAPI spec
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

## Import Rules

### Use `.js` suffix — always
```typescript
// ✅ Correct — modern TypeScript ESM convention
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';

// ❌ Wrong — no suffix or .ts suffix
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType';
```

### Import directly from files — avoid barrel `index.ts` re-exports
```typescript
// ✅ Direct file import
import type { k9_sak_kontrakt_behandling_BehandlingDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

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

**Never import directly from `generated/types.js`.** The generated type names (e.g. `k9_sak_kontrakt_uttak_UtenlandsoppholdDto`) can change when the OpenAPI spec changes. Instead, create stable re-exports under `packages/v2/backend/src/k9sak/` with friendly aliases, then always import from those:

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

### Using generated types
Types are generated from OpenAPI specs. Names use the full package path with underscores as separator — use these when creating re-exports:

```typescript
// In a re-export file:
export type { k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto } from '@navikt/k9-sak-typescript-client/types';
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

Components receive their backend client via React Context:

**1. Define the interface** (`api/MyFeatureApi.ts`):
```typescript
export interface MyFeatureApi {
  getMyData(id: string): Promise<MyDataDto>;
  saveMyData(data: SaveDto): Promise<void>;
}
```

**2. Create the context** (`api/MyFeatureApiContext.ts`):
```typescript
import { createContext } from 'react';
import type { MyFeatureApi } from './MyFeatureApi.js';

export const MyFeatureApiContext = createContext<MyFeatureApi | null>(null);
```

**3. Use in component**:
```typescript
const api = use(MyFeatureApiContext);
if (!api) throw new Error('MyFeatureApiContext not provided');
```

**4. Create a fake for Storybook** (`storybook/mocks/FakeMyFeatureApi.ts`):
```typescript
export class FakeMyFeatureApi implements MyFeatureApi {
  async getMyData(id: string): Promise<MyDataDto> {
    return { id, name: 'Test data' };
  }
  async saveMyData(data: SaveDto): Promise<void> {
    action('saveMyData')(data);
  }
}
```

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
3. Once stable in prod, move the toggle to `k9SpecificFeatureToggles` and delete the old implementation

### Using a toggle in a FaktaPanelDef
The old-style `FaktaPanelDef` classes receive `props.featureToggles` from the behandling framework.

When passing v1 data into a v2 component, `konverterKodeverkTilKode` is **required** at the stitching boundary. Old-style props contain kodeverk objects (`{ kode, kodeverk }`) but v2 components expect flat string codes:

```typescript
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

getKomponent = props => {
  if (props.featureToggles?.BRUK_V2_MY_FEATURE) {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return <MyFeatureV2Index {...deepCopyProps} />;
  }
  return <OldMyFeature {...props} />;
};
```

`konverterKodeverkTilKode` recursively converts 2-attr kodeverk objects (`{ kode, kodeverk }`) to plain strings (the `kode` value). Objects with 3+ attrs (e.g. `{ kode, kodeverk, namn }`) are kept as-is. Adjust your v2 component types accordingly.

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
import { K9MyFeatureBackendClient } from '@k9-sak-web/gui/fakta/myfeature/api/K9MyFeatureBackendClient.js';

// In the render tree:
<MyFeatureApiContext value={new K9MyFeatureBackendClient()}>
  {children}
</MyFeatureApiContext>
```

## Data fetching — prefer `useSuspenseQuery` in the component

When a v2 component is the **sole consumer** of a backend endpoint, it should fetch the data itself rather than receiving it as a prop. Use `useSuspenseQuery` from `@tanstack/react-query` with the API context:

```typescript
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { MyFeatureApiContext } from './api/MyFeatureApiContext.js';

const api = useContext(MyFeatureApiContext);
if (!api) throw new Error('MyFeatureApiContext not provided');

const { data } = useSuspenseQuery({
  queryKey: ['myFeature', behandlingUuid],
  queryFn: () => api.getMyData(behandlingUuid),
});
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

With `"noUncheckedIndexedAccess": true`, `array[n]` returns `T | undefined`. Use `array[n]!` when you know the index is valid:

```typescript
// ✅ In stories/tests where the index is guaranteed
utenlandsoppholdMock.perioder[0]!

// ✅ In production code: guard instead
const first = items[0];
if (!first) return null;
```

