import type { KompletthetsVurderingDto as KompletthetsVurdering } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsVurderingDto.js';
import type { EtterspørInntektsmeldingRequest } from '@k9-sak-web/backend/k9sak/tjenester/behandling/inntektsmelding/EtterspørInntektsmeldingRequest.js';
import type { SettBehandlingPaVentDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/SettBehandlingPaVentDto.js';

export interface InntektsmeldingApi {
  hentKompletthetsoversikt(behandlingUuid: string): Promise<KompletthetsVurdering>;
  etterspørInntektsmelding(request: EtterspørInntektsmeldingRequest): Promise<void>;
  settPåVent(request: SettBehandlingPaVentDto): Promise<void>;
}
