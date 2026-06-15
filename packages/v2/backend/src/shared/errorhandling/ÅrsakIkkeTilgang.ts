import { k9_felles_sikkerhet_abac_ÅrsakIkkeTilgang as ÅIT1 } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { k9_felles_sikkerhet_abac_ÅrsakIkkeTilgang as ÅIT2 } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { k9_felles_sikkerhet_abac_ÅrsakIkkeTilgang as ÅIT3 } from '@k9-sak-web/backend/k9klage/generated/types.js';

import { safeConstCombine } from '@k9-sak-web/backend/typecheck/safeConstCombine.js';

export const ÅrsakIkkeTilgang = safeConstCombine(ÅIT1, ÅIT2, ÅIT3);

export type ÅrsakIkkeTilgang = ÅIT1 | ÅIT2 | ÅIT3;
