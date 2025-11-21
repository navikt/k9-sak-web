import {
  formidling_forhåndsvisKlageVedtaksbrev,
  noNavK9Klage_getKlageVurdering,
  noNavK9Klage_hentValgbareKlagehjemler,
  noNavK9Klage_mellomlagreKlage,
} from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import type { ung_sak_web_app_tjenester_klage_KlageRestTjeneste_AbacKlageVurderingResultatAksjonspunktMellomlagringDto as MellomlagringDataDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { KlageVurderingApi } from './KlageVurderingApi.js';

export default class UngKlageVurderingBackendClient implements KlageVurderingApi {
  readonly backend = 'ung';

  async forhåndsvisKlageVedtaksbrev(behandlingId: number) {
    return (await formidling_forhåndsvisKlageVedtaksbrev({ body: { behandlingId } })).data;
  }

  async getKlageVurdering(behandlingUuid: string) {
    return (await noNavK9Klage_getKlageVurdering({ query: { behandlingUuid } })).data;
  }

  async mellomlagreKlage(data: MellomlagringDataDto) {
    await noNavK9Klage_mellomlagreKlage({
      body: data,
    });
  }

  async hentValgbareKlagehjemlerForUng() {
    return (await noNavK9Klage_hentValgbareKlagehjemler()).data;
  }
}
