import { reaktiverAksjonspunktNyInntekt } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsgrunnlag/ReaktiverAksjonspunktNyInntekt.js';
import type { NyInntektApi } from './NyInntektApi.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export class K9SakNyInntektBackendClient implements NyInntektApi {
  readonly backend = backendNavn.k9sak;

  async reaktiverAksjonspunktNyInntekt(behandlingUuid: string): Promise<void> {
    await reaktiverAksjonspunktNyInntekt({ query: { behandlingUuid } });
  }
}
