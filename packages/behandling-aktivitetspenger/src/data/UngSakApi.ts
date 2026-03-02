import {
  ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  ung_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto,
  ung_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto,
  ung_sak_kontrakt_AsyncPollingStatus,
  ung_sak_kontrakt_behandling_BehandlingDto,
  ung_sak_kontrakt_fagsak_FagsakDto,
  ung_sak_kontrakt_person_PersonopplysningDto,
  ung_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export interface UngSakApi {
  getAksjonspunkter(behandlingId: string): Promise<ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]>;
  lagreAksjonspunkt(props: ung_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto): Promise<unknown>;
  lagreAksjonspunktOverstyr(
    props: ung_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto,
  ): Promise<unknown>;
  getVilkår(behandlingUuid: string): Promise<ung_sak_kontrakt_vilkår_VilkårMedPerioderDto[]>;
  getFagsak(saksnummer: string): Promise<ung_sak_kontrakt_fagsak_FagsakDto>;
  //   getUttaksplan(
  //     behandlingUuid: string,
  //   ): Promise<k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder>;
  //   getBeregningsresultatMedUtbetaling(
  //     behandlingUuid: string,
  //   ): Promise<k9_sak_kontrakt_beregningsresultat_BeregningsresultatMedUtbetaltePeriodeDto>;
  getPersonopplysninger(behandlingUuid: string): Promise<ung_sak_kontrakt_person_PersonopplysningDto>;
  //   getArbeidsgiverOpplysninger(behandlingUuid: string): Promise<k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto>;
  //   getBeregningreferanserTilVurdering(
  //     behandlingUuid: string,
  //   ): Promise<k9_sak_kontrakt_beregningsgrunnlag_BeregningsgrunnlagKoblingDto[]>;
  //   getAlleBeregningsgrunnlag(
  //     behandlingUuid: string,
  //   ): Promise<folketrygdloven_kalkulus_response_v1_beregningsgrunnlag_gui_BeregningsgrunnlagDto[]>;
  getBehandling(behandlingUuid: string): Promise<ung_sak_kontrakt_behandling_BehandlingDto>;
  hentBehandlingMidlertidigStatus(behandlingUuid: string): Promise<ung_sak_kontrakt_AsyncPollingStatus>;
}
