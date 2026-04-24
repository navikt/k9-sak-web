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
    return {};
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

  async hentTotrinnskontrollSkjermlenkeContext() {
    return [];
  }
}

export const fakeAktivitetspengerApi = new FakeAktivitetspengerApi();
