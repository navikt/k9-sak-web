import type { TotrinnskontrollApi } from '../TotrinnskontrollApi.ts';
import {
  totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext,
  totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext,
} from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { k9_sak_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

export class K9SakTotrinnskontrollBackendClient implements TotrinnskontrollApi {
  async hentTotrinnskontrollSkjermlenkeContext(
    behandlingUuid: string,
  ): Promise<k9_sak_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto[]> {
    return (await totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext({ query: { behandlingUuid } })).data;
  }

  async hentTotrinnskontrollvurderingSkjermlenkeContext(
    behandlingUuid: string,
  ): Promise<k9_sak_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto[]> {
    return (await totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext({ query: { behandlingUuid } })).data;
  }
}
