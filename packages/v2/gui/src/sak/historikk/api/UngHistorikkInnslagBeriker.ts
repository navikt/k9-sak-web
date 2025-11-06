import type { UngKodeverkoppslag } from '../../../kodeverk/oppslag/useUngKodeverkoppslag.js';
import type { BeriketHistorikkInnslag } from './HistorikkBackendApi.js';
import type { HistorikkinnslagDto as UngSakHistorikkinnslagDto } from '@k9-sak-web/backend/ungsak/kontrakt/historikk/HistorikkinnslagDto.js';
import type { HistorikkinnslagDto as UngTilbakeHistorikkinnslagDto } from '@k9-sak-web/backend/ungtilbake/kontrakt/historikk/HistorikkinnslagDto.js';

export class UngHistorikkInnslagBeriker {
  #kodeverkoppslag: UngKodeverkoppslag;
  constructor(kodeverkOppslag: UngKodeverkoppslag) {
    this.#kodeverkoppslag = kodeverkOppslag;
  }

  berikSakInnslag(innslag: UngSakHistorikkinnslagDto): BeriketHistorikkInnslag {
    const aktør = { ...innslag.aktør, navn: this.#kodeverkoppslag.ungSak.historikkAktører(innslag.aktør.type).navn };
    const skjermlenke =
      innslag.skjermlenke != null
        ? {
            type: innslag.skjermlenke,
            navn: this.#kodeverkoppslag.ungSak.skjermlenkeTyper(innslag.skjermlenke).navn,
          }
        : undefined;
    return {
      ...innslag,
      aktør,
      skjermlenke,
    };
  }

  berikTilbakeInnslag(innslag: UngTilbakeHistorikkinnslagDto): BeriketHistorikkInnslag {
    const aktør = {
      ...innslag.aktør,
      navn: this.#kodeverkoppslag.ungTilbake.historikkAktører(innslag.aktør.type).navn,
    };
    const skjermlenke =
      innslag.skjermlenke != null
        ? {
            type: innslag.skjermlenke,
            navn: this.#kodeverkoppslag.ungTilbake.skjermlenkeTyper(innslag.skjermlenke).navn,
          }
        : undefined;
    return {
      ...innslag,
      aktør,
      skjermlenke,
    };
  }
}
