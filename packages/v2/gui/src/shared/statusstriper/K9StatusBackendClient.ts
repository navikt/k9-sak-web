import type {
  GetUferdigJournalpostIderPrAktoer1Response,
  K9SakClient,
  MatchFagsakerResponse,
} from '@k9-sak-web/backend/k9sak/generated';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

export default class K9StatusBackendClient {
  #k9sak: K9SakClient;

  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async getAndreSakerPåSøker(fagsakYtelseType: FagsakYtelsesType, søkerIdent: string): Promise<MatchFagsakerResponse> {
    return this.#k9sak.fagsak.matchFagsaker({ ytelseType: fagsakYtelseType, bruker: søkerIdent });
  }

  async getUferdigePunsjoppgaver(saksnummer: string): Promise<GetUferdigJournalpostIderPrAktoer1Response> {
    return this.#k9sak.journalposter.getUferdigJournalpostIderPrAktoer1({ saksnummer });
  }
}
