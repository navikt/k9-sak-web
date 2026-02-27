import {
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagDto,
  k9_oppdrag_kontrakt_simulering_v1_SimuleringDto,
  k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto,
  k9_sak_kontrakt_behandling_BehandlingDto,
  k9_sak_kontrakt_beregningsgrunnlag_BeregningsgrunnlagKoblingDto,
  k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto,
  k9_sak_kontrakt_medlem_MedlemV2Dto,
  k9_sak_kontrakt_opptjening_OpptjeningerDto,
  k9_sak_kontrakt_person_PersonopplysningDto,
  k9_sak_kontrakt_søknadsfrist_SøknadsfristTilstandDto,
  k9_sak_kontrakt_ytelser_OverlappendeYtelseDto,
  k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto,
  k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder,
  type k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  type k9_sak_kontrakt_fagsak_FagsakDto,
  type k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

export interface K9SakProsessApi {
  getAksjonspunkter(behandlingUuid: string): Promise<k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]>;
  getVilkår(behandlingUuid: string): Promise<k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[]>;
  getFagsak(saksnummer: string): Promise<k9_sak_kontrakt_fagsak_FagsakDto>;
  getUttaksplan(
    behandlingUuid: string,
  ): Promise<k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder>;
  getBeregningsresultatMedUtbetaling(
    behandlingUuid: string,
  ): Promise<k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto>;
  getPersonopplysninger(behandlingUuid: string): Promise<k9_sak_kontrakt_person_PersonopplysningDto>;
  getArbeidsgiverOpplysninger(behandlingUuid: string): Promise<k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto>;
  getBeregningreferanserTilVurdering(
    behandlingUuid: string,
  ): Promise<k9_sak_kontrakt_beregningsgrunnlag_BeregningsgrunnlagKoblingDto[]>;
  getAlleBeregningsgrunnlag(
    behandlingUuid: string,
  ): Promise<folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagDto[]>;
  getBehandling(behandlingUuid: string): Promise<k9_sak_kontrakt_behandling_BehandlingDto>;
  getSimuleringResultat(behandlingUuid: string): Promise<k9_oppdrag_kontrakt_simulering_v1_SimuleringDto>;
  getTilbakekrevingValg(behandlingUuid: string): Promise<k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto>;
  getMedlemskap(behandlingUuid: string): Promise<k9_sak_kontrakt_medlem_MedlemV2Dto>;
  getOverlappendeYtelser(behandlingUuid: string): Promise<Array<k9_sak_kontrakt_ytelser_OverlappendeYtelseDto>>;
  getOpptjening(behandlingUuid: string): Promise<k9_sak_kontrakt_opptjening_OpptjeningerDto>;
  getSøknadsfristStatus(behandlingUuid: string): Promise<k9_sak_kontrakt_søknadsfrist_SøknadsfristTilstandDto>;
}
