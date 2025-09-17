import type { TotrinnskontrollApi } from '../TotrinnskontrollApi.ts';
import {
  totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext,
  totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext,
} from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import {
  type K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted,
  mapToK9TilbakeTotrinnskontrollSkjermlenkeContextDtoAjusted,
} from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';

export class K9TilbakeTotrinnskontrollBackendClient implements TotrinnskontrollApi {
  async hentTotrinnskontrollSkjermlenkeContext(
    behandlingUuid: string,
  ): Promise<K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted[]> {
    const resp = await totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext({
      query: {
        uuid: {
          behandlingUuid,
          behandlingId: '',
        },
      },
    });
    return resp.data.map(mapToK9TilbakeTotrinnskontrollSkjermlenkeContextDtoAjusted);
  }

  async hentTotrinnskontrollvurderingSkjermlenkeContext(
    behandlingUuid: string,
  ): Promise<K9TilbakeTotrinnskontrollSkjermlenkeContextDtoAdjusted[]> {
    const resp = await totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext({
      query: {
        uuid: {
          behandlingUuid,
          behandlingId: '',
        },
      },
    });
    return resp.data.map(mapToK9TilbakeTotrinnskontrollSkjermlenkeContextDtoAjusted);
  }
}
