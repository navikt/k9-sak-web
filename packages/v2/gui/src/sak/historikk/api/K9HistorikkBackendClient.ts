import { fangFeilVedHenting, type HentetHistorikk, type HistorikkBackendApi } from './HistorikkBackendApi.js';
import { historikk_hentAlleInnslagV2 as klage_historikk_hentAlleInnslagV2 } from '@k9-sak-web/backend/k9klage/generated/sdk.js';
import { historikk_hentAlleInnslagV2 as k9sak_historikk_hentAlleInnslagV2 } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import { historikk_hentAlleInnslagV2 as k9tilbake_historikk_hentAlleInnslagV2 } from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import { type BeriketHistorikkInnslag } from './HistorikkBackendApi.js';
import type { K9Kodeverkoppslag } from '../../../kodeverk/oppslag/useK9Kodeverkoppslag.js';
import { K9HistorikkInnslagBeriker } from './K9HistorikkInnslagBeriker.js';

export class K9HistorikkBackendClient implements HistorikkBackendApi {
  #beriker: K9HistorikkInnslagBeriker;

  readonly backend = 'k9';

  constructor(kodeverkoppslag: K9Kodeverkoppslag) {
    this.#beriker = new K9HistorikkInnslagBeriker(kodeverkoppslag);
  }

  async #hentAlleInnslagK9sak(saksnummer: string): Promise<BeriketHistorikkInnslag[]> {
    return (await k9sak_historikk_hentAlleInnslagV2({ query: { saksnummer: { saksnummer } } })).data.map(innslag =>
      this.#beriker.berikSakInnslag(innslag, saksnummer),
    );
  }

  async #hentAlleInnslagK9klage(saksnummer: string) {
    const resp = await klage_historikk_hentAlleInnslagV2({
      query: {
        saksnummer: { saksnummer },
      },
    });
    return resp.data.map(innslag => this.#beriker.berikKlageInnslag(innslag, saksnummer));
  }

  async #hentAlleInnslagK9tilbake(saksnummer: string) {
    const resp = await k9tilbake_historikk_hentAlleInnslagV2({
      query: {
        saksnummer: { saksnummer },
      },
    });
    return resp.data.map(innslag => this.#beriker.berikTilbakeInnslag(innslag, saksnummer));
  }

  async hentAlleInnslag(saksnummer: string): Promise<HentetHistorikk> {
    const k9SakInnslagPromise = fangFeilVedHenting('k9-sak', this.#hentAlleInnslagK9sak(saksnummer));
    const k9KlageInnslagPromise = fangFeilVedHenting('k9-klage', this.#hentAlleInnslagK9klage(saksnummer));
    const k9TilbakeInnslagPromise = fangFeilVedHenting('k9-tilbake', this.#hentAlleInnslagK9tilbake(saksnummer));

    const k9SakInnslag = await k9SakInnslagPromise;
    const k9KlageInnslag = await k9KlageInnslagPromise;
    const k9TilbakeInnslag = await k9TilbakeInnslagPromise;

    return {
      innslag: [...k9SakInnslag.innslag, ...k9KlageInnslag.innslag, ...k9TilbakeInnslag.innslag],
      feilet: [...k9SakInnslag.feilet, ...k9KlageInnslag.feilet, ...k9TilbakeInnslag.feilet],
    };
  }
}
