import type { BostedGrunnlagResponseDto } from '@k9-sak-web/backend/ungsak/kontrakt/bosatt/BostedGrunnlagResponseDto.js';
import type { AktivitetspengerApi } from '../../prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';

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

  async hentBehandlingMidlertidigStatus(): Promise<never> {
    throw new Error('Not implemented');
  }

  async hentMedlemskapFraSøknad() {
    return {};
  }

  async hentBostedGrunnlag(): Promise<BostedGrunnlagResponseDto> {
    return { perioder: [] };
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
}

export const fakeAktivitetspengerApi = new FakeAktivitetspengerApi();
