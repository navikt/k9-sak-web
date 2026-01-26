import type {
  folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagDto,
  k9_oppdrag_kontrakt_simulering_v1_SimuleringDto,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto,
  k9_sak_kontrakt_behandling_BehandlingDto,
  k9_sak_kontrakt_beregningsgrunnlag_BeregningsgrunnlagKoblingDto,
  k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto,
  k9_sak_kontrakt_fagsak_FagsakDto,
  k9_sak_kontrakt_medlem_MedlemV2Dto,
  k9_sak_kontrakt_opptjening_OpptjeningerDto,
  k9_sak_kontrakt_person_PersonopplysningDto,
  k9_sak_kontrakt_søknadsfrist_SøknadsfristTilstandDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
  k9_sak_kontrakt_ytelser_OverlappendeYtelseDto,
  k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto,
  k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

interface FakeK9SakProsessApiOptions {
  vilkår?: k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[];
  aksjonspunkter?: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
  uttak?: k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder;
  beregningsresultatUtbetaling?: k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto;
  simuleringResultat?: k9_oppdrag_kontrakt_simulering_v1_SimuleringDto | null;
  fagsak?: k9_sak_kontrakt_fagsak_FagsakDto;
  personopplysninger?: k9_sak_kontrakt_person_PersonopplysningDto;
  arbeidsgiverOpplysninger?: k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto;
  beregningreferanser?: k9_sak_kontrakt_beregningsgrunnlag_BeregningsgrunnlagKoblingDto[];
  beregningsgrunnlag?: folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagDto[];
  behandling?: k9_sak_kontrakt_behandling_BehandlingDto;
  tilbakekrevingValg?: k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto;
  medlemskap?: k9_sak_kontrakt_medlem_MedlemV2Dto;
  overlappendeYtelser?: k9_sak_kontrakt_ytelser_OverlappendeYtelseDto[];
  opptjening?: k9_sak_kontrakt_opptjening_OpptjeningerDto;
  søknadsfristStatus?: k9_sak_kontrakt_søknadsfrist_SøknadsfristTilstandDto;
}

export class FakeK9SakProsessApi {
  private options: FakeK9SakProsessApiOptions;

  constructor(options: FakeK9SakProsessApiOptions = {}) {
    this.options = options;
  }

  async getVilkår(): Promise<k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[]> {
    return this.options.vilkår ?? [];
  }

  async getAksjonspunkter(): Promise<k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]> {
    return this.options.aksjonspunkter ?? [];
  }

  async getUttaksplan(): Promise<k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder> {
    return this.options.uttak ?? { uttaksplan: { perioder: {} }, simulertUttaksplan: { perioder: {} } };
  }

  async getBeregningsresultatMedUtbetaling(): Promise<k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto> {
    return this.options.beregningsresultatUtbetaling ?? { perioder: [] };
  }

  async getSimuleringResultat(): Promise<k9_oppdrag_kontrakt_simulering_v1_SimuleringDto | null> {
    return this.options.simuleringResultat ?? null;
  }

  async getFagsak(): Promise<k9_sak_kontrakt_fagsak_FagsakDto> {
    return this.options.fagsak ?? ({} as k9_sak_kontrakt_fagsak_FagsakDto);
  }

  async getPersonopplysninger(): Promise<k9_sak_kontrakt_person_PersonopplysningDto> {
    return this.options.personopplysninger ?? ({} as k9_sak_kontrakt_person_PersonopplysningDto);
  }

  async getArbeidsgiverOpplysninger(): Promise<k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto> {
    return this.options.arbeidsgiverOpplysninger ?? ({} as k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto);
  }

  async getBeregningreferanserTilVurdering(): Promise<
    k9_sak_kontrakt_beregningsgrunnlag_BeregningsgrunnlagKoblingDto[]
  > {
    return this.options.beregningreferanser ?? [];
  }

  async getAlleBeregningsgrunnlag(): Promise<
    folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagDto[]
  > {
    return this.options.beregningsgrunnlag ?? [];
  }

  async getBehandling(): Promise<k9_sak_kontrakt_behandling_BehandlingDto> {
    return this.options.behandling ?? ({} as k9_sak_kontrakt_behandling_BehandlingDto);
  }

  async getTilbakekrevingValg(): Promise<k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto> {
    return this.options.tilbakekrevingValg ?? ({} as k9_sak_kontrakt_økonomi_tilbakekreving_TilbakekrevingValgDto);
  }

  async getMedlemskap(): Promise<k9_sak_kontrakt_medlem_MedlemV2Dto> {
    return this.options.medlemskap ?? ({} as k9_sak_kontrakt_medlem_MedlemV2Dto);
  }

  async getOverlappendeYtelser(): Promise<k9_sak_kontrakt_ytelser_OverlappendeYtelseDto[]> {
    return this.options.overlappendeYtelser ?? [];
  }

  async getOpptjening(): Promise<k9_sak_kontrakt_opptjening_OpptjeningerDto> {
    return this.options.opptjening ?? ({} as k9_sak_kontrakt_opptjening_OpptjeningerDto);
  }

  async getSøknadsfristStatus(): Promise<k9_sak_kontrakt_søknadsfrist_SøknadsfristTilstandDto> {
    return this.options.søknadsfristStatus ?? ({} as k9_sak_kontrakt_søknadsfrist_SøknadsfristTilstandDto);
  }
}
