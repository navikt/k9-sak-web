import {
  fagsak_hentSøkersRelaterteSaker,
  journalposter_getUferdigJournalpostIderPrAktoer1,
  los_getMerknad,
} from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type {
  GetUferdigJournalpostIderPrAktoer1Response,
  MatchFagsakerResponse,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { MerknadResponse } from '@k9-sak-web/backend/k9sak/kontrakt/los/MerknadResponse.js';

export default class K9StatusBackendClient {
  constructor() {}

  async getAndreSakerPåSøker(saksnummer: string): Promise<MatchFagsakerResponse> {
    return (await fagsak_hentSøkersRelaterteSaker({ query: { saksnummer: { saksnummer } } })).data;
  }

  async getUferdigePunsjoppgaver(saksnummer: string): Promise<GetUferdigJournalpostIderPrAktoer1Response> {
    return (await journalposter_getUferdigJournalpostIderPrAktoer1({ query: { saksnummer: { saksnummer } } })).data;
  }

  async getMerknader(behandlingUuid: string): Promise<MerknadResponse> {
    return (await los_getMerknad({ query: { behandlingUuid } })).data;
  }
}
