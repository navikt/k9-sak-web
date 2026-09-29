import { behandlingPerson_getPersonopplysninger1 } from '@k9-sak-web/backend/k9sak/sdk/OmPleietrengendeSdk.js';
import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningDto.js';
import type { OmPleietrengendeBackendApiType } from './OmPleietrengendeBackendApiType.js';

export class K9SakOmPleietrengendeBackendClient implements OmPleietrengendeBackendApiType {
  readonly backend = 'k9sak';

  async hentPleietrengende(behandlingUuid: string): Promise<PersonopplysningDto | null> {
    const response = await behandlingPerson_getPersonopplysninger1({
      query: { behandlingUuid },
    });
    // Backend svarer uten innhold når pleietrengende ikke finnes
    return response.data || null;
  }
}
