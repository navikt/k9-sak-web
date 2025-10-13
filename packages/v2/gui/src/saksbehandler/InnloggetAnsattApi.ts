import type { InnloggetAnsattDto } from '@k9-sak-web/backend/combined/sif/abac/kontrakt/abac/InnloggetAnsattDto.ts';

export interface InnloggetAnsattApi {
  innloggetBruker(): Promise<InnloggetAnsattDto>;
}
