---
name: data-fetching
description: 'Fetching and changing backend data in v2 components with TanStack Query: queryOptions, query keys, staleTime/enabled, useSuspenseQuery vs useQuery, mutations, cache invalidation, Suspense and ErrorBoundary. USE FOR: adding or reviewing a query or mutation, choosing query keys, data that is stale after saving, loading and error states, a component fetching its own data instead of receiving props. DO NOT USE FOR: creating or changing the BackendClient, BackendApiType or ApiContext (use backend-client).'
---

# Data fetching

Components fetch backend data with TanStack Query through the client from the feature's API context (see the `backend-client` skill). Never use the old `rest-api` / `useRestApi` hooks or call a raw URL.

## queryOptions

Define each GET query as a named `queryOptions()` export in the feature's `api/` folder, e.g. `packages/v2/gui/src/fakta/om-pleietrengende/api/omPleietrengendeQueryOptions.ts`:

```typescript
import { queryOptions } from '@tanstack/react-query';
import type { OmPleietrengendeBackendApiType } from './OmPleietrengendeBackendApiType.js';

export const omPleietrengendeQueryOptions = (api: OmPleietrengendeBackendApiType, behandlingUuid: string) =>
  queryOptions({
    queryKey: ['omPleietrengende', behandlingUuid, api.backend],
    queryFn: () => api.hentPleietrengende(behandlingUuid),
  });
```

### Query keys

- Include every parameter that identifies the data, typically `behandlingUuid`, so data from different behandlinger is never mixed
- Include `behandlingVersjon` when the data changes with the behandling version
- End with `api.backend`, so the same feature against different backends gets separate cache entries
- For a conditional query, take an `enabled` parameter, put it in the key and pass it to `queryOptions`

## In the component

When the component is the only consumer of an endpoint, it fetches the data itself instead of receiving it as a prop:

```typescript
const api = useOmPleietrengendeApi();
const { data } = useSuspenseQuery(omPleietrengendeQueryOptions(api, behandlingUuid));
```

- Prefer `useSuspenseQuery`. A `<Suspense>` boundary must wrap the component, otherwise React crashes, and an `<ErrorBoundary>` must catch errors, so the saksbehandler always gets feedback on loading and errors
- Use `useQuery` only when the component must render `isLoading`/`isError` itself
- In v1 shells, the boundary goes in the behandling `*Fakta.tsx`; see the `v2-migration` skill

## Mutations

Use `useMutation` and call the client method. After a mutation that makes cached data stale, invalidate the affected query keys in `onSuccess`, and refetch the behandling when the save changes it.

## Reference implementations

All paths are under `packages/v2/gui/src/`.

| Variant | Read |
| --- | --- |
| Simple query used with `useSuspenseQuery` | `fakta/om-pleietrengende/api/omPleietrengendeQueryOptions.ts` |
| `behandlingVersjon` in the query key | `fakta/om-barnet/api/omBarnetQueryOptions.ts` |
| Several queries, `staleTime`, `refetchOnMount` and `enabled` | `prosess/uttak/api/uttakQueryOptions.ts` |
| Mutation that invalidates a query and refetches the behandling | `useReaktiverAksjonspunktNyInntekt` in `fakta/ny-inntekt/api/NyInntektQueries.ts` |
