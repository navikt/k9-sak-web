import type { ICD10Diagnosekode } from '@navikt/diagnosekoder';
import type Diagnosekode from '../types/Diagnosekode';

export const toLegacyDiagnosekode = (icd10Code: ICD10Diagnosekode): Diagnosekode => ({
  kode: icd10Code.code,
  beskrivelse: icd10Code.text,
});
