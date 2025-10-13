import type { InnloggetAnsattApi } from './InnloggetAnsattApi.js';
import type { InnloggetAnsattDto } from '@k9-sak-web/backend/combined/sif/abac/kontrakt/abac/InnloggetAnsattDto.ts';
import { navAnsatt_innloggetBruker } from '@k9-sak-web/backend/k9sak/generated/sdk.js';

export class K9SakInnloggetAnsattBackendClient implements InnloggetAnsattApi {
  readonly backend = 'k9-sak';

  async innloggetBruker(): Promise<InnloggetAnsattDto> {
    return (await navAnsatt_innloggetBruker()).data;
  }
}
