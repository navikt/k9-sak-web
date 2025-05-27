import { K9SakClient } from '@k9-sak-web/backend/k9sak/generated';
import type { HistorikkBackendApi } from './HistorikkBackendApi.js';
import { historikk_hentAlleInnslagV2 } from '@k9-sak-web/backend/k9klage/generated/sdk.js';
import { HistorikkInnslagTypeBeriker } from './historikkTypeBerikning.js';
import type { K9Kodeverkoppslag } from '../../kodeverk/oppslag/useK9Kodeverkoppslag.jsx';

export class HistorikkBackendClient implements HistorikkBackendApi {
  #k9sak: K9SakClient;
  #beriker: HistorikkInnslagTypeBeriker;

  constructor(k9sakClient: K9SakClient, kodeverkoppslag: K9Kodeverkoppslag) {
    this.#k9sak = k9sakClient;
    this.#beriker = new HistorikkInnslagTypeBeriker(kodeverkoppslag);
  }

  async hentAlleInnslagK9sak(saksnummer: string) {
    return (await this.#k9sak.historikk.hentAlleInnslagV2({ saksnummer })).map(innslag =>
      this.#beriker.sakHistorikkInnslagV2(innslag),
    );
  }

  async hentAlleInnslagK9klage(saksnummer: string) {
    const resp = await historikk_hentAlleInnslagV2({
      query: {
        saksnummer: { saksnummer },
      },
    });
    return resp.data.map(innslag => this.#beriker.klageHistorikkInnslagV2(innslag));
  }
}
