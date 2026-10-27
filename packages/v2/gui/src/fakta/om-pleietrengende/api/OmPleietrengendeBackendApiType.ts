import type { PersonopplysningPleietrengendeDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningPleietrengendeDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface OmPleietrengendeBackendApiType extends BackendTilhørighet {
  hentPleietrengende(behandlingUuid: string): Promise<PersonopplysningPleietrengendeDto | null>;
}
