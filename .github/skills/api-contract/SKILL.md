---
name: api-contract
description: 'Create and use the API contract for a v2 component: SDK re-export, BackendApiType, BackendClient, QueryOptions, API context, AppConfigResolver provider and useSuspenseQuery in the component, based on OpenAPI-generated SDK endpoints. USE FOR: creating new BackendClient classes that wrap SDK calls, defining typed API contracts, generating TanStack Query options and query keys, wiring the API context, fetching data in a v2 component, handling 404 in the client. DO NOT USE FOR: modifying existing BackendClients, DTO/kodeverk re-exports (use backend-types skill), general v2 architecture questions (use v2-architecture skill), or component UI and stories (use storybook skill).'
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

See the mapping table in the `backend-types` skill (`.github/skills/backend-types/SKILL.md`).

## Workflow

### Step 1: Read the SDK

Find the generated SDK file for the chosen backend:

```
node_modules/<client-package>/src/sdk.gen.ts
```

Where `<client-package>` is the full package name from the mapping table (e.g., `@navikt/ung-sak-typescript-client`).

Read the function signatures for each requested endpoint. Note:

- The HTTP method (GET/POST/PUT/DELETE)
- The `Options<XxxData, ThrowOnError>` parameter type
- The response type (e.g. `XxxResponses`)

### Step 2: Read the Types

In `node_modules/<client-package>/src/types.gen.ts`, find:

- The `XxxData` type — contains `query` and/or `body` fields showing the request shape
- The response type — the actual DTO returned

Where `<client-package>` is the full package name from the mapping table (e.g., `@navikt/ung-sak-typescript-client`).

Extract the DTO type names needed for the BackendApiType.

### Step 3: Create SDK Re-Export

