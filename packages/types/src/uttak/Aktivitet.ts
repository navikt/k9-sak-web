import Arbeidsgiver from './Arbeidsgiver';
import { Kodeverk } from '../kodeverk';

export interface Aktivitet {
  arbeidsforholdId: string;
  arbeidsgiver: Arbeidsgiver;
  eksternArbeidsforholdId?: string;
  gradering: boolean;
  prosentArbeid: number;
  stønadskontoType: Kodeverk;
  trekkdager?: number;
  trekkdagerDesimaler: number;
  utbetalingsgrad: number;
  uttakArbeidType: Kodeverk;
}

export default Aktivitet;
