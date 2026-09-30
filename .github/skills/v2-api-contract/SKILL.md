---
name: v2-api-contract
description: 'Create the API contract for a v2 component: SDK re-export, BackendApiType, BackendClient, QueryOptions, API context, based on OpenAPI-generated SDK endpoints. USE FOR: creating new BackendClient classes that wrap SDK calls, defining typed API contracts, generating TanStack Query options, wiring the API context. DO NOT USE FOR: modifying existing BackendClients, general v2 architecture questions (use v2-architecture skill), or writing React components.'
---

# v2 API Contract

Generate a complete API contract from OpenAPI-generated SDK endpoints in `@navikt/*-typescript-client` packages: typed client files and the React context that provides the client.

## Required Input

Ask the user for:

1. **SDK endpoints** — function names from the generated `sdk.gen.ts` (e.g. `kontroll_hentKontrollerInntekt`)
2. **Domain name** — PascalCase name for the feature (e.g. `AktivitetspengerBeregning`)
3. **Backend** — one of: `ungsak`, `k9sak`, `k9klage`, `k9tilbake`, `ungtilbake`
4. **Target folder** — relative path in `packages/v2/gui/src/` (e.g. `prosess/aktivitetspenger-beregning/`)
5. **QueryOptions** — whether to generate a queryOptions file (default: no)

## Backend → Client Package Mapping

| Backend      | Client package                          | Import prefix                     |
| ------------ | --------------------------------------- | --------------------------------- |
| `ungsak`     | `@navikt/ung-sak-typescript-client`     | `@k9-sak-web/backend/ungsak/`     |
| `k9sak`      | `@navikt/k9-sak-typescript-client`      | `@k9-sak-web/backend/k9sak/`      |
| `k9klage`    | `@navikt/k9-klage-typescript-client`    | `@k9-sak-web/backend/k9klage/`    |
| `k9tilbake`  | `@navikt/k9-tilbake-typescript-client`  | `@k9-sak-web/backend/k9tilbake/`  |
| `ungtilbake` | `@navikt/ung-tilbake-typescript-client` | `@k9-sak-web/backend/ungtilbake/` |

## Workflow

### Step 1: Read the SDK

Find the generated SDK file for the chosen backend:

```
node_modules/<client-package>/src/sdk.gen.ts
```

Where `<client-package>` is the full package name from the table above (e.g., `@navikt/ung-sak-typescript-client`).

Read the function signatures for each requested endpoint. Note:

- The HTTP method (GET/POST/PUT/DELETE)
- The `Options<XxxData, ThrowOnError>` parameter type
- The response type (e.g. `XxxResponses`)

### Step 2: Read the Types

In `node_modules/<client-package>/src/types.gen.ts`, find:

- The `XxxData` type — contains `query` and/or `body` fields showing the request shape
- The response type — the actual DTO returned

Where `<client-package>` is the full package name from the table above (e.g., `@navikt/ung-sak-typescript-client`).

Extract the DTO type names needed for the BackendApiType.

### Step 3: Create SDK Re-Export

Steps 3–8 show a worked example. `references/templates.md` has the same files as generic templates with placeholders.

Worked example used in steps 3–8: feature `OmPleietrengende`, backend `k9sak`, folder `fakta/om-pleietrengende/api/`, endpoint `behandlingPerson_getPersonopplysninger1` returning `PersonopplysningDto`.

Create `packages/v2/backend/src/k9sak/sdk/OmPleietrengendeSdk.ts`:

```typescript
export { behandlingPerson_getPersonopplysninger1 } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
```

### Step 4: Create Type Re-Exports

For each DTO type used in the API, create a re-export file, e.g. `packages/v2/backend/src/k9sak/kontrakt/person/PersonopplysningDto.ts`. See `references/templates.md` for the patterns (single type, const enum). Check if a re-export already exists before creating a duplicate.

### Step 5: Create BackendApiType

`packages/v2/gui/src/fakta/om-pleietrengende/api/OmPleietrengendeBackendApiType.ts`:

```typescript
import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface OmPleietrengendeBackendApiType extends BackendTilhørighet {
  hentPleietrengende(behandlingUuid: string): Promise<PersonopplysningDto | null>;
}
```

Rules:

