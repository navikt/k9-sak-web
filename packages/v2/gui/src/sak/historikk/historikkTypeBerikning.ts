import type { k9_sak_web_app_tjenester_behandling_historikk_v2_HistorikkinnslagDtoV2 as HistorikkinnslagDtoV2 } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { k9_klage_kontrakt_historikk_v2_HistorikkinnslagDtoV2 as K9KlageHistorikkinnslagDtoV2 } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { HistorikkinnslagV2 as TilbakeHistorikkinnslagV2 } from '@k9-sak-web/gui/sak/historikk/tilbake/historikkinnslagTsTypeV2.js';
import type { k9_sak_web_app_tjenester_behandling_historikk_v2_HistorikkinnslagDtoV2_Linje as GeneratedK9SakLinje } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { k9_klage_kontrakt_historikk_v2_HistorikkinnslagDtoV2_Linje as GeneratedK9KlageLinje } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type {
  k9_sak_web_app_tjenester_kodeverk_dto_KodeverdiSomObjektK9_kodeverk_behandling_aksjonspunkt_SkjermlenkeType as K9SakKodeverdiSomObjektSkjermlenkeType,
  k9_sak_web_app_tjenester_kodeverk_dto_KodeverdiSomObjektK9_kodeverk_historikk_HistorikkAktør as K9SakKodeverdiSomObjektHistorikkAktør,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type {
  k9_klage_web_app_tjenester_kodeverk_dto_KodeverdiSomObjektK9_klage_kodeverk_behandling_aksjonspunkt_SkjermlenkeType as K9KlageKodeverdiSomObjektSkjermlenkeType,
  k9_klage_web_app_tjenester_kodeverk_dto_KodeverdiSomObjektK9_klage_kodeverk_historikk_HistorikkAktør as K9KlageKodeverdiSomObjektHistorikkAktør,
} from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { K9Kodeverkoppslag } from '../../kodeverk/oppslag/useK9Kodeverkoppslag.js';

// Denne fila beriker genererte historikk dto typer slik at dei fungerer betre i frontend.

type ErSak = {
  erKlage?: never;
  erTilbakekreving?: never;
  erSak: boolean;
};

type ErKlage = {
  erKlage: boolean;
  erTilbakekreving?: never;
  erSak?: never;
};

type ErTilbakekreving = {
  erKlage?: never;
  erTilbakekreving: boolean;
  erSak?: never;
};

// Erstatter linje.skjermlenkeType enum med kodeverkoppslag
export type K9SakHistorikkLinje = Omit<GeneratedK9SakLinje, 'skjermlenkeType'> &
  ErSak & {
    readonly skjermlenkeType?: K9SakKodeverdiSomObjektSkjermlenkeType;
  };
// Erstatter linje.skjermlenkeType enum med kodeverkoppslag
export type K9KlageHistorikkLinje = Omit<GeneratedK9KlageLinje, 'skjermlenkeType'> &
  ErKlage & {
    readonly skjermlenkeType?: K9KlageKodeverdiSomObjektSkjermlenkeType;
  };

export type NyHistorikkLinje = K9SakHistorikkLinje | K9KlageHistorikkLinje;

// Erstatter aktør.type enum med kodeverkoppslag
type K9SakHistorikkAktør = Omit<HistorikkinnslagDtoV2['aktør'], 'type'> & {
  readonly type: K9SakKodeverdiSomObjektHistorikkAktør;
};
// Erstatter aktør.type enum med kodeverkoppslag
type K9KlageHistorikkAktør = Omit<K9KlageHistorikkinnslagDtoV2['aktør'], 'type'> & {
  readonly type: K9KlageKodeverdiSomObjektHistorikkAktør;
};

// Erstatter linjer og aktør med berika typer
export type SakHistorikkInnslagV2 = Omit<HistorikkinnslagDtoV2, 'linjer' | 'aktør'> &
  ErSak & {
    readonly linjer: K9SakHistorikkLinje[];
    readonly aktør: K9SakHistorikkAktør;
  };
// Erstatter linjer og aktør med berika typer
export type KlageHistorikkInnslagV2 = Omit<K9KlageHistorikkinnslagDtoV2, 'linjer' | 'aktør'> &
  ErKlage & {
    readonly linjer: K9KlageHistorikkLinje[];
    readonly aktør: K9KlageHistorikkAktør;
  };

export type TilbakeHistorikkInnslagV2 = TilbakeHistorikkinnslagV2 & ErTilbakekreving;

export type NyeUlikeHistorikkinnslagTyper = SakHistorikkInnslagV2 | KlageHistorikkInnslagV2 | TilbakeHistorikkInnslagV2;

export class HistorikkInnslagTypeBeriker {
  constructor(private kodeverkoppslag: K9Kodeverkoppslag) {}

  // for k9-sak historikk innslag: Utled kodeverk for skjermlenketype på linjer, sett på backend flagg
  sakHistorikkInnslagV2(innslag: HistorikkinnslagDtoV2): SakHistorikkInnslagV2 {
    const linjer: K9SakHistorikkLinje[] = innslag.linjer.map(l => {
      const skjermlenkeType =
        l.skjermlenkeType != null ? this.kodeverkoppslag.k9sak.skjermlenkeTyper(l.skjermlenkeType) : undefined;
      return { ...l, skjermlenkeType, erSak: true };
    });
    const aktør = {
      ...innslag.aktør,
      type: this.kodeverkoppslag.k9sak.historikkAktører(innslag.aktør.type),
    };
    return {
      ...innslag,
      erSak: true,
      linjer,
      aktør,
    };
  }

  // for k9-klage historikk innslag: Utled kodeverk for skjermlenketype på linjer, sett på backend flagg
  klageHistorikkInnslagV2(innslag: K9KlageHistorikkinnslagDtoV2): KlageHistorikkInnslagV2 {
    const linjer = innslag.linjer.map(l => {
      const skjermlenkeType =
        l.skjermlenkeType != null ? this.kodeverkoppslag.k9klage.skjermlenkeTyper(l.skjermlenkeType) : undefined;
      return { ...l, skjermlenkeType, erKlage: true };
    });
    const aktør = {
      ...innslag.aktør,
      type: this.kodeverkoppslag.k9klage.historikkAktører(innslag.aktør.type),
    };
    return {
      ...innslag,
      erKlage: true,
      linjer,
      aktør,
    };
  }
}
