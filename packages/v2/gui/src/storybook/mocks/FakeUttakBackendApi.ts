import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/ArbeidsgiverOversiktDto.js';
import type { EgneOverlappendeSakerDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/søskensaker/EgneOverlappendeSakerDto.js';
import type { InntektgraderingDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/inntektgradering/InntektgraderingDto.js';
import type { BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import type { BekreftetOgOverstyrteAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftetOgOverstyrteAksjonspunkterDto.js';
import type { UttaksplanMedUtsattePerioder } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/UttaksplanMedUtsattePerioder.js';
import type { OverstyrbareAktiviteterForUttakRequest } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/overstyring/OverstyrbareAktiviteterForUttakRequest.js';
import type { OverstyrbareUttakAktiviterDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrbareUttakAktiviterDto.js';
import type { OverstyrtUttakDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrtUttakDto.js';
import type { UttakBackendApiType } from '../../prosess/uttak/api/UttakBackendApiType.js';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared.js';
import { defaultArbeidsgivere, lagUttak } from './uttak/uttakStoryMocks.js';

export interface FakeUttakBackendConfig {
  arbeidsgivere?: ArbeidsgiverOversiktDto['arbeidsgivere'];
  inntektsgraderinger?: InntektgraderingDto;
  overstyringer?: OverstyrtUttakDto['overstyringer'];
  egneOverlappendeSaker?: EgneOverlappendeSakerDto;
  uttak?: UttaksplanMedUtsattePerioder;
  allowedRanges?: Array<{ fom: string; tom: string }>;
  onBekreftAksjonspunkt?: (requestBody: BekreftedeAksjonspunkterDto) => void;
  onOverstyringUttak?: (requestBody: BekreftetOgOverstyrteAksjonspunkterDto) => void;
}

export class FakeUttakBackendApi implements UttakBackendApiType {
  readonly backend = 'k9sak';
  #arbeidsgivere: ArbeidsgiverOversiktDto['arbeidsgivere'];
  #inntektsgraderinger: InntektgraderingDto;
  #overstyringer: OverstyrtUttakDto['overstyringer'];
  #egneOverlappendeSaker: EgneOverlappendeSakerDto;
  #uttak: UttaksplanMedUtsattePerioder;
  #onBekreftAksjonspunkt: ((requestBody: BekreftedeAksjonspunkterDto) => void) | undefined;
  #onOverstyringUttak: ((requestBody: BekreftetOgOverstyrteAksjonspunkterDto) => void) | undefined;
  #allowedRanges: Array<{ fom: string; tom: string }> | undefined;

  constructor(config?: FakeUttakBackendConfig) {
    this.#arbeidsgivere = config?.arbeidsgivere ?? defaultArbeidsgivere;
    this.#inntektsgraderinger = config?.inntektsgraderinger ?? { perioder: [] };
    this.#overstyringer = config?.overstyringer ?? [];
    this.#egneOverlappendeSaker = config?.egneOverlappendeSaker ?? { perioderMedOverlapp: [] };
    this.#uttak = config?.uttak ?? lagUttak([]);
    this.#onBekreftAksjonspunkt = config?.onBekreftAksjonspunkt;
    this.#onOverstyringUttak = config?.onOverstyringUttak;
    this.#allowedRanges = config?.allowedRanges;
  }

  async hentUttak(behandlingUuid: string): Promise<UttaksplanMedUtsattePerioder> {
    ignoreUnusedDeclared(behandlingUuid);
    return this.#uttak;
  }

  async getEgneOverlappendeSaker(behandlingUuid: string): Promise<EgneOverlappendeSakerDto> {
    ignoreUnusedDeclared(behandlingUuid);
    return this.#egneOverlappendeSaker;
  }

  async bekreftAksjonspunkt(requestBody: BekreftedeAksjonspunkterDto): Promise<void> {
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

  async overstyringUttak(requestBody: BekreftetOgOverstyrteAksjonspunkterDto): Promise<void> {
    this.#onOverstyringUttak?.(requestBody);
  }

  async hentInntektsgraderinger(behandlingUuid: string): Promise<InntektgraderingDto> {
    ignoreUnusedDeclared(behandlingUuid);
    return this.#inntektsgraderinger;
  }
}
