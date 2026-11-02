import type { ArbeidOgInntektResponse } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidoginntekt/ArbeidOgInntektResponse.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface ArbeidOgInntektApi extends BackendTilhørighet {
  hentArbeidOgInntekt(behandlingUuid: string): Promise<ArbeidOgInntektResponse[]>;
}
