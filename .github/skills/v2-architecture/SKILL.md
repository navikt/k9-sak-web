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

### Using generated types
Types are generated from OpenAPI specs. Names use the full package path with underscores as separator:

```typescript
import type {
  k9_sak_kontrakt_behandling_BehandlingDto,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
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
