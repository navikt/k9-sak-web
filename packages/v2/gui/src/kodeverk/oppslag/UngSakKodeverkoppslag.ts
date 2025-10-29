import { type ung_sak_web_app_tjenester_kodeverk_dto_AlleKodeverdierSomObjektResponse } from '@k9-sak-web/backend/ungsak/generated/types.js';
import {
  GeneriskKodeverkoppslag,
  type Kilde,
  type Kodeverkoppslag,
  type OrUndefined,
} from './GeneriskKodeverkoppslag.js';

// Lag type av alle oppslagsobjekt som følger korrekt mønster med å vere ei liste av objekter med kilde property som er ein enum type.
// Utelater avslagårsakerPrVilkårTypeKode sidan den ikkje følger standard mønster, men returnerer eit mapping objekt til array istadenfor liste av objekt.
// Utelater landkoder og språkkoder sidan dei ikkje er definert som enums i backend. Passer derfor ikkje inn i dette systemet.
// Får lage separate mekanismer for disse viss nødvendig.
type EnumKodeverdierOppslag = Omit<
  ung_sak_web_app_tjenester_kodeverk_dto_AlleKodeverdierSomObjektResponse,
  'avslagårsakerPrVilkårTypeKode'
>;

type EO = EnumKodeverdierOppslag; // For å slippe å ha så lange typedefinisjoner i metodesignaturer under her

export class UngSakKodeverkoppslag
  extends GeneriskKodeverkoppslag<EnumKodeverdierOppslag>
  implements Kodeverkoppslag<EnumKodeverdierOppslag>
{
  constructor(alleKodeverdier: ung_sak_web_app_tjenester_kodeverk_dto_AlleKodeverdierSomObjektResponse) {
    super(alleKodeverdier);
  }

  arbeidTyper<U extends OrUndefined = undefined>(kode: Kilde<EO, 'arbeidTyper'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('arbeidTyper', kode, undefinedIfNotFound);
  }

  avslagsårsaker<U extends OrUndefined = undefined>(kode: Kilde<EO, 'avslagsårsaker'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('avslagsårsaker', kode, undefinedIfNotFound);
  }

  behandlingResultatTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'behandlingResultatTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('behandlingResultatTyper', kode, undefinedIfNotFound);
  }

  behandlingStatuser<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'behandlingStatuser'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('behandlingStatuser', kode, undefinedIfNotFound);
  }

  behandlingTyper<U extends OrUndefined = undefined>(kode: Kilde<EO, 'behandlingTyper'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('behandlingTyper', kode, undefinedIfNotFound);
  }

  behandlingÅrsakTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'behandlingÅrsakTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('behandlingÅrsakTyper', kode, undefinedIfNotFound);
  }

  fagsakStatuser<U extends OrUndefined = undefined>(kode: Kilde<EO, 'fagsakStatuser'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('fagsakStatuser', kode, undefinedIfNotFound);
  }

  fagsakYtelseTyper<U extends OrUndefined = undefined>(kode: Kilde<EO, 'fagsakYtelseTyper'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('fagsakYtelseTyper', kode, undefinedIfNotFound);
  }

  fagsystemer<U extends OrUndefined = undefined>(kode: Kilde<EO, 'fagsystemer'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('fagsystemer', kode, undefinedIfNotFound);
  }

  historikkAktører<U extends OrUndefined = undefined>(kode: Kilde<EO, 'historikkAktører'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('historikkAktører', kode, undefinedIfNotFound);
  }

  oppgaveÅrsaker<U extends OrUndefined = undefined>(kode: Kilde<EO, 'oppgaveÅrsaker'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('oppgaveÅrsaker', kode, undefinedIfNotFound);
  }

  revurderingVarslingÅrsaker<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'revurderingVarslingÅrsaker'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('revurderingVarslingÅrsaker', kode, undefinedIfNotFound);
  }

  skjermlenkeTyper<U extends OrUndefined = undefined>(kode: Kilde<EO, 'skjermlenkeTyper'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('skjermlenkeTyper', kode, undefinedIfNotFound);
  }

  språkkoder<U extends OrUndefined = undefined>(kode: Kilde<EO, 'språkkoder'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('språkkoder', kode, undefinedIfNotFound);
  }

  tilbakekrevingVidereBehandlinger<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'tilbakekrevingVidereBehandlinger'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('tilbakekrevingVidereBehandlinger', kode, undefinedIfNotFound);
  }

  vedtakResultatTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'vedtakResultatTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('vedtakResultatTyper', kode, undefinedIfNotFound);
  }

  venteårsaker<U extends OrUndefined = undefined>(kode: Kilde<EO, 'venteårsaker'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('venteårsaker', kode, undefinedIfNotFound);
  }

  vilkårTyper<U extends OrUndefined = undefined>(kode: Kilde<EO, 'vilkårTyper'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('vilkårTyper', kode, undefinedIfNotFound);
  }

  vurderingsÅrsaker<U extends OrUndefined = undefined>(kode: Kilde<EO, 'vurderingsÅrsaker'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('vurderingsÅrsaker', kode, undefinedIfNotFound);
  }

  årsakerTilVurdering<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'årsakerTilVurdering'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('årsakerTilVurdering', kode, undefinedIfNotFound);
  }

  klageMedholdÅrsak<U extends OrUndefined = undefined>(kode: Kilde<EO, 'klageMedholdÅrsak'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('klageMedholdÅrsak', kode, undefinedIfNotFound);
  }

  klageAvvistÅrsaker<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'klageAvvistÅrsaker'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('klageAvvistÅrsaker', kode, undefinedIfNotFound);
  }

  klagevurderingType<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'klagevurderingType'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('klagevurderingType', kode, undefinedIfNotFound);
  }
}

/**
 * Brukast som standardverdi for UngKodeverkoppslagContext, før faktisk kodeverkoppslag er lasta inn.
 * Slik at UngKodeverkoppslagContext aldri er undefined. Så lenge implementasjonen av initialisering av context er korrekt
 * og ikkje anna kritisk feil har oppstått skal denne aldri blir brukt. Alle evt oppslagskall til denne vil feile.
 */
export class FailingUngSakKodeverkoppslag extends UngSakKodeverkoppslag {
  constructor() {
    super({} as ung_sak_web_app_tjenester_kodeverk_dto_AlleKodeverdierSomObjektResponse);
  }
}
