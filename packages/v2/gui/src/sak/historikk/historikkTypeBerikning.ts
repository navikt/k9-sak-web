import type { k9_sak_web_app_tjenester_behandling_historikk_v2_HistorikkinnslagDtoV2 as K9SakHistorikkinnslagDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { k9_klage_kontrakt_historikk_v2_HistorikkinnslagDtoV2 as K9KlageHistorikkinnslagDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { foreldrepenger_tilbakekreving_historikk_HistorikkinnslagDto as K9TilbakeHistorikkinnslagDto } from '@k9-sak-web/backend/k9tilbake/generated/types.js';

import type { K9Kodeverkoppslag } from '../../kodeverk/oppslag/useK9Kodeverkoppslag.js';

import type {
  HistorikkInnslagDto,
  HistorikkInnslagDtoLinje,
} from '@k9-sak-web/backend/combined/kontrakt/historikk/HistorikkInnslagDto.js';

// Denne fila beriker genererte historikk dto typer slik at dei fungerer betre i frontend (unngår masse kodeverk oppslag der).
export type BeriketHistorikkInnslagLinje = HistorikkInnslagDtoLinje &
  Readonly<{
    skjermlenkeNavn?: string;
  }>;

export type BeriketHistorikkInnslag = HistorikkInnslagDto &
  Readonly<{
    aktørNavn: string;
    skjermlenkeNavn?: string;
  }>;

export class K9HistorikkInnslagBeriker {
  constructor(private kodeverkOppslag: K9Kodeverkoppslag) {}

  berikSakInnslag(innslag: K9SakHistorikkinnslagDto): BeriketHistorikkInnslag {
    const linjer = innslag.linjer.map(linje => {
      const skjermlenkeNavn =
        linje.skjermlenkeType != null
          ? this.kodeverkOppslag.k9sak.skjermlenkeTyper(linje.skjermlenkeType).navn
          : undefined;
      return {
        ...linje,
        skjermlenkeNavn,
      };
    });
    const aktørNavn = this.kodeverkOppslag.k9sak.historikkAktører(innslag.aktør.type).navn;
    return {
      ...innslag,
      linjer,
      aktørNavn,
    };
  }

  berikKlageInnslag(innslag: K9KlageHistorikkinnslagDto): BeriketHistorikkInnslag {
    const linjer = innslag.linjer.map(linje => {
      const skjermlenkeNavn =
        linje.skjermlenkeType != null
          ? this.kodeverkOppslag.k9klage.skjermlenkeTyper(linje.skjermlenkeType).navn
          : undefined;
      return {
        ...linje,
        skjermlenkeNavn,
      };
    });
    const aktørNavn = this.kodeverkOppslag.k9klage.historikkAktører(innslag.aktør.type).navn;
    return {
      ...innslag,
      linjer,
      aktørNavn,
    };
  }

  berikTilbakeInnslag(innslag: K9TilbakeHistorikkinnslagDto): BeriketHistorikkInnslag {
    const skjermlenkeNavn =
      innslag.skjermlenke != null
        ? this.kodeverkOppslag.k9tilbake.skjermlenkeTyper(innslag.skjermlenke).navn
        : undefined;
    const aktørNavn =
      this.kodeverkOppslag.k9tilbake.historikkAktører(innslag.aktør.type).navn ??
      this.kodeverkOppslag.k9sak.historikkAktører(innslag.aktør.type, 'or undefined')?.navn ?? // Prøv å slå opp i k9sak sin viss navn ikkje blir funne i k9tilbake oppslag.
      'ukjent aktørnavn';
    return {
      ...innslag,
      aktørNavn,
      skjermlenkeNavn,
    };
  }
}
