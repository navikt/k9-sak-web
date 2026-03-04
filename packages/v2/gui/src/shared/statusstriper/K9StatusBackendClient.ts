import type { GetUferdigJournalpostIderPrAktoer1Response } from '@k9-sak-web/backend/k9sak/tjenester/GetUferdigJournalpostIderPrAktoer1Response.js';
import type { MatchFagsakerResponse } from '@k9-sak-web/backend/k9sak/tjenester/fagsak/MatchFagsakerResponse.js';
import {
  hentSøkersRelaterteSaker,
  getUferdigeJournalposter,
} from '@k9-sak-web/backend/k9sak/sdk.js';

export default class K9StatusBackendClient {
  constructor() {}

  async getAndreSakerPåSøker(saksnummer: string): Promise<MatchFagsakerResponse> {
    return (await hentSøkersRelaterteSaker({ query: { saksnummer: { saksnummer } } })).data;
  }

  async getUferdigePunsjoppgaver(saksnummer: string): Promise<GetUferdigJournalpostIderPrAktoer1Response> {
    return (await getUferdigeJournalposter({ query: { saksnummer: { saksnummer } } })).data;
  }
}
