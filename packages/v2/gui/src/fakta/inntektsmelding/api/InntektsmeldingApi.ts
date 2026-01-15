import type { KompletthetsVurderingDto as KompletthetsVurdering } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsVurderingDto.js';
import type { ArbeidsgiverArbeidsforholdId } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/ArbeidsgiverArbeidsforholdId.js';

export interface SendInntektsmeldingOppgaveRequest {
  behandlingUuid: string;
  førsteFraværsdag: string;
  arbeidsgiver: ArbeidsgiverArbeidsforholdId;
  begrunnelse?: string;
}

export interface SendInntektsmeldingOppgaveResponse {
  oppgaveSendt: boolean;
  tidligereOppgaveSendtDato?: string;
}

export interface InntektsmeldingApi {
  hentKompletthetsoversikt(behandlingUuid: string): Promise<KompletthetsVurdering>;
  sendInntektsmeldingOppgave(request: SendInntektsmeldingOppgaveRequest): Promise<SendInntektsmeldingOppgaveResponse>;
}
