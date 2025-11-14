import type { InnloggetAnsattDto } from '@k9-sak-web/backend/combined/sif/abac/kontrakt/abac/InnloggetAnsattDto.js';

export interface InnloggetAnsattApi {
  readonly backend: 'k9-sak' | 'ung-sak'; // Slik at react query client kan bruke denne prop i query keys for å skille instanser for k9-sak og ung-sak
  innloggetBruker(): Promise<InnloggetAnsattDto>;
}
