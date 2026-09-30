import type { RelatertYtelseResponse } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/RelatertYtelseResponse.js';
import { relaterteYtelser_getYtelser } from '@k9-sak-web/backend/k9sak/tjenester/behandling/arbeidsforhold/RelaterteYtelserApi.js';
import type { YtelserApi } from './YtelserApi.js';

export class K9SakYtelserBackendClient implements YtelserApi {
  readonly backend = 'k9sak';

  async hentYtelser(behandlingUuid: string): Promise<RelatertYtelseResponse[]> {
    const response = await relaterteYtelser_getYtelser({
      query: { behandlingUuid },
    });
    return response.data;
  }
}
