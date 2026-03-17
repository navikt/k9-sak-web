import { behandlingUttak_getUtenlandsopphold } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { UtenlandsoppholdDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/UtenlandsoppholdDto.js';
import type { UtenlandsoppholdApi } from './UtenlandsoppholdApi.js';

export class K9UtenlandsoppholdBackendClient implements UtenlandsoppholdApi {
  async getUtenlandsopphold(behandlingUuid: string): Promise<UtenlandsoppholdDto> {
    const response = await behandlingUttak_getUtenlandsopphold({
      query: { behandlingUuid },
    });
    return response.data;
  }
}