Steps 3–10 follow the real implementation in `packages/v2/gui/src/fakta/om-pleietrengende/api/`: feature `OmPleietrengende`, backend `k9sak`, endpoint `behandlingPerson_getPersonopplysninger1` returning `PersonopplysningPleietrengendeDto`. For other variants, see [Reference implementations](#reference-implementations).

Create `packages/v2/backend/src/k9sak/sdk/OmPleietrengendeSdk.ts`:

```typescript
export { behandlingPerson_getPersonopplysninger1 } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
```

### Step 4: Create Type Re-Exports

Create a stable re-export for each DTO and kodeverk enum used in the API, e.g. `packages/v2/backend/src/k9sak/kontrakt/person/PersonopplysningPleietrengendeDto.ts`. Follow the `backend-types` skill (`.github/skills/backend-types/SKILL.md`) for location, naming and export syntax.

### Step 5: Create BackendApiType

`packages/v2/gui/src/fakta/om-pleietrengende/api/OmPleietrengendeBackendApiType.ts`:

```typescript
import type { PersonopplysningPleietrengendeDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningPleietrengendeDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface OmPleietrengendeBackendApiType extends BackendTilhørighet {
  hentPleietrengende(behandlingUuid: string): Promise<PersonopplysningPleietrengendeDto | null>;
}
```

Rules:

- Extend `BackendTilhørighet` (`packages/v2/gui/src/utils/BackendTilhørighet.ts`). It declares `readonly backend`; the client sets the literal value, one of `k9sak`, `k9klage`, `k9tilbake`, `ungsak`, `ungtilbake`
- Method names are descriptive (`hentPleietrengende`, not `behandlingPerson_getPersonopplysninger1`)
- GET endpoints return `Promise<Dto>`; mutating POST/PUT return `Promise<void>` unless they return data
- Use `import type` for all type imports

### Step 6: Create BackendClient

The client name starts with the full backend name: `K9Sak`, `K9Klage`, `K9Tilbake`, `UngSak` or `UngTilbake`, also when only one backend exists. If the component is shared between K9 and Ung, keep one BackendApiType and create one client per backend (e.g. `K9SakHistorikkBackendClient` and `UngSakHistorikkBackendClient`).

`packages/v2/gui/src/fakta/om-pleietrengende/api/K9SakOmPleietrengendeBackendClient.ts`:

```typescript
import type { PersonopplysningPleietrengendeDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningPleietrengendeDto.js';
import { behandlingPerson_getPersonopplysninger1 } from '@k9-sak-web/backend/k9sak/sdk/OmPleietrengendeSdk.js';
import type { OmPleietrengendeBackendApiType } from './OmPleietrengendeBackendApiType.js';

export class K9SakOmPleietrengendeBackendClient implements OmPleietrengendeBackendApiType {
  readonly backend = 'k9sak';

  async hentPleietrengende(behandlingUuid: string): Promise<PersonopplysningPleietrengendeDto | null> {
    const response = await behandlingPerson_getPersonopplysninger1({ query: { behandlingUuid } });
    return response.data || null;
  }
}
```

Rules:

- `readonly backend = 'k9sak'` is a literal type and is used as the last element in `queryKey`, so the same feature against different backends gets separate cache entries
- Every SDK call is awaited; `.data` is returned for GET endpoints
- Parameters match the `query`/`body` shape of the SDK Options type
- When a 404 is an expected response, handle it in the client and return `null` (add `| null` to the return type in the BackendApiType). Rethrow all other errors. Do not use `throwOnError: ignore404Errors` in the queryOptions:

```typescript
try {
  return (await sdkFunction({ query: { behandlingUuid } })).data;
} catch (error) {
  const apiError = ExtendedApiError.findInError(error);
  if (apiError?.isNotFound) {
    return null;
  }
  throw error;
}
```

`ExtendedApiError` is imported from `@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js`.

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
- `queryKey` contains every parameter that identifies the data, typically `behandlingUuid`, and always ends with `api.backend`
- Include `behandling.versjon` in the key when the data changes with the behandling version
- For conditional queries, add an `enabled` parameter to the key and return `null` from `queryFn` when disabled
- After a mutation that makes cached data stale, invalidate the affected query keys

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

### Step 9: Register the production provider

Add the provider in each `AppConfigResolver.tsx` where the feature is used, next to the existing nested providers:

- k9: `packages/sak-app/src/app/AppConfigResolver.tsx`
- ung: `packages/ung/sak-app/app/AppConfigResolver.tsx`

```tsx
<OmPleietrengendeApiContext value={new K9SakOmPleietrengendeBackendClient()}>{children}</OmPleietrengendeApiContext>
```

### Step 10: Use the contract in the component

When the component is the only consumer of an endpoint, it fetches the data itself instead of receiving it as a prop:

```typescript
const api = useOmPleietrengendeApi();
const { data } = useSuspenseQuery(omPleietrengendeQueryOptions(api, behandlingUuid));
```

- Prefer `useSuspenseQuery`. The caller must provide `<Suspense>` and `<ErrorBoundary>`, so loading and errors give the saksbehandler feedback
- Use `useQuery` only when the component must render `isLoading`/`isError` itself
- Never use the old `rest-api` / `useRestApi` hooks, call a raw URL, or import SDK functions or a BackendClient directly in a component; get the client from the API context

### Step 11: Verify

Run `yarn ts-check` to verify no type errors were introduced.

## Reference implementations

Read the closest existing implementation before writing a new one. All paths are under `packages/v2/gui/src/`.

| Variant | Read |
| --- | --- |
| One GET, response may be empty | `fakta/om-pleietrengende/api/` |
| Several GET and POST methods, `query` and `body` parameters | `prosess/uttak/api/K9SakUttakBackendClient.ts` and `UttakBackendApiType.ts` |
| Expected 404 returns `null` | `hentUttak` and `hentAktuelleAktiviteter` in `prosess/uttak/api/K9SakUttakBackendClient.ts` |
| 204 without content returns `null` | `fakta/om-barnet/api/K9SakOmBarnetBackendClient.ts` |
| `behandlingVersjon` in the query key | `fakta/om-barnet/api/omBarnetQueryOptions.ts` |
| Several queryOptions, conditional query with `enabled` | `prosess/uttak/api/uttakQueryOptions.ts` |
| Invalidate the cache after a mutation | `useReaktiverAksjonspunktNyInntekt` in `fakta/ny-inntekt/api/NyInntektQueries.ts` |
| Fake API in stories | `storybook/decorators/withFakeOmBarnetApi.tsx` |

Some older API folders, such as `sak/historikk/api/`, `prosess/klagevurdering/api/` and `fakta/feilutbetaling/api/`, use older names (`*Api`, `K9…`/`Ung…`). Do not copy those names into new code.
