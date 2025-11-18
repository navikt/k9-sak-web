import type {
  EndreResponse,
  HentResponse,
  OpprettResponse,
  SkjulResponse,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { FormState } from './FormState';

export type NotatBackendApiType = {
  getNotater(fagsakId: string): Promise<HentResponse>;
  opprettNotat(data: FormState, fagsakId: string): Promise<OpprettResponse>;
  endreNotat(data: FormState, notatId: string, saksnummer: string, versjon: number): Promise<EndreResponse>;
  skjulNotat(notatId: string, saksnummer: string, skjul: boolean, versjon: number): Promise<SkjulResponse>;
};
