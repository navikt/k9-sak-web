import type { K9Kodeverkoppslag } from '@k9-sak-web/gui/kodeverk/oppslag/useK9Kodeverkoppslag.js';
import type { HistorikkinnslagDto as K9SakHistorikkinnslagDto } from '@k9-sak-web/backend/k9sak/kontrakt/historikk/HistorikkinnslagDto.js';
import type { HistorikkinnslagDto as K9KlageHistorikkinnslagDto } from '@k9-sak-web/backend/k9klage/kontrakt/historikk/HistorikkinnslagDto.js';
import type { HistorikkinnslagDto as K9TilbakeHistorikkinnslagDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/historikk/HistorikkinnslagDto.js';
import {
  type AktørMedNavn,
  type BeriketHistorikkInnslag,
  dokumentMedServerUrl,
  type SkjermlenkeMedNavn,
} from './HistorikkBackendApi.js';

export class K9HistorikkInnslagBeriker {
  constructor(private kodeverkOppslag: K9Kodeverkoppslag) {}

  readonly serverDokumentEndpoint = '/k9/sak/api/dokument/hent-dokument';

  berikSakInnslag(innslag: K9SakHistorikkinnslagDto, saksnummer: string): BeriketHistorikkInnslag {
    const linjer = innslag.linjer.map(linje => {
      const skjermlenke =
        linje.skjermlenkeType != null
          ? {
              type: linje.skjermlenkeType,
              navn: this.kodeverkOppslag.k9sak.skjermlenkeTyper(linje.skjermlenkeType).navn,
            }
          : undefined;
      return {
        ...linje,
        skjermlenke,
      };
    });
    const aktør = { ...innslag.aktør, navn: this.kodeverkOppslag.k9sak.historikkAktører(innslag.aktør.type).navn };
    const dokumenter = dokumentMedServerUrl(this.serverDokumentEndpoint, saksnummer, innslag);
    return {
      ...innslag,
      linjer,
      aktør,
      dokumenter,
    };
  }

  berikKlageInnslag(innslag: K9KlageHistorikkinnslagDto, saksnummer: string): BeriketHistorikkInnslag {
    const linjer = innslag.linjer.map(linje => {
      const skjermlenke =
        linje.skjermlenkeType != null
          ? {
              type: linje.skjermlenkeType,
              navn: this.kodeverkOppslag.k9klage.skjermlenkeTyper(linje.skjermlenkeType).navn,
            }
          : undefined;
      return {
        ...linje,
        skjermlenke,
      };
    });
    const aktør = { ...innslag.aktør, navn: this.kodeverkOppslag.k9klage.historikkAktører(innslag.aktør.type).navn };
    const dokumenter = dokumentMedServerUrl(this.serverDokumentEndpoint, saksnummer, innslag);
    return {
      ...innslag,
      linjer,
      aktør,
      dokumenter,
    };
  }

  #tilbakeSkjermlenke(innslag: K9TilbakeHistorikkinnslagDto): SkjermlenkeMedNavn | undefined {
    if (innslag.skjermlenke != null) {
      const navn: string =
        this.kodeverkOppslag.k9tilbake.skjermlenkeTyper(innslag.skjermlenke).navn ?? 'FEIL: ukjent skjermlenkenavn';
      return {
        type: innslag.skjermlenke,
        navn,
      };
    }
    return undefined;
  }

  #tilbakeAktør(innslag: K9TilbakeHistorikkinnslagDto): AktørMedNavn {
    const navn =
      this.kodeverkOppslag.k9tilbake.historikkAktører(innslag.aktør.type).navn ??
      this.kodeverkOppslag.k9sak.historikkAktører(innslag.aktør.type, 'or undefined')?.navn ?? // Prøv å slå opp i k9sak sin viss navn ikkje blir funne i k9tilbake oppslag.
      'ukjent aktørnavn';
    return {
      ...innslag.aktør,
      navn,
    };
  }

  berikTilbakeInnslag(innslag: K9TilbakeHistorikkinnslagDto, saksnummer: string): BeriketHistorikkInnslag {
    const skjermlenke = this.#tilbakeSkjermlenke(innslag);
    const aktør = this.#tilbakeAktør(innslag);
    const dokumenter = dokumentMedServerUrl(this.serverDokumentEndpoint, saksnummer, innslag);
    return {
      ...innslag,
      aktør,
      skjermlenke,
      dokumenter,
    };
  }
}
