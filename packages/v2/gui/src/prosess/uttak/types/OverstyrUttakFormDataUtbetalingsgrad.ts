import type { UttakArbeidsforholdType } from '@k9-sak-web/backend/k9sak/generated';
import { OverstyrUttakFormFieldName } from '../constants/OverstyrUttakFormFieldName';

export type OverstyrUttakFormDataUtbetalingsgrad = {
  [OverstyrUttakFormFieldName.ARBEIDSFORHOLD]: {
    [OverstyrUttakFormFieldName.TYPE]: UttakArbeidsforholdType;
    [OverstyrUttakFormFieldName.ORGNR]: string;
    [OverstyrUttakFormFieldName.AKTØR_ID]: string;
    [OverstyrUttakFormFieldName.ARBEIDSFORHOLD_ID]: string;
  };
  [OverstyrUttakFormFieldName.AKTIVITET_UTBETALINGSGRAD]: number;
};
