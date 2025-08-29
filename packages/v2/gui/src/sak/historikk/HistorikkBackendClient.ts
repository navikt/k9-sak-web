import type { HistorikkBackendApi } from './HistorikkBackendApi.js';
import { historikk_hentAlleInnslagV2 as klage_historikk_hentAlleInnslagV2 } from '@k9-sak-web/backend/k9klage/generated/sdk.js';
import { historikk_hentAlleInnslagV2 as k9sak_historikk_hentAlleInnslagV2 } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import { historikk_hentAlleInnslagV2 as k9tilbake_historikk_hentAlleInnslagV2 } from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import { HistorikkInnslagTypeBeriker } from './historikkTypeBerikning.js';
import type { K9Kodeverkoppslag } from '../../kodeverk/oppslag/useK9Kodeverkoppslag.jsx';

export class HistorikkBackendClient implements HistorikkBackendApi {
  #beriker: HistorikkInnslagTypeBeriker;

  constructor(kodeverkoppslag: K9Kodeverkoppslag) {
    this.#beriker = new HistorikkInnslagTypeBeriker(kodeverkoppslag);
  }

  async hentAlleInnslagK9sak(saksnummer: string) {
    return (await k9sak_historikk_hentAlleInnslagV2({ query: { saksnummer: { saksnummer } } })).data.map(innslag =>
      this.#beriker.sakHistorikkInnslagV2(innslag),
    );
  }

  async hentAlleInnslagK9klage(saksnummer: string) {
    const resp = await klage_historikk_hentAlleInnslagV2({
      query: {
        saksnummer: { saksnummer },
      },
    });
    return resp.data.map(innslag => this.#beriker.klageHistorikkInnslagV2(innslag));
  }

  async hentAlleInnslagK9tilbake(saksnummer: string) {
    const resp = await k9tilbake_historikk_hentAlleInnslagV2({
      query: {
        saksnummer: { saksnummer },
      },
    });
    return resp.data.map(innslag => this.#beriker.tilbakeHistorikkInnslagV2(innslag));
  }
}
