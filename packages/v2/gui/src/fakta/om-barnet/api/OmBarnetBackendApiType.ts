import type { VurderingRettPleiepengerVedDødDto } from '@k9-sak-web/backend/k9sak/kontrakt/død/VurderingRettPleiepengerVedDødDto.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface OmBarnetBackendApiType extends BackendTilhørighet {
  hentRettVedDød(behandlingUuid: string): Promise<VurderingRettPleiepengerVedDødDto | null>;
}
