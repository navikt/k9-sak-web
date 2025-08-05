import type { OppgittTilknytningDto } from '@k9-sak-web/backend/k9sak/generated';

export interface Søknad {
  oppgittTilknytning: OppgittTilknytningDto;
  fodselsdatoer: string[];
}
