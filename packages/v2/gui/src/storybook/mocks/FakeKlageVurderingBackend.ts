import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import type { MellomlagringDto as MellomlagringDataDto } from '@k9-sak-web/backend/ungsak/kontrakt/mellomlagring/MellomlagringDto.js';
import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';
import type { KlageHjemmelDto } from '@k9-sak-web/backend/ungsak/kontrakt/klage/KlageHjemmelDto.js';
import { action } from 'storybook/actions';
import type { KlageVurderingApi } from '../../prosess/klagevurdering/api/KlageVurderingApi.js';
import { fakePdf } from './fakePdf.js';

export class FakeKlageVurderingBackend implements KlageVurderingApi {
  #klageVurdering: KlagebehandlingDto;
  readonly backend = 'ung';

  constructor(klageVurdering: KlagebehandlingDto) {
    this.#klageVurdering = klageVurdering;
  }

  async forhåndsvisKlageVedtaksbrev(behandling: BehandlingDto): Promise<Blob> {
    action('forhåndsvisKlageVedtaksbrev')({ behandlingId: behandling.id });
    return fakePdf();
  }

  async getKlageVurdering(behandlingUuid: string): Promise<KlagebehandlingDto> {
    action('getKlageVurdering')({ behandlingUuid });
    return this.#klageVurdering;
  }

  async hentValgbareKlagehjemlerForUng(): Promise<KlageHjemmelDto[]> {
    return Promise.resolve([]);
  }

  async mellomlagreKlage(data: MellomlagringDataDto): Promise<void> {
    action('mellomlagreKlage')({ data });
  }
}
