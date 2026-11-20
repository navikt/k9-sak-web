import { verge_hentVerge } from '@k9-sak-web/backend/k9tilbake/api/verge.js';
import type { VergeDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/verge/VergeDto.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';
import type { VergeBackendApiType } from './VergeBackendApiType.js';

export class K9TilbakeVergeBackendClient implements VergeBackendApiType {
  readonly backend = backendNavn.k9tilbake;

  async hentVerge(behandlingUuid: string): Promise<VergeDto | null> {
    const { data, response } = await verge_hentVerge({ query: { uuid: { uuid: behandlingUuid } } });
    // 204 uten innhold betyr at ingen verge er registrert. Generert klient gir da tomt objekt som data.
    if (response.status === 204) {
      return null;
    }
    if (typeof data !== 'object' || data === null) {
      throw new Error(`Uventet svar fra verge (${response.status}): mangler innhold`);
    }
    return data;
  }
}
