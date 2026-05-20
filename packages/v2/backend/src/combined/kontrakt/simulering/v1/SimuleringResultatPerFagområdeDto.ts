import type { k9_oppdrag_kontrakt_simulering_v1_SimuleringResultatPerFagområdeDto as K9SakSimuleringResultatPerFagområdeDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { k9_oppdrag_kontrakt_simulering_v1_SimuleringResultatPerFagområdeDto as UngSakSimuleringResultatPerFagområdeDto } from '@k9-sak-web/backend/ungsak/generated/types.js';

export type SimuleringResultatPerFagområdeDto =
  | K9SakSimuleringResultatPerFagområdeDto
  | UngSakSimuleringResultatPerFagområdeDto;
