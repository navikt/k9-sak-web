import {
  aksjonspunkt_getAksjonspunkter1,
  arbeidsgiver_getArbeidsgiverOpplysninger,
  behandlinger_hentBehandlingData1,
  behandlingPerson_getPersonopplysninger,
  behandlingPerson_hentMedlemskap,
  behandlingPleiepengerUttak_uttaksplanMedUtsattePerioder,
  beregningsgrunnlag_hentBeregningsgrunnlagene,
  beregningsgrunnlag_hentNøkkelknippe,
  beregningsresultat_hentBeregningsresultatMedUtbetaling,
  fagsak_hentFagsak,
  simulering_hentSimuleringResultat,
  tilbakekrevingsvalg_hentTilbakekrevingValg,
  vilkår_getVilkårV3,
  ytelser_hentOverlappendeYtelser,
} from '@navikt/k9-sak-typescript-client/sdk';
import { K9SakProsessApi } from './K9SakProsessApi';

export class K9SakProsessBackendClient implements K9SakProsessApi {
  async getAksjonspunkter(behandlingUuid: string) {
    return (await aksjonspunkt_getAksjonspunkter1({ query: { behandlingUuid } })).data;
  }

  async getVilkår(behandlingUuid: string) {
    return (await vilkår_getVilkårV3({ query: { behandlingUuid } })).data;
  }

  async getFagsak(saksnummer: string) {
    return (await fagsak_hentFagsak({ query: { saksnummer: { saksnummer } } })).data;
  }

  async getUttaksplan(behandlingUuid: string) {
    return (await behandlingPleiepengerUttak_uttaksplanMedUtsattePerioder({ query: { behandlingUuid } })).data;
  }

  async getBeregningsresultatMedUtbetaling(behandlingUuid: string) {
    return (await beregningsresultat_hentBeregningsresultatMedUtbetaling({ query: { behandlingUuid } })).data;
  }

  async getPersonopplysninger(behandlingUuid: string) {
    return (await behandlingPerson_getPersonopplysninger({ query: { behandlingUuid } })).data;
  }

  async getArbeidsgiverOpplysninger(behandlingUuid: string) {
    return (await arbeidsgiver_getArbeidsgiverOpplysninger({ query: { behandlingUuid } })).data;
  }

  async getBeregningreferanserTilVurdering(behandlingUuid: string) {
    return (await beregningsgrunnlag_hentNøkkelknippe({ query: { behandlingUuid } })).data;
  }

  async getAlleBeregningsgrunnlag(behandlingUuid: string) {
    return (await beregningsgrunnlag_hentBeregningsgrunnlagene({ query: { behandlingUuid } })).data;
  }

  async getBehandling(behandlingUuid: string) {
    return (await behandlinger_hentBehandlingData1({ query: { behandlingUuid } })).data;
  }

  async getSimuleringResultat(behandlingUuid: string) {
    return (await simulering_hentSimuleringResultat({ query: { behandlingUuid } })).data;
  }

  async getTilbakekrevingValg(behandlingUuid: string) {
    return (await tilbakekrevingsvalg_hentTilbakekrevingValg({ query: { behandlingUuid } })).data;
  }

  async getMedlemskap(behandlingUuid: string) {
    return (await behandlingPerson_hentMedlemskap({ query: { behandlingUuid } })).data;
  }

  async getHOverlappendeYtelser(behandlingUuid: string) {
    return (await ytelser_hentOverlappendeYtelser({ query: { behandlingUuid } })).data;
  }
}
