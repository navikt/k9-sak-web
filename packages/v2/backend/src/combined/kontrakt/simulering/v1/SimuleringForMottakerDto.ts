import type { k9_oppdrag_kontrakt_simulering_v1_SimuleringForMottakerDto as K9SakSimuleringForMottakerDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { k9_oppdrag_kontrakt_simulering_v1_SimuleringForMottakerDto as UngSakSimuleringForMottakerDto } from '@k9-sak-web/backend/ungsak/generated/types.js';

export type SimuleringForMottakerDto = K9SakSimuleringForMottakerDto | UngSakSimuleringForMottakerDto;
