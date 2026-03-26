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
import type { BehandlingUttakBackendApiType } from '../../prosess/uttak/BehandlingUttakBackendApiType.js';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared.js';
import { defaultArbeidsgivere } from './uttak/uttakStoryMocks.js';

export interface FakeUttakBackendConfig {
  arbeidsgivere?: ArbeidsgiverOversiktDto['arbeidsgivere'];
  inntektsgraderinger?: InntektgraderingDto;
  overstyringer?: OverstyrtUttakDto['overstyringer'];
  egneOverlappendeSaker?: EgneOverlappendeSakerDto;
  allowedRanges?: Array<{ fom: string; tom: string }>;
  onBekreftAksjonspunkt?: (requestBody: k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto) => void;
  onOverstyringUttak?: (requestBody: k9_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto) => void;
}

export class FakeUttakBackendApi implements BehandlingUttakBackendApiType {
  #arbeidsgivere: ArbeidsgiverOversiktDto['arbeidsgivere'];
  #inntektsgraderinger: InntektgraderingDto;
  #overstyringer: OverstyrtUttakDto['overstyringer'];
  #egneOverlappendeSaker: EgneOverlappendeSakerDto;
  #onBekreftAksjonspunkt: ((requestBody: k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto) => void) | undefined;
  #onOverstyringUttak:
    | ((requestBody: k9_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto) => void)
    | undefined;
  #allowedRanges: Array<{ fom: string; tom: string }> | undefined;

  constructor(config?: FakeUttakBackendConfig) {
    this.#arbeidsgivere = config?.arbeidsgivere ?? defaultArbeidsgivere;
    this.#inntektsgraderinger = config?.inntektsgraderinger ?? { perioder: [] };
    this.#overstyringer = config?.overstyringer ?? [];
    this.#egneOverlappendeSaker = config?.egneOverlappendeSaker ?? { perioderMedOverlapp: [] };
    this.#onBekreftAksjonspunkt = config?.onBekreftAksjonspunkt;
    this.#onOverstyringUttak = config?.onOverstyringUttak;
    this.#allowedRanges = config?.allowedRanges;
  }

  async hentUttak(
    behandlingUuid: string,
  ): Promise<k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder> {
    ignoreUnusedDeclared(behandlingUuid);
    throw new Error('hentUttak er ikke implementert i FakeUttakBackendApi');
  }

  async getEgneOverlappendeSaker(behandlingUuid: string): Promise<EgneOverlappendeSakerDto> {
    ignoreUnusedDeclared(behandlingUuid);
    return this.#egneOverlappendeSaker;
  }

  async bekreftAksjonspunkt(requestBody: k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto): Promise<void> {
    this.#onBekreftAksjonspunkt?.(requestBody);
  }

  async hentOverstyringUttak(behandlingUuid: string): Promise<OverstyrtUttakDto> {
    ignoreUnusedDeclared(behandlingUuid);
    return { overstyringer: this.#overstyringer, arbeidsgiverOversikt: { arbeidsgivere: this.#arbeidsgivere } };
  }

  /**
   * Returnerer overstyrbare aktiviteter for en gitt periode.
   *
   * Validerer at perioden er innenfor `allowedRanges` fra konstruktøren.
   * Returnerer én aktivitet (AT, orgnr 123456789) hvis perioden er gyldig,
   * eller tom liste hvis ingen `allowedRanges` er konfigurert eller perioden
   * faller utenfor.
   *
   * Valideringsregler:
   * - Datoer må være i ISO-format (YYYY-MM-DD)
   * - fom må være før eller lik tom
   * - Perioden må være helt innenfor én av allowedRanges
   */
  async hentAktuelleAktiviteter(
    behandlingUuid: OverstyrbareAktiviteterForUttakRequest['behandlingIdDto'],
    fom: OverstyrbareAktiviteterForUttakRequest['fom'],
    tom: OverstyrbareAktiviteterForUttakRequest['tom'],
  ): Promise<OverstyrbareUttakAktiviterDto> {
    ignoreUnusedDeclared(behandlingUuid);
    const isoDato = /^\d{4}-\d{2}-\d{2}$/;
    const empty = { arbeidsforholdsperioder: [], arbeidsgiverOversikt: { arbeidsgivere: this.#arbeidsgivere } };
    if (!this.#allowedRanges || !fom || !tom) return empty;
    if (!isoDato.test(fom) || !isoDato.test(tom) || fom > tom) return empty;
    const innenfor = this.#allowedRanges.some(r => fom >= r.fom && tom <= r.tom);
    if (!innenfor) return empty;
    return {
      arbeidsforholdsperioder: [{ type: 'AT', orgnr: '123456789', arbeidsforholdId: 'aaaaa-bbbbb' }],
      arbeidsgiverOversikt: { arbeidsgivere: this.#arbeidsgivere },
    };
  }

  async getArbeidsgivere(behandlingUuid: string): Promise<ArbeidsgiverOversiktDto> {
    ignoreUnusedDeclared(behandlingUuid);
    return { arbeidsgivere: this.#arbeidsgivere };
  }

  async overstyringUttak(
    requestBody: k9_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto,
  ): Promise<void> {
    this.#onOverstyringUttak?.(requestBody);
  }

  async hentInntektsgraderinger(behandlingUuid: string): Promise<InntektgraderingDto> {
    ignoreUnusedDeclared(behandlingUuid);
    return this.#inntektsgraderinger;
  }
}
