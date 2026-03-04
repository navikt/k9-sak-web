import type { FagsakDto } from '@k9-sak-web/backend/k9sak/kontrakt/fagsak/FagsakDto.js';

export type Fagsak = {
  endret: FagsakDto['endret'];
  opprettet: FagsakDto['opprettet'];
  saksnummer: FagsakDto['saksnummer'];
  sakstype: FagsakDto['sakstype'];
  status: FagsakDto['status'];
};
