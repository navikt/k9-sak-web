import {
  getAksjonspunkter,
  getArbeidsgiverOpplysninger,
  hentBehandlingData,
  getPersonopplysninger,
  hentMedlemskap,
  hentUttaksplanMedUtsattePerioder,
  hentBeregningsgrunnlag,
  hentBeregningsnøklerTilVurdering,
  hentBeregningsresultatMedUtbetaling,
  hentFagsak,
  getOpptjeninger,
  hentSimuleringResultat,
  utledSøknadsfristStatus,
  hentTilbakekrevingValg,
  getVilkår,
  hentOverlappendeYtelser,
} from '@k9-sak-web/backend/k9sak/sdk.js';
import { K9SakProsessApi } from './K9SakProsessApi';

export class K9SakProsessBackendClient implements K9SakProsessApi {
  async getAksjonspunkter(behandlingUuid: string) {
    return (await getAksjonspunkter({ query: { behandlingUuid } })).data;
  }

  async getVilkår(behandlingUuid: string) {
    return (await getVilkår({ query: { behandlingUuid } })).data;
  }

  async getFagsak(saksnummer: string) {
    return (await hentFagsak({ query: { saksnummer: { saksnummer } } })).data;
  }

  async getUttaksplan(behandlingUuid: string) {
    return (await hentUttaksplanMedUtsattePerioder({ query: { behandlingUuid } })).data;
  }

  async getBeregningsresultatMedUtbetaling(behandlingUuid: string) {
    return (await hentBeregningsresultatMedUtbetaling({ query: { behandlingUuid } })).data;
  }

  async getPersonopplysninger(behandlingUuid: string) {
    return (await getPersonopplysninger({ query: { behandlingUuid } })).data;
  }

  async getArbeidsgiverOpplysninger(behandlingUuid: string) {
    return (await getArbeidsgiverOpplysninger({ query: { behandlingUuid } })).data;
  }

  async getBeregningreferanserTilVurdering(behandlingUuid: string) {
    return (await hentBeregningsnøklerTilVurdering({ query: { behandlingUuid } })).data;
  }

  async getAlleBeregningsgrunnlag(behandlingUuid: string) {
    return (await hentBeregningsgrunnlag({ query: { behandlingUuid } })).data;
  }

  async getBehandling(behandlingUuid: string) {
    return (await hentBehandlingData({ query: { behandlingUuid } })).data;
  }

  async getSimuleringResultat(behandlingUuid: string) {
    return (await hentSimuleringResultat({ query: { behandlingUuid } })).data;
  }

  async getTilbakekrevingValg(behandlingUuid: string) {
    return (await hentTilbakekrevingValg({ query: { behandlingUuid } })).data;
  }

  async getMedlemskap(behandlingUuid: string) {
    return (await hentMedlemskap({ query: { behandlingUuid } })).data;
  }

  async getOverlappendeYtelser(behandlingUuid: string) {
    return (await hentOverlappendeYtelser({ query: { behandlingUuid } })).data;
  }

  async getOpptjening(behandlingUuid: string) {
    return (await getOpptjeninger({ query: { behandlingUuid } })).data;
  }

  async getSøknadsfristStatus(behandlingUuid: string) {
    return (await utledSøknadsfristStatus({ query: { behandlingUuid } })).data;
  }
}
