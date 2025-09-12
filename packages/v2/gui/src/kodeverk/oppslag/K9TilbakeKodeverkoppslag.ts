import type { foreldrepenger_tilbakekreving_web_app_tjenester_kodeverk_dto_AlleKodeverdierSomObjektResponse } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import {
  GeneriskKodeverkoppslag,
  type Kodeverkoppslag,
  type OrUndefined,
  type Kilde,
} from './GeneriskKodeverkoppslag.js';

type EO = foreldrepenger_tilbakekreving_web_app_tjenester_kodeverk_dto_AlleKodeverdierSomObjektResponse;

export class K9TilbakeKodeverkoppslag extends GeneriskKodeverkoppslag<EO> implements Kodeverkoppslag<EO> {
  constructor(alleKodeverdier: EO) {
    super(alleKodeverdier);
  }

  aktsomheter<U extends OrUndefined = undefined>(kode: Kilde<EO, 'aktsomheter'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('aktsomheter', kode, undefinedIfNotFound);
  }

  annenVurderinger<U extends OrUndefined = undefined>(kode: Kilde<EO, 'annenVurderinger'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('annenVurderinger', kode, undefinedIfNotFound);
  }

  behandlingResultatTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'behandlingResultatTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('behandlingResultatTyper', kode, undefinedIfNotFound);
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

  fagsystemer<U extends OrUndefined = undefined>(kode: Kilde<EO, 'fagsystemer'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('fagsystemer', kode, undefinedIfNotFound);
  }

  foreldelseVurderingTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'foreldelseVurderingTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('foreldelseVurderingTyper', kode, undefinedIfNotFound);
  }

  hendelseTyper<U extends OrUndefined = undefined>(kode: Kilde<EO, 'hendelseTyper'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('hendelseTyper', kode, undefinedIfNotFound);
  }

  hendelseUnderTyper<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'hendelseUnderTyper'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('hendelseUnderTyper', kode, undefinedIfNotFound);
  }

  historikkAktører<U extends OrUndefined = undefined>(kode: Kilde<EO, 'historikkAktører'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('historikkAktører', kode, undefinedIfNotFound);
  }

  skjermlenkeTyper<U extends OrUndefined = undefined>(kode: Kilde<EO, 'skjermlenkeTyper'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('skjermlenkeTyper', kode, undefinedIfNotFound);
  }

  særligGrunner<U extends OrUndefined = undefined>(kode: Kilde<EO, 'særligGrunner'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('særligGrunner', kode, undefinedIfNotFound);
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

  vergeTyper<U extends OrUndefined = undefined>(kode: Kilde<EO, 'vergeTyper'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('vergeTyper', kode, undefinedIfNotFound);
  }

  videreBehandlinger<U extends OrUndefined = undefined>(
    kode: Kilde<EO, 'videreBehandlinger'>,
    undefinedIfNotFound?: U,
  ) {
    return this.finnObjektFraKilde('videreBehandlinger', kode, undefinedIfNotFound);
  }

  vilkårResultater<U extends OrUndefined = undefined>(kode: Kilde<EO, 'vilkårResultater'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('vilkårResultater', kode, undefinedIfNotFound);
  }

  vurderÅrsaker<U extends OrUndefined = undefined>(kode: Kilde<EO, 'vurderÅrsaker'>, undefinedIfNotFound?: U) {
    return this.finnObjektFraKilde('vurderÅrsaker', kode, undefinedIfNotFound);
  }
}

/**
 * Brukast som standardverdi for K9KodeverkoppslagContext, før faktisk kodeverkoppslag er lasta inn.
 * Slik at K9KodeverkoppslagContext aldri er undefined. Så lenge implementasjonen av initialisering av context er korrekt
 * og ikkje anna kritisk feil har oppstått skal denne aldri blir brukt. Alle evt oppslagskall til denne vil feile.
 */
export class FailingK9TilbakeKodeverkoppslag extends K9TilbakeKodeverkoppslag {
  constructor() {
    super({} as EO);
  }

  override finnObjektFraKilde(kodeverk: keyof EO, kode: string): never {
    throw new Error(`K9TilbakeKodeverkoppslag er ikke initialisert. Kan ikke slå opp ${kodeverk} med kode ${kode}.`);
  }
}
