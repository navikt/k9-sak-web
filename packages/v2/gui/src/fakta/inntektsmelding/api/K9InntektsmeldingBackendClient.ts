import { kompletthet_utledStatusForKompletthet } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { KompletthetsVurderingDto as KompletthetsVurdering } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsVurderingDto.js';
import type {
  InntektsmeldingApi,
  SendInntektsmeldingOppgaveRequest,
  SendInntektsmeldingOppgaveResponse,
} from './InntektsmeldingApi.ts';

export class K9InntektsmeldingBackendClient implements InntektsmeldingApi {
  async hentKompletthetsoversikt(behandlingUuid: string): Promise<KompletthetsVurdering> {
    const response = await kompletthet_utledStatusForKompletthet({
      query: { behandlingUuid },
    });
    return response.data;
  }

  async sendInntektsmeldingOppgave(
    request: SendInntektsmeldingOppgaveRequest,
  ): Promise<SendInntektsmeldingOppgaveResponse> {
    // TODO: Implementer faktisk API-kall når backend er klar
    // Dette er en placeholder som sjekker status og sender oppgave
    // For nå returnerer vi en mock response
    throw new Error('Not implemented yet - backend endpoint må implementeres');
  }
}
