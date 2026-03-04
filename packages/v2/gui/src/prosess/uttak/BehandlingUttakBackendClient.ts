import type { OverstyrbareUttakAktiviterDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrbareUttakAktiviterDto.js';
import type { OverstyrbareAktiviteterForUttakRequest } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/overstyring/OverstyrbareAktiviteterForUttakRequest.js';
import type { BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import type { BekreftetOgOverstyrteAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftetOgOverstyrteAksjonspunkterDto.js';
import type { OverstyrtUttakDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrtUttakDto.js';
import type { InntektgraderingDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/inntektgradering/InntektgraderingDto.js';
import type { EgneOverlappendeSakerDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/søskensaker/EgneOverlappendeSakerDto.js';
import type { UttaksplanMedUtsattePerioder } from '@k9-sak-web/backend/k9sak/tjenester/behandling/uttak/UttaksplanMedUtsattePerioder.js';
import {
  bekreftAksjonspunkt,
  overstyrAksjonspunkt,
  getArbeidsgiverOpplysninger,
  getInntektsgradering,
  hentUttaksplanMedUtsattePerioder,
  getOverstyrtUttak,
  hentEgneOverlappendeSaker,
  hentOverstyrbareAktiviteterForUttak,
} from '@k9-sak-web/backend/k9sak/sdk.js';

export default class BehandlingUttakBackendClient {
  constructor() {}

  async hentUttak(
    behandlingUuid: string,
  ): Promise<UttaksplanMedUtsattePerioder> {
    return (await hentUttaksplanMedUtsattePerioder({ query: { behandlingUuid } })).data;
  }

  async getEgneOverlappendeSaker(behandlingUuid: string): Promise<EgneOverlappendeSakerDto> {
    return (await hentEgneOverlappendeSaker({ body: behandlingUuid })).data ?? null;
  }

  async bekreftAksjonspunkt(requestBody: BekreftedeAksjonspunkterDto): Promise<void> {
    await bekreftAksjonspunkt({ body: requestBody });
  }

  async hentOverstyringUttak(behandlingUuid: string): Promise<OverstyrtUttakDto> {
    const result = await getOverstyrtUttak({ query: { behandlingUuid } });
    return result.data ?? { overstyringer: [] };
  }

  async hentAktuelleAktiviteter(
    behandlingUuid: OverstyrbareAktiviteterForUttakRequest['behandlingIdDto'],
    fom: OverstyrbareAktiviteterForUttakRequest['fom'],
    tom: OverstyrbareAktiviteterForUttakRequest['tom'],
  ): Promise<OverstyrbareUttakAktiviterDto> {
    return (
      await hentOverstyrbareAktiviteterForUttak({
        body: {
          behandlingIdDto: behandlingUuid,
          fom,
          tom,
        },
      })
    ).data;
  }

  async getArbeidsgivere(behandlingUuid: string) {
    return (await getArbeidsgiverOpplysninger({ query: { behandlingUuid } })).data ?? [];
  }
  async overstyringUttak(
    requestBody: BekreftetOgOverstyrteAksjonspunkterDto,
  ): Promise<void> {
    await overstyrAksjonspunkt({ body: requestBody });
  }

  async hentInntektsgraderinger(behandlingUuid: string): Promise<InntektgraderingDto> {
    return (
      (await getInntektsgradering({ query: { behandlingUuid } })).data ?? null
    );
  }
}
