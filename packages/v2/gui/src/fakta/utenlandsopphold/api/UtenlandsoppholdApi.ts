import type { UtenlandsoppholdDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/UtenlandsoppholdDto.js';

export interface UtenlandsoppholdApi {
  hentUtenlandsopphold(behandlingUuid: string): Promise<UtenlandsoppholdDto>;
}
