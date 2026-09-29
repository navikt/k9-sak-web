import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface OmPleietrengendeBackendApiType extends BackendTilhørighet {
  hentPleietrengende(behandlingUuid: string): Promise<PersonopplysningDto | null>;
}
