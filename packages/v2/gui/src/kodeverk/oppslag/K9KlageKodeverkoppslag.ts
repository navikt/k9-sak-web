import type { AlleKodeverdierSomObjektResponse } from '@k9-sak-web/backend/k9klage/generated/types.js';
import {
  GeneriskKodeverkoppslag,
  type Kodeverkoppslag,
  type OrUndefined,
  type Kilde,
} from './GeneriskKodeverkoppslag.js';

type EnumKodeverdierOppslag = Omit<AlleKodeverdierSomObjektResponse, 'landkoder' | 'språkkoder'>;

type EO = EnumKodeverdierOppslag;

export class K9KlageKodeverkoppslag
  extends GeneriskKodeverkoppslag<EnumKodeverdierOppslag>
  implements Kodeverkoppslag<EnumKodeverdierOppslag>
{
  constructor(alleKodeverdier: AlleKodeverdierSomObjektResponse) {
    super(alleKodeverdier);
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

  klageAvvistÅrsaker<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'klageAvvistÅrsaker'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('klageAvvistÅrsaker', kode, undefinedIfNotFound);
  }

  klageMedholdÅrsaker<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'klageMedholdÅrsaker'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('klageMedholdÅrsaker', kode, undefinedIfNotFound);
  }

  oppgaveÅrsaker<U extends OrUndefined = undefined>(kode: Kilde<EO, 'oppgaveÅrsaker'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('oppgaveÅrsaker', kode, undefinedIfNotFound);
  }

  personstatusTyper<U extends OrUndefined = undefined>(kode: Kilde<EO, 'personstatusTyper'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('personstatusTyper', kode, undefinedIfNotFound);
  }

  regioner<U extends OrUndefined = undefined>(kode: Kilde<EO, 'regioner'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('regioner', kode, undefinedIfNotFound);
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

  vedtakResultatTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'vedtakResultatTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('vedtakResultatTyper', kode, undefinedIfNotFound);
  }

  venteårsaker<U extends OrUndefined = undefined>(kode: Kilde<EO, 'venteårsaker'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('venteårsaker', kode, undefinedIfNotFound);
  }

  vurderingsÅrsaker<U extends OrUndefined = undefined>(kode: Kilde<EO, 'vurderingsÅrsaker'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('vurderingsÅrsaker', kode, undefinedIfNotFound);
  }
}

/**
 * Brukast som standardverdi for K9KodeverkoppslagContext, før faktisk kodeverkoppslag er lasta inn.
 * Slik at K9KodeverkoppslagContext aldri er undefined. Så lenge implementasjonen av initialisering av context er korrekt
 * og ikkje anna kritisk feil har oppstått skal denne aldri blir brukt. Alle evt oppslagskall til denne vil feile.
 */
export class FailingK9KlageKodeverkoppslag extends K9KlageKodeverkoppslag {
  constructor() {
    super({} as AlleKodeverdierSomObjektResponse);
  }

  override finnObjektFraKilde(kodeverk: keyof EnumKodeverdierOppslag, kode: string): never {
    throw new Error(`K9KlageKodeverkoppslag er ikke initialisert. Kan ikke slå opp ${kodeverk} med kode ${kode}.`);
  }
}
