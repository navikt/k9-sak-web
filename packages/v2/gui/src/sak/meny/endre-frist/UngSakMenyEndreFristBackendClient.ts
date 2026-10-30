import { etterlysning_endreFrist, hentEtterlysninger } from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import type {
  ung_sak_kontrakt_etterlysning_EndreFristDto,
  ung_sak_kontrakt_etterlysning_Etterlysning,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { MenyEndreFristApi } from './MenyEndreFristApi';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export default class UngSakMenyEndreFristBackendClient implements MenyEndreFristApi {
  readonly backend = backendNavn.ungsak;

  async hentEtterlysninger(behandlingUuid: string): Promise<ung_sak_kontrakt_etterlysning_Etterlysning[]> {
    return (await hentEtterlysninger({ query: { behandlingUuid } })).data;
  }
  async endreFrist(
    behandlingId: number,
    behandlingVersjon: number,
    endretFrister: Array<ung_sak_kontrakt_etterlysning_EndreFristDto>,
  ): Promise<void> {
    await etterlysning_endreFrist({
      body: {
        behandlingId,
        behandlingVersjon,
        endretFrister,
      },
    });
  }
}
