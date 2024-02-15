import Arbeidsgiver from './Arbeidsgiver';
import { KodeverkMedNavn } from '../kodeverk';

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

export default Aktivitet;
