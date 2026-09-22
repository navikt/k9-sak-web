import type {
  ung_sak_kontrakt_etterlysning_EndreFristDto,
  ung_sak_kontrakt_etterlysning_Etterlysning,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { MenyEndreFristApi } from '@k9-sak-web/gui/sak/meny/endre-frist/MenyEndreFristApi.js';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared.js';

export class FakeMenyEndreFristApi implements MenyEndreFristApi {
  #etterlysninger: ung_sak_kontrakt_etterlysning_Etterlysning[];

  constructor(etterlysninger: ung_sak_kontrakt_etterlysning_Etterlysning[] = []) {
    this.#etterlysninger = etterlysninger;
  }

  hentEtterlysninger(behandlingUuid: string): Promise<ung_sak_kontrakt_etterlysning_Etterlysning[]> {
    ignoreUnusedDeclared(behandlingUuid);
    return Promise.resolve(this.#etterlysninger);
  }

  endreFrist(
    behandlingId: number,
    behandlingVersjon: number,
    endretFrister: Array<ung_sak_kontrakt_etterlysning_EndreFristDto>,
  ): Promise<void> {
    ignoreUnusedDeclared({ behandlingId, behandlingVersjon, endretFrister });
    return Promise.resolve();
  }
}
