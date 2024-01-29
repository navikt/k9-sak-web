import { OverstyrUttakFormFieldName } from '../constants/OverstyrUttakFormFieldName';
import { OverstyrUttakFormDataUtbetalingsgrad } from '.';

export type OverstyrUttakFormData = {
  [OverstyrUttakFormFieldName.FOM]: Date | undefined;
  [OverstyrUttakFormFieldName.TOM]: Date | undefined;
  [OverstyrUttakFormFieldName.UTTAKSGRAD]: number;
  [OverstyrUttakFormFieldName.BEGRUNNELSE]: string;
  [OverstyrUttakFormFieldName.UTBETALINGSGRADER]: OverstyrUttakFormDataUtbetalingsgrad[];
};
