import type { EndringsmeldingPsbTilgangDto } from '@k9-sak-web/backend/k9sak/kontrakt/endringsmeldingpsb/EndringsmeldingPsbTilgangDto.js';
import { fagsak_hentEndringsmeldingPsbTilgang } from '@k9-sak-web/backend/k9sak/sdk/EndringsmeldingPsbTilgangSdk.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';
import type { EndringsmeldingPsbTilgangBackendApiType } from './EndringsmeldingPsbTilgangBackendApiType.js';

export class K9SakEndringsmeldingPsbTilgangBackendClient implements EndringsmeldingPsbTilgangBackendApiType {
  readonly backend = backendNavn.k9sak;

  async hentEndringsmeldingPsbTilgang(saksnummer: string): Promise<EndringsmeldingPsbTilgangDto> {
    const response = await fagsak_hentEndringsmeldingPsbTilgang({ query: { saksnummer } });
    return response.data;
  }
}
