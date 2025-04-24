import { K9SakClient } from '@k9-sak-web/backend/k9sak/generated';
import type { HistorikkBackendApi } from './HistorikkBackendApi.js';

export class HistorikkBackendClient implements HistorikkBackendApi {
  #k9sak: K9SakClient;

  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async hentAlleInnslagK9sak(saksnummer: string) {
    return this.#k9sak.historikk.hentAlleInnslagV2({ saksnummer });
  }
}
