import type { TotrinnskontrollApi } from '../TotrinnskontrollApi.ts';
import {
  totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext1,
  totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext1,
  noNavK9Klage_getKlageVurdering,
} from '@k9-sak-web/backend/k9klage/generated/sdk.js';
import type { k9_klage_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/k9klage/generated/types.js';

export class K9KlageTotrinnskontrollBackendClient implements TotrinnskontrollApi {
  async hentTotrinnskontrollSkjermlenkeContext(
    behandlingUuid: string,
  ): Promise<k9_klage_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto[]> {
    return (await totrinnskontroll_hentTotrinnskontrollSkjermlenkeContext1({ query: { behandlingUuid } })).data;
  }

  async hentTotrinnskontrollvurderingSkjermlenkeContext(
    behandlingUuid: string,
  ): Promise<k9_klage_kontrakt_vedtak_TotrinnskontrollSkjermlenkeContextDto[]> {
    return (await totrinnskontroll_hentTotrinnskontrollvurderingSkjermlenkeContext1({ query: { behandlingUuid } }))
      .data;
  }

  async hentTotrinnsKlageVurdering(behandlingUuid: string) {
    return (await noNavK9Klage_getKlageVurdering({ query: { behandlingUuid } })).data;
  }
}
