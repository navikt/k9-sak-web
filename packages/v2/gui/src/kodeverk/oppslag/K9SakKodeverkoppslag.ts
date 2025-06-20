import { type AlleKodeverdierSomObjektResponse } from '@k9-sak-web/backend/k9sak/generated';
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
  AlleKodeverdierSomObjektResponse,
  'avslagårsakerPrVilkårTypeKode' | 'landkoder' | 'språkkoder'
>;

type EO = EnumKodeverdierOppslag; // For å slippe å ha så lange typedefinisjoner i metodesignaturer under her

export class K9SakKodeverkoppslag
  extends GeneriskKodeverkoppslag<EnumKodeverdierOppslag>
  implements Kodeverkoppslag<EnumKodeverdierOppslag>
{
  constructor(alleKodeverdier: AlleKodeverdierSomObjektResponse) {
    super(alleKodeverdier);
  }

  arbeidTyper<U extends OrUndefined = undefined>(kode: Kilde<EO, 'arbeidTyper'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('arbeidTyper', kode, undefinedIfNotFound);
  }

  aktivitetStatuser<U extends OrUndefined = undefined>(kode: Kilde<EO, 'aktivitetStatuser'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('aktivitetStatuser', kode, undefinedIfNotFound);
  }

  arbeidsforholdHandlingTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'arbeidsforholdHandlingTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('arbeidsforholdHandlingTyper', kode, undefinedIfNotFound);
  }

  arbeidskategorier<U extends OrUndefined = undefined>(kode: Kilde<EO, 'arbeidskategorier'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('arbeidskategorier', kode, undefinedIfNotFound);
  }

  avslagsårsaker<U extends OrUndefined = undefined>(kode: Kilde<EO, 'avslagsårsaker'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('avslagsårsaker', kode, undefinedIfNotFound);
  }

  behandlingMerknadTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'behandlingMerknadTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('behandlingMerknadTyper', kode, undefinedIfNotFound);
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

  dokumentTypeIder<U extends OrUndefined = undefined>(kode: Kilde<EO, 'dokumentTypeIder'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('dokumentTypeIder', kode, undefinedIfNotFound);
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

  faktaOmBeregningTilfeller<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'faktaOmBeregningTilfeller'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('faktaOmBeregningTilfeller', kode, undefinedIfNotFound);
  }

  historikkAktører<U extends OrUndefined = undefined>(kode: Kilde<EO, 'historikkAktører'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('historikkAktører', kode, undefinedIfNotFound);
  }

  historikkAvklartSoeknadsperiodeTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'historikkAvklartSoeknadsperiodeTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('historikkAvklartSoeknadsperiodeTyper', kode, undefinedIfNotFound);
  }

  historikkBegrunnelseTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'historikkBegrunnelseTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('historikkBegrunnelseTyper', kode, undefinedIfNotFound);
  }

  historikkEndretFeltTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'historikkEndretFeltTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('historikkEndretFeltTyper', kode, undefinedIfNotFound);
  }

  historikkEndretFeltVerdiTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'historikkEndretFeltVerdiTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('historikkEndretFeltVerdiTyper', kode, undefinedIfNotFound);
  }

  historikkOpplysningTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'historikkOpplysningTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('historikkOpplysningTyper', kode, undefinedIfNotFound);
  }

  historikkResultatTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'historikkResultatTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('historikkResultatTyper', kode, undefinedIfNotFound);
  }

  historikkinnslagTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'historikkinnslagTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('historikkinnslagTyper', kode, undefinedIfNotFound);
  }

  inntektskategorier<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'inntektskategorier'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('inntektskategorier', kode, undefinedIfNotFound);
  }

  medlemskapDekningTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'medlemskapDekningTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('medlemskapDekningTyper', kode, undefinedIfNotFound);
  }

  medlemskapManuellVurderingTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'medlemskapManuellVurderingTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('medlemskapManuellVurderingTyper', kode, undefinedIfNotFound);
  }

  medlemskapTyper<U extends OrUndefined = undefined>(kode: Kilde<EO, 'medlemskapTyper'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('medlemskapTyper', kode, undefinedIfNotFound);
  }

  oppgaveÅrsaker<U extends OrUndefined = undefined>(kode: Kilde<EO, 'oppgaveÅrsaker'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('oppgaveÅrsaker', kode, undefinedIfNotFound);
  }

  opptjeningAktivitetTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'opptjeningAktivitetTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('opptjeningAktivitetTyper', kode, undefinedIfNotFound);
  }

  permisjonsbeskrivelseTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'permisjonsbeskrivelseTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('permisjonsbeskrivelseTyper', kode, undefinedIfNotFound);
  }

  personstatusTyper<U extends OrUndefined = undefined>(kode: Kilde<EO, 'personstatusTyper'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('personstatusTyper', kode, undefinedIfNotFound);
  }

  regioner<U extends OrUndefined = undefined>(kode: Kilde<EO, 'regioner'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('regioner', kode, undefinedIfNotFound);
  }

  relatertYtelseTilstander<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'relatertYtelseTilstander'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('relatertYtelseTilstander', kode, undefinedIfNotFound);
  }

  revurderingVarslingÅrsaker<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'revurderingVarslingÅrsaker'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('revurderingVarslingÅrsaker', kode, undefinedIfNotFound);
  }

  sivilstandTyper<U extends OrUndefined = undefined>(kode: Kilde<EO, 'sivilstandTyper'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('sivilstandTyper', kode, undefinedIfNotFound);
  }

  skjermlenkeTyper<U extends OrUndefined = undefined>(kode: Kilde<EO, 'skjermlenkeTyper'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('skjermlenkeTyper', kode, undefinedIfNotFound);
  }

  tilbakekrevingVidereBehandlinger<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'tilbakekrevingVidereBehandlinger'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('tilbakekrevingVidereBehandlinger', kode, undefinedIfNotFound);
  }

  utenlandsoppholdÅrsaker<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'utenlandsoppholdÅrsaker'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('utenlandsoppholdÅrsaker', kode, undefinedIfNotFound);
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

  vurderArbeidsforholdHistorikkinnslag<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'vurderArbeidsforholdHistorikkinnslag'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('vurderArbeidsforholdHistorikkinnslag', kode, undefinedIfNotFound);
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
}

/**
 * Brukast som standardverdi for K9KodeverkoppslagContext, før faktisk kodeverkoppslag er lasta inn.
 * Slik at K9KodeverkoppslagContext aldri er undefined. Så lenge implementasjonen av initialisering av context er korrekt
 * og ikkje anna kritisk feil har oppstått skal denne aldri blir brukt. Alle evt oppslagskall til denne vil feile.
 */
export class FailingK9SakKodeverkoppslag extends K9SakKodeverkoppslag {
  constructor() {
    super({} as AlleKodeverdierSomObjektResponse);
  }
}
