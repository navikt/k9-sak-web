import { type FagsakDto } from '@navikt/k9-sak-typescript-client';

export type Fagsak = {
  endret: FagsakDto['endret'];
  opprettet: FagsakDto['opprettet'];
  saksnummer: FagsakDto['saksnummer'];
  sakstype: FagsakDto['sakstype'];
  status: FagsakDto['status'];
};
