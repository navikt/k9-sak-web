import type { Kodeverk } from '../../../shared/Kodeverk';
import { type k9_sak_kontrakt_beregningsresultat_BeregningsresultatPeriodeAndelDto as BeregningsresultatPeriodeAndelDto } from '../../generated/types.js';

export type AktivitetStatusType = Exclude<BeregningsresultatPeriodeAndelDto['aktivitetStatus'], null | undefined>;
export type AktivitetStatusTypeKodeverk = Kodeverk<AktivitetStatusType, 'AKTIVITET_STATUS'>;

type AktivitetStatusName =
  | 'MIDL_INAKTIV'
  | 'AAP'
  | 'AT'
  | 'DP'
  | 'SP_AV_DP'
  | 'PSB_AV_DP'
  | 'FL'
  | 'MS'
  | 'SN'
  | 'AT_FL'
  | 'AT_SN'
  | 'FL_SN'
  | 'AT_FL_SN'
  | 'BA'
  | 'IKKE_YRKESAKTIV'
  | 'KUN_YTELSE'
  | 'TY'
  | 'VENTELØNN_VARTPENGER'
  | '-';

export const aktivitetStatusType: Readonly<Record<AktivitetStatusName, AktivitetStatusType>> = {
  MIDL_INAKTIV: 'MIDL_INAKTIV',
  AAP: 'AAP',
  AT: 'AT',
  DP: 'DP',
  SP_AV_DP: 'SP_AV_DP',
  PSB_AV_DP: 'PSB_AV_DP',
  FL: 'FL',
  MS: 'MS',
  SN: 'SN',
  AT_FL: 'AT_FL',
  AT_SN: 'AT_SN',
  FL_SN: 'FL_SN',
  AT_FL_SN: 'AT_FL_SN',
  BA: 'BA',
  IKKE_YRKESAKTIV: 'IKKE_YRKESAKTIV',
  KUN_YTELSE: 'KUN_YTELSE',
  TY: 'TY',
  VENTELØNN_VARTPENGER: 'VENTELØNN_VARTPENGER',
  '-': '-',
};
