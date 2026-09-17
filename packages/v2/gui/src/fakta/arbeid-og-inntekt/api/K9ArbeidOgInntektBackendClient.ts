import { arbeidOgInntekt_hentArbeidOgInntekt } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { ArbeidOgInntektResponse } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidoginntekt/ArbeidOgInntektResponse.js';
import type { ArbeidOgInntektApi } from './ArbeidOgInntektApi.js';

export class K9ArbeidOgInntektBackendClient implements ArbeidOgInntektApi {
  async hentArbeidOgInntekt(behandlingUuid: string): Promise<ArbeidOgInntektResponse[]> {
    const response = await arbeidOgInntekt_hentArbeidOgInntekt({
      query: { behandlingUuid },
    });
    return response.data;
  }
}
