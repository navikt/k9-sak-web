import { KodeverkMedNavn } from '../kodeverk';
import { Arbeidsgiver } from './Arbeidsgiver';

export interface Aktivitet {
  arbeidsforholdId: string;
  arbeidsgiver: Arbeidsgiver;
  eksternArbeidsforholdId?: string;
  gradering: boolean;
  prosentArbeid: number;
  stønadskontoType: KodeverkMedNavn;
  trekkdager?: number;
  trekkdagerDesimaler: number;
  utbetalingsgrad: number;
  uttakArbeidType: KodeverkMedNavn;
}
