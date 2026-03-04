import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import {
  forhåndsvisKlageVedtaksbrev,
  getKlageVurdering,
  hentValgbareKlagehjemler,
  mellomlagreKlage,
} from '@k9-sak-web/backend/ungsak/sdk.js';
import type { MellomlagringDto as MellomlagringDataDto } from '@k9-sak-web/backend/ungsak/kontrakt/mellomlagring/MellomlagringDto.js';
import type { KlageVurderingApi } from './KlageVurderingApi.js';

export default class UngKlageVurderingBackendClient implements KlageVurderingApi {
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

  async mellomlagreKlage(data: MellomlagringDataDto) {
    await mellomlagreKlage({
      body: data,
    });
  }

  async hentValgbareKlagehjemlerForUng() {
    return (await hentValgbareKlagehjemler()).data;
  }
}
