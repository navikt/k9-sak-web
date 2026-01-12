import { etterlysning_endreFrist, hentEtterlysninger } from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import type {
  ung_sak_kontrakt_etterlysning_EndreFristDto,
  ung_sak_kontrakt_etterlysning_Etterlysning,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { MenyEndreFristApi } from './MenyEndreFristApi';

export default class MenyEndreFristBackendClient implements MenyEndreFristApi {
  async hentEtterlysninger(behandlingUuid: string): Promise<ung_sak_kontrakt_etterlysning_Etterlysning[]> {
    return (await hentEtterlysninger({ query: { behandlingUuid } })).data;
  }
  async endreFrist(
    behandlingId: number,
    behandlingVersjon: number,
    endretFrister: Array<ung_sak_kontrakt_etterlysning_EndreFristDto>,
  ): Promise<unknown> {
    return (
      await etterlysning_endreFrist({
        body: {
          behandlingId,
          behandlingVersjon,
          endretFrister,
        },
      })
    ).data;
  }
}
