import type { OppgittTilknytningDto } from '@k9-sak-web/backend/k9sak/kontrakt/søknad/OppgittTilknytningDto.js';

export interface Søknad {
  oppgittTilknytning: OppgittTilknytningDto;
  fodselsdatoer: string[];
}
