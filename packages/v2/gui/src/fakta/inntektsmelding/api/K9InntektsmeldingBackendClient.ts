import {
  inntektsmelding_etterspørInntektsmelding,
  kompletthet_utledStatusForKompletthet,
  behandlinger_settBehandlingPaVent,
} from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { KompletthetsVurderingDto as KompletthetsVurdering } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsVurderingDto.js';
import { Vurdering } from '@k9-sak-web/backend/k9sak/kodeverk/kompletthet/Vurdering.js';
import type { EtterspørInntektsmeldingRequest } from '@k9-sak-web/backend/k9sak/tjenester/behandling/inntektsmelding/EtterspørInntektsmeldingRequest.js';
import type { SettBehandlingPaVentDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/SettBehandlingPaVentDto.js';
import type { InntektsmeldingApi } from './InntektsmeldingApi.ts';

export class K9InntektsmeldingBackendClient implements InntektsmeldingApi {
  async hentKompletthetsoversikt(behandlingUuid: string): Promise<KompletthetsVurdering> {
    const response = await kompletthet_utledStatusForKompletthet({
      query: { behandlingUuid },
    });

    return {
      ...response.data,
      tilstand: response.data.tilstand.map(tilstand => ({
        ...tilstand,
        vurdering: this.mapVurdering(tilstand.vurdering),
      })),
    };
  }

  // TODO Fjern så snart fiks for Vurdering enum i k9-sak er rulla ut i prod. (Mapper KAN_FORTSETTE til FORTSETT som snart skal returnerast direkte frå backend.)
  private mapVurdering(vurdering: string | undefined): Vurdering | undefined {
    if (vurdering === undefined) {
      return undefined;
    }

    if (vurdering === 'KAN_FORTSETTE') {
      return Vurdering.KAN_FORTSETTE;
    }

    if (vurdering === 'UDEFINERT') {
      return Vurdering.UDEFINERT;
    }

    return vurdering as Vurdering;
  }

  async etterspørInntektsmelding({
    orgnr,
    skjæringstidspunkt,
    behandlingUuid,
    begrunnelse,
    behandlingVersjon,
  }: EtterspørInntektsmeldingRequest): Promise<void> {
    await inntektsmelding_etterspørInntektsmelding({
      body: {
        orgnr,
        skjæringstidspunkt,
        behandlingUuid,
        begrunnelse,
        behandlingVersjon,
      },
    });
  }

  async settPåVent({ behandlingId, behandlingVersjon, frist, ventearsak }: SettBehandlingPaVentDto): Promise<void> {
    await behandlinger_settBehandlingPaVent({
      body: {
        behandlingId,
        behandlingVersjon,
        frist,
        ventearsak,
      },
    });
  }
}
