import {
  formidling_forhåndsvisKlageVedtaksbrev,
  noNavK9Klage_getKlageVurdering,
} from '@k9-sak-web/backend/ungsak/generated/sdk.js';

export default class VedtakKlageBackendClient {
  async forhåndsvisKlageVedtaksbrev(behandlingId: number) {
    return (await formidling_forhåndsvisKlageVedtaksbrev({ body: { behandlingId } })).data;
  }

  async getKlageVurdering(behandlingUuid: string) {
    return (await noNavK9Klage_getKlageVurdering({ query: { behandlingUuid } })).data;
  }
}
