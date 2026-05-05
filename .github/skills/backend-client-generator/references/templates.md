# File Templates

Complete templates for each generated file.

## 1. SDK Re-Export (`<Domain>Sdk.ts`)

Path: `packages/v2/backend/src/<backend>/sdk/<Domain>Sdk.ts`

```typescript
export {
  <sdkFunction1>,
  <sdkFunction2>,
} from '@k9-sak-web/backend/<backend>/generated/sdk.js';
```

## 2. Type Re-Export (per type)

Path: `packages/v2/backend/src/<backend>/kontrakt/<domain>/<TypeName>.ts`

### For DTO types:
```typescript
export type { <namespace_TypeName> as <TypeName> } from '@k9-sak-web/backend/<backend>/generated/types.js';
```

### For enums (const + type):
```typescript
export { <namespace_EnumName> as <EnumName> } from '@k9-sak-web/backend/<backend>/generated/types.js';
```

## 3. BackendApiType (`<Domain>BackendApiType.ts`)

Path: `packages/v2/gui/src/<target>/<Domain>BackendApiType.ts`

```typescript
import type { <Type1> } from '@k9-sak-web/backend/<backend>/kontrakt/<domain>/<Type1>.js';
import type { <Type2> } from '@k9-sak-web/backend/<backend>/kontrakt/<domain>/<Type2>.js';

export type <Domain>BackendApiType = {
  backend: string;
  <getMethod>(behandlingUuid: string): Promise<<ResponseDto>>;
  <postMethod>(behandlingUuid: string, behandlingVersjon: number, body: <RequestDto>): Promise<void>;
};
```

## 4. BackendClient (`<Domain>BackendClient.ts`)

Path: `packages/v2/gui/src/<target>/<Domain>BackendClient.ts`

```typescript
import type { <RequestDto> } from '@k9-sak-web/backend/<backend>/kontrakt/<domain>/<RequestDto>.js';
import {
  <sdkFunction1>,
  <sdkFunction2>,
} from '@k9-sak-web/backend/<backend>/sdk/<Domain>Sdk.js';
import { type <Domain>BackendApiType } from './<Domain>BackendApiType.js';

export class <Domain>BackendClient implements <Domain>BackendApiType {
  readonly backend = '<backend>';

  async <getMethod>(behandlingUuid: string) {
    return (await <sdkFunction1>({ query: { behandlingUuid } })).data;
  }

  async <postMethod>(behandlingUuid: string, behandlingVersjon: number, body: <RequestDto>) {
    await <sdkFunction2>({
      body: { ...body, behandlingUuid, behandlingVersjon },
    });
  }
}
```

## 5. QueryOptions (`<domain>QueryOptions.ts`)

Path: `packages/v2/gui/src/<target>/<domain>QueryOptions.ts`

```typescript
import { queryOptions } from '@tanstack/react-query';
import type { <Domain>BackendApiType } from './<Domain>BackendApiType.js';

interface Behandling {
  uuid: string;
  versjon: number;
}

export const <resourceName>QueryOptions = (api: <Domain>BackendApiType, behandling: Behandling) =>
  queryOptions({
    queryKey: ['<resource-name>', behandling.uuid, behandling.versjon, api.backend],
    queryFn: () => api.<getMethod>(behandling.uuid),
  });
```

### With optional enabled parameter:
```typescript
export const <resourceName>QueryOptions = (
  api: <Domain>BackendApiType,
  behandling: Behandling,
  enabled = true,
) =>
  queryOptions({
    queryKey: ['<resource-name>', behandling.uuid, behandling.versjon, enabled, api.backend],
    queryFn: () => (enabled ? api.<getMethod>(behandling.uuid) : null),
  });
```

## Namespace Prefix Mapping

When creating type re-exports, strip the namespace prefix:

| Backend | Namespace prefix pattern | Example |
|---------|-------------------------|---------|
| `ungsak` | `ung_sak_kontrakt_<domain>_` | `ung_sak_kontrakt_kontroll_KontrollerInntektDto` → `KontrollerInntektDto` |
| `k9sak` | `k9_sak_kontrakt_<domain>_` | `k9_sak_kontrakt_uttak_UtenlandsoppholdDto` → `UtenlandsoppholdDto` |
| `k9klage` | `k9_klage_kontrakt_<domain>_` | `k9_klage_kontrakt_klage_KlageVurderingDto` → `KlageVurderingDto` |
| `k9tilbake` | `k9_tilbake_kontrakt_<domain>_` | `k9_tilbake_kontrakt_vedtak_VedtakDto` → `VedtakDto` |

## SDK Function Parameter Patterns

SDK functions accept an options object. Map parameters based on HTTP method:

### GET endpoints:
```typescript
// SDK signature:
export const foo_bar = (options: Options<FooBarData, ThrowOnError>) => ...

// FooBarData in types.gen.ts:
type FooBarData = { query: { behandlingUuid: string } }

// BackendClient method:
async bar(behandlingUuid: string) {
  return (await foo_bar({ query: { behandlingUuid } })).data;
}
```

### POST endpoints:
```typescript
// SDK signature:
export const foo_create = (options: Options<FooCreateData, ThrowOnError>) => ...

// FooCreateData in types.gen.ts:
type FooCreateData = { body: CreateDto }

// BackendClient method:
async create(dto: CreateDto) {
  await foo_create({ body: dto });
}
```

### POST with query + body:
```typescript
// BackendClient method:
async save(behandlingUuid: string, behandlingVersjon: number, dto: SaveDto) {
  await foo_save({
    body: { behandlingId: behandlingUuid, behandlingVersjon, ...dto },
  });
}
```
