import type { K9EndreResponse } from '@k9-sak-web/backend/k9sak/tjenester/K9EndreResponse.js';
import type { K9HentResponse } from '@k9-sak-web/backend/k9sak/tjenester/K9HentResponse.js';
import type { K9OpprettResponse } from '@k9-sak-web/backend/k9sak/tjenester/K9OpprettResponse.js';
import type { K9SkjulResponse } from '@k9-sak-web/backend/k9sak/tjenester/K9SkjulResponse.js';
import type { FormState } from './FormState';

export type NotatBackendApiType = {
  getNotater(fagsakId: string): Promise<K9HentResponse>;
  opprettNotat(data: FormState, fagsakId: string): Promise<K9OpprettResponse>;
  endreNotat(data: FormState, notatId: string, saksnummer: string, versjon: number): Promise<K9EndreResponse>;
  skjulNotat(notatId: string, saksnummer: string, skjul: boolean, versjon: number): Promise<K9SkjulResponse>;
};
