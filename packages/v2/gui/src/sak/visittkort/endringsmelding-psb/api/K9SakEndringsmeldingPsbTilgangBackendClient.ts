import type { EndringsmeldingPsbTilgangDto } from '@k9-sak-web/backend/k9sak/kontrakt/endringsmeldingpsb/EndringsmeldingPsbTilgangDto.js';
import { fagsak_hentEndringsmeldingPsbTilgang } from '@k9-sak-web/backend/k9sak/sdk/EndringsmeldingPsbTilgangSdk.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';
import type { EndringsmeldingPsbTilgangApi } from './EndringsmeldingPsbTilgangApi.js';

export class K9SakEndringsmeldingPsbTilgangBackendClient implements EndringsmeldingPsbTilgangApi {
  readonly backend = backendNavn.k9sak;

  async hentEndringsmeldingPsbTilgang(saksnummer: string): Promise<EndringsmeldingPsbTilgangDto | null> {
    const { data } = await fagsak_hentEndringsmeldingPsbTilgang({ query: { saksnummer: { saksnummer } } });
    return data ?? null;
  }
}
