import type { k9_klage_kontrakt_klage_KlagebehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { ung_sak_kontrakt_klage_KlagebehandlingDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { action } from 'storybook/actions';
import type { VedtakKlageApi } from '../../prosess/vedtak-klage/api/VedtakKlageApi.js';
import { fakePdf } from './fakePdf.js';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';

export class FakeVedtakKlageBackendApi implements VedtakKlageApi {
  #klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto | k9_klage_kontrakt_klage_KlagebehandlingDto;
  readonly backend = 'ung';

  constructor(klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto | k9_klage_kontrakt_klage_KlagebehandlingDto) {
    this.#klageVurdering = klageVurdering;
  }

  async forhåndsvisKlageVedtaksbrev(behandling: BehandlingDto): Promise<Blob> {
    action('forhåndsvisKlageVedtaksbrev')({ behandlingId: behandling.id });
    return fakePdf();
  }

  async getKlageVurdering(
    behandlingUuid: string,
  ): Promise<ung_sak_kontrakt_klage_KlagebehandlingDto | k9_klage_kontrakt_klage_KlagebehandlingDto> {
    action('getKlageVurdering')({ behandlingUuid });
    return this.#klageVurdering;
  }
}
