import type {
  GetUferdigJournalpostIderPrAktoer1Response,
  MatchFagsakerResponse,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

export type K9StatusBackendApi = {
  getUferdigePunsjoppgaver: (saksnummer: string) => Promise<GetUferdigJournalpostIderPrAktoer1Response>;
  getAndreSakerPåSøker: (fagsakYtelseType: string, søkerIdent: string) => Promise<MatchFagsakerResponse>;
};
