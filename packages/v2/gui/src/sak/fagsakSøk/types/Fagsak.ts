import { type sak_kontrakt_fagsak_FagsakDto as FagsakDto } from '@k9-sak-web/backend/k9sak/generated';

export type Fagsak = {
  endret: FagsakDto['endret'];
  opprettet: FagsakDto['opprettet'];
  saksnummer: FagsakDto['saksnummer'];
  sakstype: FagsakDto['sakstype'];
  status: FagsakDto['status'];
};
