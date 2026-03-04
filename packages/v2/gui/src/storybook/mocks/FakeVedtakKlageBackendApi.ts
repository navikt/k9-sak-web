import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';
import { action } from 'storybook/actions';
import type { VedtakKlageApi } from '../../prosess/vedtak-klage/api/VedtakKlageApi.js';
import { fakePdf } from './fakePdf.js';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';

export class FakeVedtakKlageBackendApi implements VedtakKlageApi {
  #klageVurdering: KlagebehandlingDto;
  readonly backend = 'ung';

  constructor(klageVurdering: KlagebehandlingDto) {
    this.#klageVurdering = klageVurdering;
  }

  async forhåndsvisKlageVedtaksbrev(behandling: BehandlingDto): Promise<Blob> {
    action('forhåndsvisKlageVedtaksbrev')({ behandlingId: behandling.id });
    return fakePdf();
  }

  async getKlageVurdering(
    behandlingUuid: string,
  ): Promise<KlagebehandlingDto> {
    action('getKlageVurdering')({ behandlingUuid });
    return this.#klageVurdering;
  }
}
