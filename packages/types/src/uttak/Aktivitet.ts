import Arbeidsgiver from './Arbeidsgiver';

export interface Aktivitet {
  arbeidsforholdId: string;
  arbeidsgiver: Arbeidsgiver;
  eksternArbeidsforholdId?: string;
  gradering: boolean;
  prosentArbeid: number;
  stønadskontoType: string;
  trekkdager?: number;
  trekkdagerDesimaler: number;
  utbetalingsgrad: number;
  uttakArbeidType: string;
}

export default Aktivitet;
