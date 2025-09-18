import type {
  GetUferdigJournalpostIderPrAktoer1Response,
  MatchFagsakerResponse,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import {
  fagsak_matchFagsakerV2,
  journalposter_getUferdigJournalpostIderPrAktoer1,
} from '@k9-sak-web/backend/k9sak/generated/sdk.js';

export default class K9StatusBackendClient {
  constructor() {}

  async getAndreSakerPåSøker(
    fagsakYtelseTyper: FagsakYtelsesType[],
    søkerIdent: string,
  ): Promise<MatchFagsakerResponse> {
    return (await fagsak_matchFagsakerV2({ body: { ytelseTyper: fagsakYtelseTyper, bruker: søkerIdent } })).data;
  }

  async getUferdigePunsjoppgaver(saksnummer: string): Promise<GetUferdigJournalpostIderPrAktoer1Response> {
    return (await journalposter_getUferdigJournalpostIderPrAktoer1({ query: { saksnummer: { saksnummer } } })).data;
  }
}
