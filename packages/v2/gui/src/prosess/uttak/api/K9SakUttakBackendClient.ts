import type { BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import type { BekreftetOgOverstyrteAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftetOgOverstyrteAksjonspunkterDto.js';
import type { InntektgraderingDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/inntektgradering/InntektgraderingDto.js';
import type { OverstyrbareUttakAktiviterDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrbareUttakAktiviterDto.js';
import type { OverstyrtUttakDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrtUttakDto.js';
import type { EgneOverlappendeSakerDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/søskensaker/EgneOverlappendeSakerDto.js';
import {
  aksjonspunkt_bekreft,
  aksjonspunkt_overstyr,
  arbeidsgiver_getArbeidsgiverOpplysninger,
  behandlingPleiepengerInntektsgradering_getInntektsgradering,
  behandlingPleiepengerUttak_uttaksplanMedUtsattePerioder,
  behandlingUttak_getOverstyrtUttak,
  behandlingUttak_hentEgneOverlappendeSaker,
  behandlingUttak_hentOverstyrbareAktiviterForUttak,
} from '@k9-sak-web/backend/k9sak/sdk/UttakSdk.js';
import type { OverstyrbareAktiviteterForUttakRequest } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/overstyring/OverstyrbareAktiviteterForUttakRequest.js';
import type { UttaksplanMedUtsattePerioder } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/UttaksplanMedUtsattePerioder.js';
import type { UttakBackendApiType } from './UttakBackendApiType.js';

export class K9SakUttakBackendClient implements UttakBackendApiType {
  readonly backend = 'k9sak';

  async hentUttak(behandlingUuid: string): Promise<UttaksplanMedUtsattePerioder> {
    return (await behandlingPleiepengerUttak_uttaksplanMedUtsattePerioder({ query: { behandlingUuid } })).data;
  }

  async getEgneOverlappendeSaker(behandlingUuid: string): Promise<EgneOverlappendeSakerDto> {
    return (await behandlingUttak_hentEgneOverlappendeSaker({ body: behandlingUuid })).data ?? null;
  }

  async bekreftAksjonspunkt(requestBody: BekreftedeAksjonspunkterDto): Promise<void> {
    await aksjonspunkt_bekreft({ body: requestBody });
  }

  async hentOverstyringUttak(behandlingUuid: string): Promise<OverstyrtUttakDto> {
    const result = await behandlingUttak_getOverstyrtUttak({ query: { behandlingUuid } });
    return result.data ?? { overstyringer: [] };
  }

  async hentAktuelleAktiviteter(
    behandlingUuid: OverstyrbareAktiviteterForUttakRequest['behandlingIdDto'],
    fom: OverstyrbareAktiviteterForUttakRequest['fom'],
    tom: OverstyrbareAktiviteterForUttakRequest['tom'],
  ): Promise<OverstyrbareUttakAktiviterDto> {
    return (
      await behandlingUttak_hentOverstyrbareAktiviterForUttak({
        body: {
          behandlingIdDto: behandlingUuid,
          fom,
          tom,
        },
      })
    ).data;
  }

  async getArbeidsgivere(behandlingUuid: string) {
    return (await arbeidsgiver_getArbeidsgiverOpplysninger({ query: { behandlingUuid } })).data ?? [];
  }

  async overstyringUttak(requestBody: BekreftetOgOverstyrteAksjonspunkterDto): Promise<void> {
    await aksjonspunkt_overstyr({ body: requestBody });
  }

  async hentInntektsgraderinger(behandlingUuid: string): Promise<InntektgraderingDto> {
    return (
      (await behandlingPleiepengerInntektsgradering_getInntektsgradering({ query: { behandlingUuid } })).data ?? null
    );
  }
}
