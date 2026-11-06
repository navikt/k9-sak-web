import type { EndringsmeldingPsbTilgangDto } from '@k9-sak-web/backend/k9sak/kontrakt/endringsmeldingpsb/EndringsmeldingPsbTilgangDto.js';
import { fagsak_hentEndringsmeldingPsbTilgang } from '@k9-sak-web/backend/k9sak/sdk/EndringsmeldingPsbTilgangSdk.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';
import type { EndringsmeldingPsbTilgangBackendApiType } from './EndringsmeldingPsbTilgangBackendApiType.js';

export class K9SakEndringsmeldingPsbTilgangBackendClient implements EndringsmeldingPsbTilgangBackendApiType {
  readonly backend = backendNavn.k9sak;

  async hentEndringsmeldingPsbTilgang(saksnummer: string): Promise<EndringsmeldingPsbTilgangDto | null> {
    const { data, response } = await fagsak_hentEndringsmeldingPsbTilgang({ query: { saksnummer: { saksnummer } } });
    // 204 uten innhold betyr ukjent saksnummer. Generert klient gir da tomt objekt som data.
    if (response.status === 204) {
      return null;
    }
    return data ?? null;
  }
}
