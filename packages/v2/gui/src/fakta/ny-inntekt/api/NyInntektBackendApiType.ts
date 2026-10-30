import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface NyInntektBackendApiType extends BackendTilhørighet {
  kanReaktivereAksjonspunkt(behandlingUuid: string): Promise<boolean>;
  reaktiverAksjonspunkt(behandlingUuid: string): Promise<void>;
}
