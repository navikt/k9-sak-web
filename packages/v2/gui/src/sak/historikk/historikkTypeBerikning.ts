import type { k9_sak_web_app_tjenester_behandling_historikk_v2_HistorikkinnslagDtoV2 as HistorikkinnslagDtoV2 } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { k9_klage_kontrakt_historikk_v2_HistorikkinnslagDtoV2 as K9KlageHistorikkinnslagDtoV2 } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { foreldrepenger_tilbakekreving_historikk_HistorikkinnslagDto as K9TilbakeHistorikkinnslagDto } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import type { k9_sak_web_app_tjenester_behandling_historikk_v2_HistorikkinnslagDtoV2_Linje as GeneratedK9SakLinje } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { k9_klage_kontrakt_historikk_v2_HistorikkinnslagDtoV2_Linje as GeneratedK9KlageLinje } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { foreldrepenger_tilbakekreving_historikk_HistorikkinnslagDto_Linje as GeneratedK9TilbakeLinje } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import type {
  k9_sak_web_app_tjenester_kodeverk_dto_KodeverdiSomObjektK9_kodeverk_behandling_aksjonspunkt_SkjermlenkeType as K9SakKodeverdiSomObjektSkjermlenkeType,
  k9_sak_web_app_tjenester_kodeverk_dto_KodeverdiSomObjektK9_kodeverk_historikk_HistorikkAktør as K9SakKodeverdiSomObjektHistorikkAktør,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type {
  k9_klage_web_app_tjenester_kodeverk_dto_KodeverdiSomObjektK9_klage_kodeverk_behandling_aksjonspunkt_SkjermlenkeType as K9KlageKodeverdiSomObjektSkjermlenkeType,
  k9_klage_web_app_tjenester_kodeverk_dto_KodeverdiSomObjektK9_klage_kodeverk_historikk_HistorikkAktør as K9KlageKodeverdiSomObjektHistorikkAktør,
} from '@k9-sak-web/backend/k9klage/generated/types.js';
import {
  type foreldrepenger_tilbakekreving_web_app_tjenester_kodeverk_dto_KodeverdiSomObjektForeldrepenger_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType as K9TilbakeKodeverdiSomObjektSkjermlenkeType,
  type foreldrepenger_tilbakekreving_web_app_tjenester_kodeverk_dto_KodeverdiSomObjektForeldrepenger_tilbakekreving_behandlingslager_historikk_HistorikkAktør as K9TilbakeKodeverdiSomObjektHistorikkAktør,
  type foreldrepenger_tilbakekreving_historikk_HistorikkinnslagDto_HistorikkAktørDto,
} from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import type { K9Kodeverkoppslag } from '../../kodeverk/oppslag/useK9Kodeverkoppslag.js';

// Denne fila beriker genererte historikk dto typer slik at dei fungerer betre i frontend.

// Erstatter linje.skjermlenkeType enum med kodeverkoppslag
export type K9SakHistorikkLinje = Omit<GeneratedK9SakLinje, 'skjermlenkeType'> & {
  readonly skjermlenkeType?: K9SakKodeverdiSomObjektSkjermlenkeType;
};
// Erstatter linje.skjermlenkeType enum med kodeverkoppslag
export type K9KlageHistorikkLinje = Omit<GeneratedK9KlageLinje, 'skjermlenkeType'> & {
  readonly skjermlenkeType?: K9KlageKodeverdiSomObjektSkjermlenkeType;
};

export type NyHistorikkLinje = K9SakHistorikkLinje | K9KlageHistorikkLinje | GeneratedK9TilbakeLinje;

// Erstatter aktør.type enum med kodeverkoppslag
type K9SakHistorikkAktør = Omit<HistorikkinnslagDtoV2['aktør'], 'type'> & {
  readonly type: K9SakKodeverdiSomObjektHistorikkAktør;
};
// Erstatter aktør.type enum med kodeverkoppslag
type K9KlageHistorikkAktør = Omit<K9KlageHistorikkinnslagDtoV2['aktør'], 'type'> & {
  readonly type: K9KlageKodeverdiSomObjektHistorikkAktør;
};

type K9TilbakeHistorikkAktør = Omit<
  foreldrepenger_tilbakekreving_historikk_HistorikkinnslagDto_HistorikkAktørDto,
  'type'
> & {
  readonly type: K9TilbakeKodeverdiSomObjektHistorikkAktør;
};

// Erstatter linjer og aktør med berika typer der det trengs
export type SakHistorikkInnslagV2 = Omit<HistorikkinnslagDtoV2, 'linjer' | 'aktør'> & {
  readonly linjer: K9SakHistorikkLinje[];
  readonly aktør: K9SakHistorikkAktør;
};
export type KlageHistorikkInnslagV2 = Omit<K9KlageHistorikkinnslagDtoV2, 'linjer' | 'aktør'> & {
  readonly linjer: K9KlageHistorikkLinje[];
  readonly aktør: K9KlageHistorikkAktør;
};
export type TilbakeHistorikkInnslagV2 = Omit<K9TilbakeHistorikkinnslagDto, 'aktør' | 'skjermlenke'> & {
  readonly aktør: K9TilbakeHistorikkAktør;
  readonly skjermlenke?: K9TilbakeKodeverdiSomObjektSkjermlenkeType;
};

export type NyeUlikeHistorikkinnslagTyper = SakHistorikkInnslagV2 | KlageHistorikkInnslagV2 | TilbakeHistorikkInnslagV2;

export class HistorikkInnslagTypeBeriker {
  constructor(private kodeverkoppslag: K9Kodeverkoppslag) {}

  // for k9-sak historikk innslag: Utled kodeverk for skjermlenketype på linjer, sett på backend flagg
  sakHistorikkInnslagV2(innslag: HistorikkinnslagDtoV2): SakHistorikkInnslagV2 {
    const linjer: K9SakHistorikkLinje[] = innslag.linjer.map(l => {
      const skjermlenkeType =
        l.skjermlenkeType != null ? this.kodeverkoppslag.k9sak.skjermlenkeTyper(l.skjermlenkeType) : undefined;
      return { ...l, skjermlenkeType };
    });
    const aktør = {
      ...innslag.aktør,
      type: this.kodeverkoppslag.k9sak.historikkAktører(innslag.aktør.type),
    };
    return {
      ...innslag,
      linjer,
      aktør,
    };
  }

  // for k9-klage historikk innslag: Utled kodeverk for skjermlenketype på linjer, sett på backend flagg
  klageHistorikkInnslagV2(innslag: K9KlageHistorikkinnslagDtoV2): KlageHistorikkInnslagV2 {
    const linjer = innslag.linjer.map(l => {
      const skjermlenkeType =
        l.skjermlenkeType != null ? this.kodeverkoppslag.k9klage.skjermlenkeTyper(l.skjermlenkeType) : undefined;
      return { ...l, skjermlenkeType };
    });
    const aktør = {
      ...innslag.aktør,
      type: this.kodeverkoppslag.k9klage.historikkAktører(innslag.aktør.type),
    };
    return {
      ...innslag,
      linjer,
      aktør,
    };
  }

  // for k9-tilbake historikk innslag: Utled kodeverk for skjermlenketype, sett på backend flagg
  tilbakeHistorikkInnslagV2(innslag: K9TilbakeHistorikkinnslagDto): TilbakeHistorikkInnslagV2 {
    const aktør: K9TilbakeHistorikkAktør = {
      ...innslag.aktør,
      type: this.kodeverkoppslag.k9tilbake.historikkAktører(innslag.aktør.type),
    };
    const skjermlenke =
      innslag.skjermlenke != null ? this.kodeverkoppslag.k9tilbake.skjermlenkeTyper(innslag.skjermlenke) : undefined;
    return {
      ...innslag,
      aktør,
      skjermlenke,
    };
  }
}
