import type { ArbeidOgInntektResponse } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidoginntekt/ArbeidOgInntektResponse.js';

export interface ArbeidOgInntektApi {
  hentArbeidOgInntekt(behandlingUuid: string): Promise<ArbeidOgInntektResponse[]>;
}
