import type { k9_sak_web_app_tjenester_behandling_historikk_v2_HistorikkinnslagDtoV2 as K9SakHistorikkinnslagDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { k9_klage_kontrakt_historikk_v2_HistorikkinnslagDtoV2 as K9KlageHistorikkinnslagDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { foreldrepenger_tilbakekreving_historikk_HistorikkinnslagDto as K9TilbakeHistorikkinnslagDto } from '@k9-sak-web/backend/k9tilbake/generated/types.js';

import type { K9Kodeverkoppslag } from '../../kodeverk/oppslag/useK9Kodeverkoppslag.js';

import type {
  HistorikkInnslagDto,
  HistorikkInnslagDtoLinje,
} from '@k9-sak-web/backend/combined/kontrakt/historikk/HistorikkInnslagDto.js';
import type { SkjermlenkeType } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/SkjermlenkeType.js';

// Denne fila beriker genererte historikk dto typer slik at dei fungerer betre i frontend (unngår masse kodeverk oppslag der).
// Lager "berikede" type der skjermlenke og aktør fra server får lagt til navn fra kodeverkoppslag.
export type SkjermlenkeMedNavn = Readonly<{
  type: SkjermlenkeType;
  navn: string;
}>;

export type AktørMedNavn = HistorikkInnslagDto['aktør'] &
  Readonly<{
    navn: string;
  }>;

export type BeriketHistorikkInnslagLinje = Omit<HistorikkInnslagDtoLinje, 'skjermlenke'> &
  Readonly<{
    skjermlenke?: SkjermlenkeMedNavn;
  }>;

export type BeriketHistorikkInnslag = Omit<HistorikkInnslagDto, 'skjermlenke'> &
  Readonly<{
    aktør: AktørMedNavn;
    skjermlenke?: SkjermlenkeMedNavn;
  }>;

export class K9HistorikkInnslagBeriker {
  constructor(private kodeverkOppslag: K9Kodeverkoppslag) {}

  berikSakInnslag(innslag: K9SakHistorikkinnslagDto): BeriketHistorikkInnslag {
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
    return {
      ...innslag,
      linjer,
      aktør,
    };
  }

  berikKlageInnslag(innslag: K9KlageHistorikkinnslagDto): BeriketHistorikkInnslag {
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
    return {
      ...innslag,
      linjer,
      aktør,
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

  berikTilbakeInnslag(innslag: K9TilbakeHistorikkinnslagDto): BeriketHistorikkInnslag {
    const skjermlenke = this.#tilbakeSkjermlenke(innslag);
    const aktør = this.#tilbakeAktør(innslag);
    return {
      ...innslag,
      aktør,
      skjermlenke,
    };
  }
}
