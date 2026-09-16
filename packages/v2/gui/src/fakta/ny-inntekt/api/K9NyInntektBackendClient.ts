import { reaktiverAksjonspunktNyInntekt } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsgrunnlag/ReaktiverAksjonspunktNyInntekt.js';
import type { NyInntektApi } from './NyInntektApi.js';

export class K9NyInntektBackendClient implements NyInntektApi {
  async reaktiverAksjonspunktNyInntekt(behandlingUuid: string): Promise<void> {
    await reaktiverAksjonspunktNyInntekt({ query: { behandlingUuid } });
  }
}
