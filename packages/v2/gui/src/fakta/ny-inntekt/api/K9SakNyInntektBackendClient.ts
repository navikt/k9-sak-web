import {
  kanReaktivereAksjonspunktNyInntekt,
  reaktiverAksjonspunktNyInntekt,
} from '@k9-sak-web/backend/k9sak/kontrakt/beregningsgrunnlag/ReaktiverAksjonspunktNyInntekt.js';
import type { NyInntektBackendApiType } from './NyInntektBackendApiType.js';

export class K9SakNyInntektBackendClient implements NyInntektBackendApiType {
  readonly backend = 'k9sak';

  async kanReaktivereAksjonspunkt(behandlingUuid: string): Promise<boolean> {
    const response = await kanReaktivereAksjonspunktNyInntekt({ query: { behandlingUuid } });
    return response.data;
  }

  async reaktiverAksjonspunkt(behandlingUuid: string): Promise<void> {
    await reaktiverAksjonspunktNyInntekt({ query: { behandlingUuid } });
  }
}
