import {
  inntektsmelding_etterspørInntektsmelding,
  kompletthet_utledStatusForKompletthet,
  behandlinger_settBehandlingPaVent,
} from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { KompletthetsVurderingDto as KompletthetsVurdering } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsVurderingDto.js';
import type { EtterspørInntektsmeldingRequest } from '@k9-sak-web/backend/k9sak/tjenester/behandling/inntektsmelding/EtterspørInntektsmeldingRequest.js';
import type { SettBehandlingPaVentDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/SettBehandlingPaVentDto.js';
import type { InntektsmeldingApi } from './InntektsmeldingApi.ts';

export class K9InntektsmeldingBackendClient implements InntektsmeldingApi {
  async hentKompletthetsoversikt(behandlingUuid: string): Promise<KompletthetsVurdering> {
    const response = await kompletthet_utledStatusForKompletthet({
      query: { behandlingUuid },
    });

    return response.data;
  }

  async etterspørInntektsmelding({
    orgnr,
    skjæringstidspunkt,
    behandlingUuid,
    begrunnelse,
  }: EtterspørInntektsmeldingRequest): Promise<void> {
    await inntektsmelding_etterspørInntektsmelding({
      body: {
        orgnr,
        skjæringstidspunkt,
        behandlingUuid,
        begrunnelse,
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
