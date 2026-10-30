import { behandlingUttak_getUtenlandsopphold } from '@k9-sak-web/backend/k9sak/sdk/UtenlandsoppholdSdk.js';
import type { UtenlandsoppholdDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/UtenlandsoppholdDto.js';
import type { UtenlandsoppholdBackendApiType } from './UtenlandsoppholdBackendApiType.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export class K9SakUtenlandsoppholdBackendClient implements UtenlandsoppholdBackendApiType {
  readonly backend = backendNavn.k9sak;

  async hentUtenlandsopphold(behandlingUuid: string): Promise<UtenlandsoppholdDto> {
    const response = await behandlingUttak_getUtenlandsopphold({
      query: { behandlingUuid },
    });
    return response.data;
  }
}
