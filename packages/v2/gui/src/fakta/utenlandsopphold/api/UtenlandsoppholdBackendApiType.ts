import type { UtenlandsoppholdDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/UtenlandsoppholdDto.js';

export interface UtenlandsoppholdBackendApiType {
  readonly backend: 'k9sak';
  hentUtenlandsopphold(behandlingUuid: string): Promise<UtenlandsoppholdDto>;
}
