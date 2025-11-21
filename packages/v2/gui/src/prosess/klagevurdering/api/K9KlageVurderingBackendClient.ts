import {
  noNavK9Klage_getKlageVurdering,
  noNavK9Klage_mellomlagreKlage,
} from '@k9-sak-web/backend/k9klage/generated/sdk.js';
import type { MellomlagringDto } from '@k9-sak-web/backend/k9klage/kontrakt/mellomlagring/MellomlagringDto.js';
import type { KlageVurderingApi } from './KlageVurderingApi.js';

export default class K9KlageVurderingBackendClient implements KlageVurderingApi {
  readonly backend = 'k9klage';

  async getKlageVurdering(behandlingUuid: string) {
    return (await noNavK9Klage_getKlageVurdering({ query: { behandlingUuid } })).data;
  }

  async mellomlagreKlage(data: MellomlagringDto) {
    await noNavK9Klage_mellomlagreKlage({
      body: data,
    });
  }
}
