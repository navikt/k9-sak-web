import { Arbeidstype } from '../constants';
import { OverstyrUttakFormFieldName } from '../constants/OverstyrUttakFormFieldName';

export type OverstyrUttakFormDataUtbetalingsgrad = {
  [OverstyrUttakFormFieldName.ARBEIDSFORHOLD]: {
    [OverstyrUttakFormFieldName.TYPE]: Arbeidstype;
    [OverstyrUttakFormFieldName.ORGNR]: string;
    [OverstyrUttakFormFieldName.AKTØR_ID]: string;
    [OverstyrUttakFormFieldName.ARBEIDSFORHOLD_ID]: string;
  };
  [OverstyrUttakFormFieldName.AKTIVITET_UTBETALINGSGRAD]: number;
};
