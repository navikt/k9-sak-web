import { OverstyrUttakFormFieldName } from '../constants/OverstyrUttakFormFieldName';
import type { OverstyrUttakFormDataUtbetalingsgrad } from './OverstyrUttakFormDataUtbetalingsgrad';

export type OverstyrUttakFormData = {
  [OverstyrUttakFormFieldName.FOM]: Date | undefined;
  [OverstyrUttakFormFieldName.TOM]: Date | undefined;
  [OverstyrUttakFormFieldName.UTTAKSGRAD]: number;
  [OverstyrUttakFormFieldName.BEGRUNNELSE]: string;
  [OverstyrUttakFormFieldName.UTBETALINGSGRADER]: OverstyrUttakFormDataUtbetalingsgrad[];
};
