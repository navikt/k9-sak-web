import type { UtenlandsoppholdDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/UtenlandsoppholdDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface UtenlandsoppholdBackendApiType extends BackendTilhørighet {
  hentUtenlandsopphold(behandlingUuid: string): Promise<UtenlandsoppholdDto>;
}
