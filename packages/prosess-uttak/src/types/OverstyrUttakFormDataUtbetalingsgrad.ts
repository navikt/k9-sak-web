import { OverstyrUttakFormFieldName } from '../constants/OverstyrUttakFormFieldName';

export type OverstyrUttakFormDataUtbetalingsgrad = {
  [OverstyrUttakFormFieldName.ARBEIDSFORHOLD]: {
    [OverstyrUttakFormFieldName.TYPE]: string;
    [OverstyrUttakFormFieldName.ORGANISASJONSNUMMER]: string;
    [OverstyrUttakFormFieldName.AKTØR_ID]: string;
    [OverstyrUttakFormFieldName.ARBEIDSFORHOLD_ID]: string;
  };
  [OverstyrUttakFormFieldName.AKTIVITET_UTBETALINGSGRAD]: number;
};
