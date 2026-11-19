import type { VergeDto } from '@k9-sak-web/backend/combined/kontrakt/verge/VergeDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface VergeBackendApiType extends BackendTilhørighet<'k9tilbake' | 'ungtilbake'> {
  hentVerge(behandlingUuid: string): Promise<VergeDto | null>;
}
