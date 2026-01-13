import { kompletthet_utledStatusForKompletthet } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { k9_sak_kontrakt_kompletthet_KompletthetsVurderingDto as KompletthetsVurdering } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { InntektsmeldingApi } from './InntektsmeldingApi.ts';

export class K9InntektsmeldingBackendClient implements InntektsmeldingApi {
  async hentKompletthetsoversikt(behandlingUuid: string): Promise<KompletthetsVurdering> {
    const response = await kompletthet_utledStatusForKompletthet({
      query: { behandlingUuid },
    });
    return response.data;
  }
}
