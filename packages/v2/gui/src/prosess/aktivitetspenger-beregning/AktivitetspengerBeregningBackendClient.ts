import { arbeidsgiver_getArbeidsgiverOpplysninger } from '@k9-sak-web/backend/ungsak/kontrakt/arbeidsforhold/api.js';
import { kontroll_hentKontrollerInntekt } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/api.js';
import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/ungsak/kontrakt/arbeidsforhold/ArbeidsgiverOversiktDto.js';
import type { KontrollerInntektDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/KontrollerInntektDto.js';
import type { AktivitetspengerBeregningBackendApiType } from './AktivitetspengerBeregningBackendApiType';
import type { FastsettInntektDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/FastsettInntektDto.js';
import { aksjonspunkt_bekreft } from '@navikt/ung-sak-typescript-client/sdk';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';

export class AktivitetspengerBeregningBackendClient implements AktivitetspengerBeregningBackendApiType {
  async getKontrollerInntekt(behandlingUuid: string): Promise<KontrollerInntektDto> {
    return (await kontroll_hentKontrollerInntekt({ query: { behandlingUuid } })).data;
  }

  async getArbeidsgiverOpplysninger(behandlingUuid: string): Promise<ArbeidsgiverOversiktDto> {
    return (await arbeidsgiver_getArbeidsgiverOpplysninger({ query: { behandlingUuid } })).data;
  }

  async bekreftKontrollerInntektAksjonspunkt(
    behandlingUuid: string,
    behandlingVersjon: number,
    fastsettInntektDto: FastsettInntektDto,
  ) {
    await aksjonspunkt_bekreft({
      body: {
        behandlingId: behandlingUuid,
        behandlingVersjon,
        bekreftedeAksjonspunktDtoer: [
          {
            '@type': AksjonspunktDefinisjon.KONTROLLER_INNTEKT,
            ...fastsettInntektDto,
          },
        ],
      },
    });
  }
}
