import {
  forhåndsvisKlageVedtaksbrev,
  getKlageVurdering,
} from '@k9-sak-web/backend/ungsak/sdk.js';
import type { VedtakKlageApi } from './VedtakKlageApi.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';

export default class UngVedtakKlageBackendClient implements VedtakKlageApi {
  readonly backend = 'ung';
  async forhåndsvisKlageVedtaksbrev(behandling: BehandlingDto) {
    if (behandling.id == null) {
      throw new Error(`Kan ikke forhåndsvise brev for behandling uten id.`);
    }
    return (await forhåndsvisKlageVedtaksbrev({ body: { behandlingId: behandling.id } })).data;
  }

  async getKlageVurdering(behandlingUuid: string) {
    return (await getKlageVurdering({ query: { behandlingUuid } })).data;
  }
}
