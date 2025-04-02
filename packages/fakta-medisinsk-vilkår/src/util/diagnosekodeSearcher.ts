import type { ICD10Diagnosekode } from '@navikt/diagnosekoder';
import type Diagnosekode from '../types/Diagnosekode';
import {
  type DiagnosekodeSearcherPromise as typ,
  initDiagnosekodeSearcher,
} from '@k9-sak-web/gui/shared/diagnosekodeVelger/diagnosekodeSearcher.js';

export type DiagnosekodeSearcherPromise = typ;

export const toLegacyDiagnosekode = (icd10Code: ICD10Diagnosekode): Diagnosekode => ({
  kode: icd10Code.code,
  beskrivelse: icd10Code.text,
});

export default initDiagnosekodeSearcher;
