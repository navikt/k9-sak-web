import type {
  GetUferdigJournalpostIderPrAktoer1Response,
  MatchFagsakerResponse,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

export type K9StatusBackendApi = {
  getUferdigePunsjoppgaver: (saksnummer: string) => Promise<GetUferdigJournalpostIderPrAktoer1Response>;
  getAndreSakerPåSøker: (fagsakYtelseTyper: FagsakYtelsesType[], søkerIdent: string) => Promise<MatchFagsakerResponse>;
};
