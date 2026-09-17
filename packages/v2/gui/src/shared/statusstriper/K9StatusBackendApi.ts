import type {
  GetUferdigJournalpostIderPrAktoer1Response,
  MatchFagsakerResponse,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { MerknadResponse } from '@k9-sak-web/backend/k9sak/kontrakt/los/MerknadResponse.js';
import type { OppgaveÅrsak } from '@k9-sak-web/backend/k9sak/kontrakt/oppgave/OppgaveÅrsak.js';

export type K9StatusBackendApi = {
  getUferdigePunsjoppgaver: (saksnummer: string) => Promise<GetUferdigJournalpostIderPrAktoer1Response>;
  getAndreSakerPåSøker: (saksnummer: string) => Promise<MatchFagsakerResponse>;
  getMerknader(behandlingUuid: string): Promise<MerknadResponse>;
  getÅpneGosysOppgaver(saksnummer: string): Promise<OppgaveÅrsak[]>;
};
