import type { FormidlingClient } from '@k9-sak-web/backend/k9formidling/client/FormidlingClient.js';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import {
  noNavK9Klage_getKlageVurdering,
  parter_hentValgtKlagendePart,
} from '@k9-sak-web/backend/k9klage/generated/sdk.js';
import type { BehandlingDto as K9KlageBehandlingDto } from '@k9-sak-web/backend/k9klage/kontrakt/behandling/BehandlingDto.js';
import { k9_formidling_kontrakt_kodeverk_AvsenderApplikasjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { FagsakDto as K9FagsakDto } from '@k9-sak-web/backend/k9sak/kontrakt/fagsak/FagsakDto.js';
import type { VedtakKlageApi } from './VedtakKlageApi.js';

export default class K9KlageVedtakKlageBackendClient implements VedtakKlageApi {
  readonly backend = 'k9klage';

  #formidling: FormidlingClient;

  constructor(formidlingClient: FormidlingClient) {
    this.#formidling = formidlingClient;
  }

  async forhåndsvisKlageVedtaksbrev(behandling: K9KlageBehandlingDto, fagsak: K9FagsakDto): Promise<Blob> {
    const valgtPartMedKlagerett = await this.#hentValgtKlagendePart(behandling.uuid);
    const forhåndsvisDto: ForhåndsvisDto = {
      eksternReferanse: behandling.uuid,
      ytelseType: fagsak.sakstype,
      saksnummer: fagsak.saksnummer,
      aktørId: fagsak.person?.aktørId ?? '',
      avsenderApplikasjon: k9_formidling_kontrakt_kodeverk_AvsenderApplikasjon.K9KLAGE,
      dokumentMal: 'UTLED',
      dokumentdata: null,
      overstyrtMottaker: valgtPartMedKlagerett.identifikasjon,
    };
    return await this.#formidling.forhåndsvisning.lagPdf(forhåndsvisDto);
  }

  async #hentValgtKlagendePart(behandlingUuid: string) {
    return (await parter_hentValgtKlagendePart({ query: { behandlingUuid } })).data;
  }

  async getKlageVurdering(behandlingUuid: string) {
    return (await noNavK9Klage_getKlageVurdering({ query: { behandlingUuid } })).data;
  }
}
