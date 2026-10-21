---
name: kodeverk
description: 'Using kodeverk in v2 code: generated kodeverk constants and type-safe lookups of names through K9KodeverkoppslagContext or UngKodeverkoppslagContext. USE FOR: showing kodeverk names, comparing domain codes, replacing alleKodeverk/kodeverk props, useKodeverkContext or KodeverkType. DO NOT USE FOR: creating re-exports of generated kodeverk enums (use backend-types) or converting legacy kodeverk objects at the v1 shell boundary (use v2-migration).'
---

# v2 Kodeverk

## Domain codes — use generated constants

Never hardcode string literals for domain codes. Import the generated constant from the stable re-export (see the `backend-types` skill):

```typescript
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
```

## Names — use the kodeverkoppslag context

Kodeverk data is provided high up in the tree:

- k9: `K9KodeverkoppslagContext` from `@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.js`, with `k9sak`, `k9klage` and `k9tilbake`
- ung: `UngKodeverkoppslagContext` from `@k9-sak-web/gui/kodeverk/oppslag/UngKodeverkoppslagContext.js`, with `ungSak` and `ungTilbake`

```typescript
import { useContext } from 'react';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.js';
import { OrUndefined } from '@k9-sak-web/gui/kodeverk/oppslag/GeneriskKodeverkoppslag.js';

const kodeverkoppslag = useContext(K9KodeverkoppslagContext);

// Kaster feil hvis koden ikke finnes. Parameteren er en union av gyldige koder.
const årsak = kodeverkoppslag.k9sak.utenlandsoppholdÅrsaker('INGEN');

// Returnerer undefined hvis koden ikke finnes
const kanskjeÅrsak = kodeverkoppslag.k9sak.utenlandsoppholdÅrsaker(kode, OrUndefined);
```

There is one method per kodeverk, e.g. `behandlingTyper()`, `fagsakYtelseTyper()`, `avslagsårsaker()`.

## Never

- Accept `alleKodeverk` or a `kodeverk` object as a prop in a v2 component
- Use `useKodeverkContext()` or `KodeverkType` from `@k9-sak-web/lib/kodeverk/types.js`. They are untyped and being phased out
