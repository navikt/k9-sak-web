import type { VurderingRettPleiepengerVedDødDto } from '@k9-sak-web/backend/k9sak/kontrakt/død/VurderingRettPleiepengerVedDødDto.js';
import { død_hentVurderingRettPleiepengerVedDød } from '@k9-sak-web/backend/k9sak/sdk/OmBarnetSdk.js';
import type { OmBarnetBackendApiType } from './OmBarnetBackendApiType.js';

export class K9SakOmBarnetBackendClient implements OmBarnetBackendApiType {
  readonly backend = 'k9sak';

  async hentRettVedDød(behandlingUuid: string): Promise<VurderingRettPleiepengerVedDødDto | null> {
    const { data, response } = await død_hentVurderingRettPleiepengerVedDød({ query: { behandlingUuid } });
    // 204 uten innhold betyr at ingen vurdering er lagret. Generert klient gir da tomt objekt som data.
    if (response.status === 204) {
      return null;
    }
    if (typeof data !== 'object' || data === null) {
      throw new Error(`Uventet svar fra rett ved død (${response.status}): mangler innhold`);
    }
    return data;
  }
}
