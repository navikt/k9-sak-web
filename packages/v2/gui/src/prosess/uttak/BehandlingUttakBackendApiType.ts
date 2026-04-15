import type {
  k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto,
  k9_sak_kontrakt_uttak_søskensaker_EgneOverlappendeSakerDto as EgneOverlappendeSakerDto,
  k9_sak_kontrakt_uttak_inntektgradering_InntektgraderingDto as InntektgraderingDto,
  k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto,
  k9_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto,
  k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder,
  k9_sak_web_app_tjenester_behandling_uttak_overstyring_OverstyrbareAktiviteterForUttakRequest as OverstyrbareAktiviteterForUttakRequest,
  k9_sak_kontrakt_uttak_overstyring_OverstyrbareUttakAktiviterDto as OverstyrbareUttakAktiviterDto,
  k9_sak_kontrakt_uttak_overstyring_OverstyrtUttakDto as OverstyrtUttakDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

export type BehandlingUttakBackendApiType = {
  hentUttak(behandlingUuid: string): Promise<k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder>;
  getEgneOverlappendeSaker(behandlingUuid: string): Promise<EgneOverlappendeSakerDto>;
  bekreftAksjonspunkt(requestBody: k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto): Promise<void>;
  hentOverstyringUttak(behandlingUuid: string): Promise<OverstyrtUttakDto>;
  hentAktuelleAktiviteter(
    behandlingUuid: OverstyrbareAktiviteterForUttakRequest['behandlingIdDto'],
    fom: OverstyrbareAktiviteterForUttakRequest['fom'],
    tom: OverstyrbareAktiviteterForUttakRequest['tom'],
  ): Promise<OverstyrbareUttakAktiviterDto>;
  getArbeidsgivere(behandlingUuid: string): Promise<ArbeidsgiverOversiktDto>;
  overstyringUttak(requestBody: k9_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto): Promise<void>;
  hentInntektsgraderinger(behandlingUuid: string): Promise<InntektgraderingDto>;
};
