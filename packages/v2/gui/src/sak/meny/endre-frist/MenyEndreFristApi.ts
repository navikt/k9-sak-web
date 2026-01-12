import type {
  ung_sak_kontrakt_etterlysning_EndreFristDto,
  ung_sak_kontrakt_etterlysning_Etterlysning,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export interface MenyEndreFristApi {
  hentEtterlysninger(behandlingUuid: string): Promise<ung_sak_kontrakt_etterlysning_Etterlysning[]>;
  endreFrist(
    behandlingId: number,
    behandlingVersjon: number,
    endretFrister: Array<ung_sak_kontrakt_etterlysning_EndreFristDto>,
  ): Promise<unknown>;
}
