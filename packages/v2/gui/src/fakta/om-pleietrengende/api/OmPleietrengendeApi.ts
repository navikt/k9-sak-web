import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningDto.js';

export interface OmPleietrengendeApi {
  hentPleietrengende(behandlingUuid: string): Promise<PersonopplysningDto | null>;
}
