import {
  etterspørInntektsmelding,
  utledKompletthetsStatus,
  settBehandlingPåVent,
} from '@k9-sak-web/backend/k9sak/sdk.js';
import type { KompletthetsVurderingDto as KompletthetsVurdering } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsVurderingDto.js';
import type { EtterspørInntektsmeldingRequest } from '@k9-sak-web/backend/k9sak/tjenester/behandling/inntektsmelding/EtterspørInntektsmeldingRequest.js';
import type { SettBehandlingPaVentDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/SettBehandlingPaVentDto.js';
import type { InntektsmeldingApi } from './InntektsmeldingApi.ts';

export class K9InntektsmeldingBackendClient implements InntektsmeldingApi {
  async hentKompletthetsoversikt(behandlingUuid: string): Promise<KompletthetsVurdering> {
    const response = await utledKompletthetsStatus({
      query: { behandlingUuid },
    });

    return response.data;
  }

  async etterspørInntektsmelding({
    orgnr,
    skjæringstidspunkt,
    behandlingUuid,
    begrunnelse,
    behandlingVersjon,
  }: EtterspørInntektsmeldingRequest): Promise<void> {
    await etterspørInntektsmelding({
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
    await settBehandlingPåVent({
      body: {
        behandlingId,
        behandlingVersjon,
        frist,
        ventearsak,
      },
    });
  }
}
