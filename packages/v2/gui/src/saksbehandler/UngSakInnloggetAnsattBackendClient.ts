import type { InnloggetAnsattDto } from '@k9-sak-web/backend/combined/sif/abac/kontrakt/abac/InnloggetAnsattDto.ts';
import { navAnsatt_innloggetBruker } from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import type { InnloggetAnsattApi } from './InnloggetAnsattApi.js';

export class UngSakInnloggetAnsattBackendClient implements InnloggetAnsattApi {
  readonly backend = 'ung-sak';

  async innloggetBruker(): Promise<InnloggetAnsattDto> {
    return (await navAnsatt_innloggetBruker()).data;
  }
}
