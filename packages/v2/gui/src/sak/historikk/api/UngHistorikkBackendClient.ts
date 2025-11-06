import {
  type BeriketHistorikkInnslag,
  fangFeilVedHenting,
  type HentetHistorikk,
  type HistorikkBackendApi,
} from './HistorikkBackendApi.js';
import { UngHistorikkInnslagBeriker } from './UngHistorikkInnslagBeriker.js';
import type { UngKodeverkoppslag } from '../../../kodeverk/oppslag/useUngKodeverkoppslag.js';
import { historikk_hentAlleInnslag as ungsak_historikk_hentAlleInnslag } from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import { historikk_hentAlleInnslagV2 as ungtilbake_historikk_hentAlleInnslag } from '@k9-sak-web/backend/ungtilbake/generated/sdk.js';

export class UngHistorikkBackendClient implements HistorikkBackendApi {
  #beriker: UngHistorikkInnslagBeriker;

  readonly backend = 'ung';

  constructor(kodeverkoppslag: UngKodeverkoppslag) {
    this.#beriker = new UngHistorikkInnslagBeriker(kodeverkoppslag);
  }

  async #hentSakInnslag(saksnummer: string): Promise<BeriketHistorikkInnslag[]> {
    return (await ungsak_historikk_hentAlleInnslag({ query: { saksnummer: { saksnummer } } })).data.map(innslag =>
      this.#beriker.berikSakInnslag(innslag, saksnummer),
    );
  }

  async #hentTilbakeInnslag(saksnummer: string): Promise<BeriketHistorikkInnslag[]> {
    return (await ungtilbake_historikk_hentAlleInnslag({ query: { saksnummer: { saksnummer } } })).data.map(innslag =>
      this.#beriker.berikTilbakeInnslag(innslag, saksnummer),
    );
  }

  async hentAlleInnslag(saksnummer: string): Promise<HentetHistorikk> {
    const ungSakPromise = fangFeilVedHenting('ung-sak', this.#hentSakInnslag(saksnummer));
    const ungTilbakePromise = fangFeilVedHenting('ung-tilbake', this.#hentTilbakeInnslag(saksnummer));

    const ungSak = await ungSakPromise;
    const ungTilbake = await ungTilbakePromise;

    return {
      innslag: [...ungSak.innslag, ...ungTilbake.innslag],
      feilet: [...ungSak.feilet, ...ungTilbake.feilet],
    };
  }
}
