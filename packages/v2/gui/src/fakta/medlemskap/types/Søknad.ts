import type { k9_sak_kontrakt_søknad_OppgittTilknytningDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

export interface Søknad {
  oppgittTilknytning: k9_sak_kontrakt_søknad_OppgittTilknytningDto;
  fodselsdatoer: string[];
}
