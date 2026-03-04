import type { GetUferdigJournalpostIderPrAktoer1Response } from '@k9-sak-web/backend/k9sak/tjenester/GetUferdigJournalpostIderPrAktoer1Response.js';
import type { MatchFagsakerResponse } from '@k9-sak-web/backend/k9sak/tjenester/fagsak/MatchFagsakerResponse.js';

export type K9StatusBackendApi = {
  getUferdigePunsjoppgaver: (saksnummer: string) => Promise<GetUferdigJournalpostIderPrAktoer1Response>;
  getAndreSakerPåSøker: (saksnummer: string) => Promise<MatchFagsakerResponse>;
};
