import type { EndreFristDto } from '@k9-sak-web/backend/ungsak/kontrakt/etterlysning/EndreFristDto.js';
import type { Etterlysning } from '@k9-sak-web/backend/ungsak/kontrakt/etterlysning/Etterlysning.js';

export interface MenyEndreFristApi {
  hentEtterlysninger(behandlingUuid: string): Promise<Etterlysning[]>;
  endreFrist(
    behandlingId: number,
    behandlingVersjon: number,
    endretFrister: Array<EndreFristDto>,
  ): Promise<void>;
}
