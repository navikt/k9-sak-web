import type { FormidlingClient } from '@k9-sak-web/backend/k9formidling/client/FormidlingClient.js';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import {
  noNavK9Klage_getKlageVurdering,
  parter_hentAlleParterMedKlagerett,
} from '@k9-sak-web/backend/k9klage/generated/sdk.js';
import type { VedtakKlageApi } from './VedtakKlageApi';

export default class K9KlageVedtakKlageBackendClient implements VedtakKlageApi {
  readonly backend = 'k9klage';

  #formidling: FormidlingClient;

  constructor(formidlingClient: FormidlingClient) {
    this.#formidling = formidlingClient;
  }

  async forhåndsvisKlageVedtaksbrev(_behandlingId: number, data: ForhåndsvisDto): Promise<Blob> {
    return this.#formidling.forhåndsvisning.lagPdf(data);
  }

  async hentAlleParterMedKlagerett(behandlingUuid: string) {
    return (await parter_hentAlleParterMedKlagerett({ query: { behandlingUuid } })).data;
  }

  async getKlageVurdering(behandlingUuid: string) {
    return (await noNavK9Klage_getKlageVurdering({ query: { behandlingUuid } })).data;
  }
}
