import { arbeidOgInntekt_hentArbeidOgInntekt } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { ArbeidOgInntektResponse } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidoginntekt/ArbeidOgInntektResponse.js';
import type { ArbeidOgInntektApi } from './ArbeidOgInntektApi.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export class K9SakArbeidOgInntektBackendClient implements ArbeidOgInntektApi {
  readonly backend = backendNavn.k9sak;

  async hentArbeidOgInntekt(behandlingUuid: string): Promise<ArbeidOgInntektResponse[]> {
    const response = await arbeidOgInntekt_hentArbeidOgInntekt({
      query: { behandlingUuid },
    });
    return response.data;
  }
}
