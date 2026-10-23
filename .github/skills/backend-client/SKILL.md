---
name: backend-client
description: 'Create or change the backend client layer for a v2 feature: SDK re-export, BackendApiType, BackendClient, 404/204 handling, API context and the provider in AppConfigResolver, based on OpenAPI-generated SDK endpoints. USE FOR: new or changed BackendClient classes and methods, BackendApiType interfaces, wrapping SDK calls, expected empty responses, ignore404Errors, wiring an ApiContext. DO NOT USE FOR: queryOptions, query keys, mutations or useSuspenseQuery in components (use data-fetching), or DTO/kodeverk re-exports (use generated-types).'
---

# Backend client

Each v2 feature talks to the backend through a typed client that is injected via React context. This skill covers the client layer. When it is done, fetch data in the component with the `data-fetching` skill.

The steps follow the real implementation in `packages/v2/gui/src/fakta/om-pleietrengende/api/`: feature `OmPleietrengende`, backend `k9sak`, endpoint `behandlingPerson_getPersonopplysninger1` returning `PersonopplysningPleietrengendeDto`. For other variants, see [Reference implementations](#reference-implementations).

## Required input

Ask the user for:

1. **SDK endpoints**: function names from the generated `sdk.gen.ts` (e.g. `kontroll_hentKontrollerInntekt`)
2. **Domain name**: PascalCase feature name (e.g. `AktivitetspengerBeregning`)
3. **Backend**: `ungsak`, `k9sak`, `k9klage`, `k9tilbake` or `ungtilbake`
4. **Target folder**: path under `packages/v2/gui/src/` (e.g. `prosess/aktivitetspenger-beregning/`)

## 1. Read the SDK and types

Find the client package for the backend in the `generated-types` skill. In `node_modules/<client-package>/src/sdk.gen.ts`, note for each endpoint:

- The HTTP method
- The `Options<XxxData, ThrowOnError>` parameter type
- The response type (e.g. `XxxResponses`)

In `types.gen.ts`, find `XxxData` (the `query` and/or `body` shape) and the returned DTO.

## 2. Re-export SDK functions and types

`packages/v2/backend/src/k9sak/sdk/OmPleietrengendeSdk.ts`:

```typescript
export { behandlingPerson_getPersonopplysninger1 } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
```

Re-export each DTO and kodeverk enum as described in the `generated-types` skill.

## 3. BackendApiType

`packages/v2/gui/src/fakta/om-pleietrengende/api/OmPleietrengendeBackendApiType.ts`:

```typescript
import type { PersonopplysningPleietrengendeDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningPleietrengendeDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface OmPleietrengendeBackendApiType extends BackendTilhørighet {
  hentPleietrengende(behandlingUuid: string): Promise<PersonopplysningPleietrengendeDto | null>;
}
```

- Extend `BackendTilhørighet`. It declares `readonly backend`; the client sets the literal value
- Use descriptive method names (`hentPleietrengende`, not `behandlingPerson_getPersonopplysninger1`)
- GET methods return `Promise<Dto>`; POST/PUT return `Promise<void>` unless they return data

## 4. BackendClient

Name the client after the backend: `K9Sak…`, `K9Klage…`, `K9Tilbake…`, `UngSak…` or `UngTilbake…`, also when only one backend exists. If the feature is shared between k9 and ung, keep one BackendApiType and create one client per backend.

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

- `readonly backend` is a literal type. `data-fetching` uses it in query keys so each backend gets its own cache entries
- Await every SDK call and return `.data` from GET methods
- Match parameters to the `query`/`body` shape of the SDK Options type

### Expected empty responses

When 404 is an expected response, handle it in the client and return `null` (with `| null` in the BackendApiType). Rethrow all other errors:

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

`ExtendedApiError` is in `@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js`. Do not use `throwOnError: ignore404Errors` in queries instead.

## 5. API context

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

Components get the client from the context, never by importing the client or SDK functions directly.

## 6. Production provider

Add the provider in each `AppConfigResolver.tsx` where the feature is used, next to the existing providers:

- k9: `packages/sak-app/src/app/AppConfigResolver.tsx`
- ung: `packages/ung/sak-app/app/AppConfigResolver.tsx`

```tsx
<OmPleietrengendeApiContext value={new K9SakOmPleietrengendeBackendClient()}>{children}</OmPleietrengendeApiContext>
```

In stories, provide a fake client instead; see the `storybook` skill.

## 7. Verify

Run `yarn ts-check`.

## Reference implementations

All paths are under `packages/v2/gui/src/`.

| Variant | Read |
| --- | --- |
| One GET, response may be empty | `fakta/om-pleietrengende/api/` |
| Several GET and POST methods, `query` and `body` parameters | `prosess/uttak/api/K9SakUttakBackendClient.ts` and `UttakBackendApiType.ts` |
| Expected 404 returns `null` | `hentUttak` and `hentAktuelleAktiviteter` in `prosess/uttak/api/K9SakUttakBackendClient.ts` |
| 204 without content returns `null` | `fakta/om-barnet/api/K9SakOmBarnetBackendClient.ts` |

Some older API folders, such as `sak/historikk/api/`, `prosess/klagevurdering/api/` and `fakta/feilutbetaling/api/`, use older names (`*Api`, `K9…`/`Ung…`). Do not copy those names into new code.
