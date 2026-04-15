import type { k9_oppdrag_kontrakt_simulering_v1_SimuleringDto as K9SakSimuleringDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { k9_oppdrag_kontrakt_simulering_v1_SimuleringDto as UngSakSimuleringDto } from '@k9-sak-web/backend/ungsak/generated/types.js';

export type SimuleringDto = K9SakSimuleringDto | UngSakSimuleringDto;
