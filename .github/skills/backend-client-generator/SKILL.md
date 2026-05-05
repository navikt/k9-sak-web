---
name: backend-client-generator
description: 'Generate BackendClient, BackendApiType, QueryOptions, and SDK re-export files from OpenAPI-generated SDK endpoints. USE FOR: creating new BackendClient classes that wrap SDK calls, defining typed API contracts, generating TanStack Query options, and setting up SDK re-exports. DO NOT USE FOR: modifying existing BackendClients, general v2 architecture questions (use v2-architecture skill), or writing React components.'
---

# BackendClient Generator

Generate a complete set of typed API client files from OpenAPI-generated SDK endpoints in `@navikt/*-typescript-client` packages.

## Required Input

Ask the user for:

1. **SDK endpoints** — function names from the generated `sdk.gen.ts` (e.g. `kontroll_hentKontrollerInntekt`)
2. **Domain name** — PascalCase name for the feature (e.g. `AktivitetspengerBeregning`)
3. **Backend** — one of: `ungsak`, `k9sak`, `k9klage`, `k9tilbake`
4. **Target folder** — relative path in `packages/v2/gui/src/` (e.g. `prosess/aktivitetspenger-beregning/`)
5. **QueryOptions** — whether to generate a queryOptions file (default: no)

## Backend → Client Package Mapping

| Backend | Client package | Import prefix |
|---------|---------------|---------------|
| `ungsak` | `@navikt/ung-sak-typescript-client` | `@k9-sak-web/backend/ungsak/` |
| `k9sak` | `@navikt/k9-sak-typescript-client` | `@k9-sak-web/backend/k9sak/` |
| `k9klage` | `@navikt/k9-klage-typescript-client` | `@k9-sak-web/backend/k9klage/` |
| `k9tilbake` | `@navikt/k9-tilbake-typescript-client` | `@k9-sak-web/backend/k9tilbake/` |

## Workflow

### Step 1: Read the SDK

Find the generated SDK file for the chosen backend:

```
node_modules/@navikt/<backend>-typescript-client/src/sdk.gen.ts
```

Read the function signatures for each requested endpoint. Note:
- The HTTP method (GET/POST/PUT/DELETE)
- The `Options<XxxData, ThrowOnError>` parameter type
- The response type (e.g. `XxxResponses`)

### Step 2: Read the Types

In `node_modules/@navikt/<backend>-typescript-client/src/types.gen.ts`, find:
- The `XxxData` type — contains `query` and/or `body` fields showing the request shape
- The response type — the actual DTO returned

Extract the DTO type names needed for the BackendApiType.

### Step 3: Create SDK Re-Export

Create or update `packages/v2/backend/src/<backend>/sdk/<Domain>Sdk.ts`:

```typescript
export {
  <endpoint1>,
  <endpoint2>,
} from '@k9-sak-web/backend/<backend>/generated/sdk.js';
```

### Step 4: Create Type Re-Exports

For each DTO type used in the API, create a re-export file at:
`packages/v2/backend/src/<backend>/kontrakt/<domain>/<TypeName>.ts`

Pattern A — single type re-export with alias:
```typescript
export type { <namespace_prefix_TypeName> as <TypeName> } from '@k9-sak-web/backend/<backend>/generated/types.js';
```

Pattern B — const enum + type (for string union enums):
```typescript
export { <namespace_prefix_EnumName> as <EnumName> } from '@k9-sak-web/backend/<backend>/generated/types.js';
```

Check if re-exports already exist before creating duplicates.

### Step 5: Create BackendApiType

Create `packages/v2/gui/src/<target>/<Domain>BackendApiType.ts`:

```typescript
import type { <Type1> } from '@k9-sak-web/backend/<backend>/kontrakt/<domain>/<Type1>.js';
import type { <Type2> } from '@k9-sak-web/backend/<backend>/kontrakt/<domain>/<Type2>.js';

export type <Domain>BackendApiType = {
  backend: string;
  <methodName>(param1: string): Promise<<ReturnType>>;
  <methodName2>(param1: string, param2: number): Promise<void>;
};
```

Rules:
- Include `backend: string` as first field
- Method names should be descriptive (e.g. `getKontrollerInntekt`, not `kontroll_hentKontrollerInntekt`)
- GET endpoints return `Promise<DtoType>`
- POST/PUT endpoints that mutate return `Promise<void>` (unless they return data)
- Use `import type` for all type imports

### Step 6: Create BackendClient

Create `packages/v2/gui/src/<target>/<Domain>BackendClient.ts`:

```typescript
import type { <RequestType> } from '@k9-sak-web/backend/<backend>/kontrakt/<domain>/<RequestType>.js';
import {
  <sdkFunction1>,
  <sdkFunction2>,
} from '@k9-sak-web/backend/<backend>/sdk/<Domain>Sdk.js';
import { type <Domain>BackendApiType } from './<Domain>BackendApiType.js';

export class <Domain>BackendClient implements <Domain>BackendApiType {
  readonly backend = '<backend>';

  async <methodName>(param1: string) {
    return (await <sdkFunction1>({ query: { param1 } })).data;
  }

  async <methodName2>(param1: string, param2: number, body: <RequestType>) {
    await <sdkFunction2>({ body: { ...body, param1, param2 } });
  }
}
```

Rules:
- `readonly backend = '<backend>'` — literal string type
- Every SDK call is awaited and `.data` is extracted for GET endpoints
- POST/PUT calls may not return `.data` if response is void
- Parameters match the `query`/`body` shape from the SDK Options type
- Import the BackendApiType with `{ type <Domain>BackendApiType }` (inline type import)

### Step 7: Create QueryOptions (if requested)

Create `packages/v2/gui/src/<target>/<domain>QueryOptions.ts`:

```typescript
import { queryOptions } from '@tanstack/react-query';
import type { <Domain>BackendApiType } from './<Domain>BackendApiType.js';

interface Behandling {
  uuid: string;
  versjon: number;
}

export const <queryName>QueryOptions = (api: <Domain>BackendApiType, behandling: Behandling) =>
  queryOptions({
    queryKey: ['<resource-name>', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.<methodName>(behandling.uuid),
  });
```

Rules:
- Only create queryOptions for GET endpoints
- `queryKey` always includes `api.backend` as last element
- `queryKey` includes `behandling.uuid` and `behandling.versjon` for cache busting
- For optional/conditional queries, add `enabled` parameter:
  ```typescript
  export const xQueryOptions = (api: ApiType, behandling: Behandling, enabled = true) =>
    queryOptions({
      queryKey: ['x', behandling.uuid, behandling.versjon, enabled, api.backend],
      queryFn: () => (enabled ? api.getX(behandling.uuid) : null),
    });
  ```

### Step 8: Verify

Run `yarn ts-check` to verify no type errors were introduced.