- Extend `BackendTilhørighet` (`packages/v2/gui/src/utils/BackendTilhørighet.ts`). It declares `readonly backend`; the client sets the literal value, one of `k9sak`, `k9klage`, `k9tilbake`, `ungsak`, `ungtilbake`
- Single backend: use plain `extends BackendTilhørighet` (no type parameter)
- Multiple backends: narrow with the type parameter, e.g. `extends BackendTilhørighet<'k9tilbake' | 'ungtilbake'>`. This stops a client from implementing the interface with the wrong backend, and lets code that branches on `api.backend` narrow correctly
- Aggregating clients: if one client calls endpoints in several backends within the same product, e.g. historikk calling `k9sak`, `k9klage` and `k9tilbake`, use `extends BackendTilhørighet<SammenstiltBackendNavn>`. The value is then `'k9'` or `'ung'`. Only endpoint calls count; an import of a type or enum from another backend does not make a client aggregating, and neither does `k9formidling`
- Method names are descriptive (`hentPleietrengende`, not `behandlingPerson_getPersonopplysninger1`)
- GET endpoints return `Promise<Dto>`; mutating POST/PUT return `Promise<void>` unless they return data
- Use `import type` for all type imports

### Step 6: Create BackendClient

The client name starts with the full backend name: `K9Sak`, `K9Klage`, `K9Tilbake`, `UngSak` or `UngTilbake`, also when only one backend exists. If the component is shared between K9 and Ung, keep one BackendApiType and create one client per backend (e.g. `K9TilbakeFeilutbetalingFaktaBackendClient` and `UngTilbakeFeilutbetalingFaktaBackendClient`).

Aggregating clients, which call several backends within the same product, are named after the product: `K9` or `Ung`, e.g. `K9HistorikkBackendClient` (`readonly backend = 'k9'`) and `UngHistorikkBackendClient` (`readonly backend = 'ung'`). Current examples: historikk and avregning.

`packages/v2/gui/src/fakta/om-pleietrengende/api/K9SakOmPleietrengendeBackendClient.ts`:

```typescript
import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningDto.js';
import { behandlingPerson_getPersonopplysninger1 } from '@k9-sak-web/backend/k9sak/sdk/OmPleietrengendeSdk.js';
import type { OmPleietrengendeBackendApiType } from './OmPleietrengendeBackendApiType.js';

export class K9SakOmPleietrengendeBackendClient implements OmPleietrengendeBackendApiType {
  readonly backend = 'k9sak';

  async hentPleietrengende(behandlingUuid: string): Promise<PersonopplysningDto | null> {
    const response = await behandlingPerson_getPersonopplysninger1({ query: { behandlingUuid } });
    return response.data || null;
  }
}
```

Rules:

- `readonly backend = 'k9sak'` is a literal type and is used as the last element in `queryKey`, so the same feature against different backends gets separate cache entries
- Every SDK call is awaited; `.data` is returned for GET endpoints
- Parameters match the `query`/`body` shape of the SDK Options type

### Step 7: Create QueryOptions (if requested)

`packages/v2/gui/src/fakta/om-pleietrengende/api/omPleietrengendeQueryOptions.ts`:

```typescript
import { queryOptions } from '@tanstack/react-query';
import type { OmPleietrengendeBackendApiType } from './OmPleietrengendeBackendApiType.js';

export const omPleietrengendeQueryOptions = (api: OmPleietrengendeBackendApiType, behandlingUuid: string) =>
  queryOptions({
    queryKey: ['omPleietrengende', behandlingUuid, api.backend],
    queryFn: () => api.hentPleietrengende(behandlingUuid),
  });
```

Rules:

- Only for GET endpoints
- `queryKey` always ends with `api.backend`
- Include `behandling.versjon` in the key when the data changes with the behandling version
- For conditional queries, add an `enabled` parameter to the key and return `null` from `queryFn` when disabled

### Step 8: Create the API context

`packages/v2/gui/src/fakta/om-pleietrengende/api/OmPleietrengendeApiContext.ts`:

```typescript
import { createContext, useContext } from 'react';
import type { OmPleietrengendeBackendApiType } from './OmPleietrengendeBackendApiType.js';

export const OmPleietrengendeApiContext = createContext<OmPleietrengendeBackendApiType | null>(null);

export const useOmPleietrengendeApi = (): OmPleietrengendeBackendApiType => {
  const context = useContext(OmPleietrengendeApiContext);
  if (!context) {
    throw new Error('useOmPleietrengendeApi må brukes innenfor en OmPleietrengendeApiContext');
  }
  return context;
};
```

The production provider (`<OmPleietrengendeApiContext value={new K9SakOmPleietrengendeBackendClient()}>`) is added in `AppConfigResolver` (see the `v2-architecture` skill).

### Step 9: Verify

Run `yarn ts-check` to verify no type errors were introduced.
