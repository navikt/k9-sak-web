import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import type {
  ung_sak_web_app_tjenester_klage_KlageRestTjeneste_AbacKlageVurderingResultatAksjonspunktMellomlagringDto as MellomlagringDataDto,
  ung_sak_kontrakt_klage_KlagebehandlingDto,
  ung_sak_kontrakt_klage_KlageHjemmelDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { action } from 'storybook/actions';
import type { KlageVurderingApi } from '../../prosess/klagevurdering/api/KlageVurderingApi.js';
import { fakePdf } from './fakePdf.js';

export class FakeKlageVurderingBackend implements KlageVurderingApi {
  #klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto;
  readonly backend = 'ung';

  constructor(klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto) {
    this.#klageVurdering = klageVurdering;
  }

  async forhåndsvisKlageVedtaksbrev(behandling: BehandlingDto): Promise<Blob> {
    action('forhåndsvisKlageVedtaksbrev')({ behandlingId: behandling.id });
    return fakePdf();
  }

  async getKlageVurdering(behandlingUuid: string): Promise<ung_sak_kontrakt_klage_KlagebehandlingDto> {
    action('getKlageVurdering')({ behandlingUuid });
    return this.#klageVurdering;
  }

  async hentValgbareKlagehjemlerForUng(): Promise<ung_sak_kontrakt_klage_KlageHjemmelDto[]> {
    return Promise.resolve([]);
  }

  async mellomlagreKlage(data: MellomlagringDataDto): Promise<void> {
    action('mellomlagreKlage')({ data });
  }
}
