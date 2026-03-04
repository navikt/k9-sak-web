import type { FormidlingClient } from '@k9-sak-web/backend/k9formidling/client/FormidlingClient.js';
import type { Dokumentdata, ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import {
  getKlageVurdering,
  mellomlagreKlage,
  hentValgtKlagendePart,
} from '@k9-sak-web/backend/k9klage/sdk.js';
import type { BehandlingDto as K9KlageBehandlingDto } from '@k9-sak-web/backend/k9klage/kontrakt/behandling/BehandlingDto.js';
import type { MellomlagringDto } from '@k9-sak-web/backend/k9klage/kontrakt/mellomlagring/MellomlagringDto.js';
import { AvsenderApplikasjon } from '@k9-sak-web/backend/k9sak/kodeverk/formidling/AvsenderApplikasjon.js';
import type { FagsakDto as K9FagsakDto } from '@k9-sak-web/backend/k9sak/kontrakt/fagsak/FagsakDto.js';
import type { KlageVurderingApi } from './KlageVurderingApi.js';

export default class K9KlageVurderingBackendClient implements KlageVurderingApi {
  readonly backend = 'k9klage';

  #formidling: FormidlingClient;

  constructor(formidlingClient: FormidlingClient) {
    this.#formidling = formidlingClient;
  }

  async getKlageVurdering(behandlingUuid: string) {
    return (await getKlageVurdering({ query: { behandlingUuid } })).data;
  }

  async mellomlagreKlage(data: MellomlagringDto) {
    await mellomlagreKlage({
      body: data,
    });
  }

  async forhåndsvisKlageVedtaksbrev(
    behandling: K9KlageBehandlingDto,
    fagsak: K9FagsakDto,
    dokumentdata?: Dokumentdata,
  ): Promise<Blob> {
    const valgtPartMedKlagerett = await this.#hentValgtKlagendePart(behandling.uuid);
    const forhåndsvisDto: ForhåndsvisDto = {
      eksternReferanse: behandling.uuid,
      ytelseType: fagsak.sakstype,
      saksnummer: fagsak.saksnummer,
      aktørId: fagsak.person?.aktørId ?? '',
      avsenderApplikasjon: AvsenderApplikasjon.K9KLAGE,
      dokumentMal: 'UTLED',
      dokumentdata: dokumentdata ?? null,
      overstyrtMottaker: valgtPartMedKlagerett.identifikasjon,
    };
    return await this.#formidling.forhåndsvisning.lagPdf(forhåndsvisDto);
  }

  async #hentValgtKlagendePart(behandlingUuid: string) {
    return (await hentValgtKlagendePart({ query: { behandlingUuid } })).data;
  }
}
