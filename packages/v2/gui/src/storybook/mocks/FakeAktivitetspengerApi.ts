import type { VilkårType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AvkortingsperioderResponse } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/AvkortingsperioderResponse.js';
import type { VedtaksbrevValgResponse } from '@k9-sak-web/backend/ungsak/kontrakt/formidling/VedtaksbrevValgResponse.js';
import type { AndreLivsoppholdsytelserVurderingerResponse } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/vurdering/AndreLivsoppholdsytelserVurderingerResponse.js';
import type { AktivitetspengerApi } from '../../prosess/aktivitetspenger-prosess/AktivitetspengerApi';

export class FakeAktivitetspengerApi implements AktivitetspengerApi {
  readonly backend = 'ungsak' as const;

  async vedtaksbrevValg(): Promise<VedtaksbrevValgResponse> {
    return {
      harBrev: true,
      vedtaksbrevValg: [
        {
          dokumentMalType: {
            kilde: 'INNVILGELSE',
            kode: 'INNVILGELSE',
            kodeverk: 'DOKUMENT_MAL_TYPE',
            navn: 'Innvilgelse',
          },
        },
      ],
    };
  }

  async forhåndsvisVedtaksbrev(): Promise<Blob> {
    return new Blob();
  }

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

  async getBehandling(): ReturnType<AktivitetspengerApi['getBehandling']> {
    throw new Error('Not implemented');
  }

  async hentLovligeBehandlingsoperasjoner(behandlingUuid: string) {
    return {
      uuid: behandlingUuid,
    };
  }

  async hentBehandlingMidlertidigStatus(): ReturnType<AktivitetspengerApi['hentBehandlingMidlertidigStatus']> {
    throw new Error('Not implemented');
  }

  async hentMedlemskapFraSøknad() {
    return { perioder: [] };
  }

  async hentBostedGrunnlag() {
    return { perioder: [] };
  }

  async hentVilkårsavklaringer(_behandlingUuid: string, vilkarType: VilkårType) {
    return { perioder: [], vilkårType: vilkarType };
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

  async hentAndreLivsoppholdsytelserVurderinger(): Promise<AndreLivsoppholdsytelserVurderingerResponse> {
    return { vurderinger: [] };
  }

  async hentTotrinnskontrollSkjermlenkeContext(): ReturnType<
    AktivitetspengerApi['hentTotrinnskontrollSkjermlenkeContext']
  > {
    return [];
  }

  async getSimuleringResultat(): Promise<never> {
    throw new Error('Not implemented');
  }

  async getTilbakekrevingValg(): Promise<never> {
    throw new Error('Not implemented');
  }

  async getFagsak(): Promise<never> {
    throw new Error('Not implemented');
  }
}

export const fakeAktivitetspengerApi = new FakeAktivitetspengerApi();
