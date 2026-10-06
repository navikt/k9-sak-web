import type { VilkårType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AvkortingsperioderResponse } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/AvkortingsperioderResponse.js';
import type { AktivitetspengerApi } from '../../prosess/aktivitetspenger-prosess/AktivitetspengerApi';

export class FakeAktivitetspengerApi implements AktivitetspengerApi {
  readonly backend = 'ungsak' as const;

  async getAksjonspunkter() {
    return [];
  }

  async lagreAksjonspunkt() {
    return undefined;
  }

  async lagreAksjonspunktOverstyr() {
    return undefined;
  }

  async getVilkår() {
    return [];
  }

  async getBehandling(): Promise<never> {
    throw new Error('Not implemented');
  }

  async hentLovligeBehandlingsoperasjoner(behandlingUuid: string) {
    return {
      uuid: behandlingUuid,
    };
  }

  async hentBehandlingMidlertidigStatus(): Promise<never> {
    throw new Error('Not implemented');
  }

  async hentMedlemskapFraSøknad() {
    return { perioder: [] };
  }

  async hentBostedGrunnlag() {
    return { perioder: [] };
  }

  async hentVilkårsavklaringer(_behandlingUuid: string, vilkarType: VilkårType) {
    return { avklaringer: [], vilkårType: vilkarType };
  }

  async hentVilkårsavklaringVurderinger(_behandlingUuid: string, vilkarType: VilkårType) {
    return { perioder: [], vilkårType: vilkarType };
  }

  async getBeregningsgrunnlag(): Promise<never> {
    throw new Error('Not implemented');
  }

  async getInnloggetBruker() {
    return {};
  }

  async bekreftAksjonspunkt() {
    return undefined;
  }

  async getSatsOgUtbetalingPerioder() {
    return [];
  }

  async hentPerioderSomKanAvkortes(): Promise<AvkortingsperioderResponse> {
    return { resultat: [] };
  }

  async hentTotrinnskontrollSkjermlenkeContext(): ReturnType<
    AktivitetspengerApi['hentTotrinnskontrollSkjermlenkeContext']
  > {
    return [];
  }
}

export const fakeAktivitetspengerApi = new FakeAktivitetspengerApi();
