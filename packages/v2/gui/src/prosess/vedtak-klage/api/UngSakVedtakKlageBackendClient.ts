import {
  formidling_forhåndsvisKlageVedtaksbrev,
  noNavK9Klage_getKlageVurdering,
} from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import type { VedtakKlageApi } from './VedtakKlageApi.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export default class UngSakVedtakKlageBackendClient implements VedtakKlageApi {
  readonly backend = backendNavn.ungsak;
  async forhåndsvisKlageVedtaksbrev(behandling: BehandlingDto) {
    if (behandling.id == null) {
      throw new Error(`Kan ikke forhåndsvise brev for behandling uten id.`);
    }
    return (await formidling_forhåndsvisKlageVedtaksbrev({ body: { behandlingId: behandling.id } })).data;
  }

  async getKlageVurdering(behandlingUuid: string) {
    return (await noNavK9Klage_getKlageVurdering({ query: { behandlingUuid } })).data;
  }
}
