import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface NyInntektApi extends BackendTilhørighet {
  reaktiverAksjonspunktNyInntekt(behandlingUuid: string): Promise<void>;
}
