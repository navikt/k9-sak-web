import type {
  GetUferdigJournalpostIderPrAktoer1Response,
  MatchFagsakerResponse,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import {
  fagsak_hentSøkersRelaterteSaker,
  journalposter_getUferdigJournalpostIderPrAktoer1,
} from '@k9-sak-web/backend/k9sak/generated/sdk.js';

export default class K9StatusBackendClient {
  constructor() {}

  async getAndreSakerPåSøker(behandlingUuid: string): Promise<MatchFagsakerResponse> {
    return (await fagsak_hentSøkersRelaterteSaker({ query: { behandlingUuid: behandlingUuid } })).data;
  }

  async getUferdigePunsjoppgaver(saksnummer: string): Promise<GetUferdigJournalpostIderPrAktoer1Response> {
    return (await journalposter_getUferdigJournalpostIderPrAktoer1({ query: { saksnummer: { saksnummer } } })).data;
  }
}
