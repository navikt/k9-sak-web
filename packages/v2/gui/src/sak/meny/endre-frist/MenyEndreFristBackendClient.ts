import { endreFristEtterlysning, hentEtterlysninger } from '@k9-sak-web/backend/ungsak/sdk.js';
import type { EndreFristDto } from '@k9-sak-web/backend/ungsak/kontrakt/etterlysning/EndreFristDto.js';
import type { Etterlysning } from '@k9-sak-web/backend/ungsak/kontrakt/etterlysning/Etterlysning.js';
import type { MenyEndreFristApi } from './MenyEndreFristApi';

export default class MenyEndreFristBackendClient implements MenyEndreFristApi {
  async hentEtterlysninger(behandlingUuid: string): Promise<Etterlysning[]> {
    return (await hentEtterlysninger({ query: { behandlingUuid } })).data;
  }
  async endreFrist(
    behandlingId: number,
    behandlingVersjon: number,
    endretFrister: Array<EndreFristDto>,
  ): Promise<void> {
    await endreFristEtterlysning({
      body: {
        behandlingId,
        behandlingVersjon,
        endretFrister,
      },
    });
  }
}
