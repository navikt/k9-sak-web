import type { InnloggetAnsattApi } from './InnloggetAnsattApi.js';
import type { InnloggetAnsattDto } from '@k9-sak-web/backend/combined/sif/abac/kontrakt/abac/InnloggetAnsattDto.ts';
import { hentInnloggetBruker } from '@k9-sak-web/backend/ungsak/sdk.js';

export class UngSakInnloggetAnsattBackendClient implements InnloggetAnsattApi {
  readonly backend = 'ung-sak';

  async innloggetBruker(): Promise<InnloggetAnsattDto> {
    return (await hentInnloggetBruker()).data;
  }
}
