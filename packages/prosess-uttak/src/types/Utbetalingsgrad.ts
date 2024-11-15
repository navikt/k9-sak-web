import { Arbeidsforhold } from './Arbeidsforhold';

export interface Utbetalingsgrad {
  arbeidsforhold: Arbeidsforhold;
  normalArbeidstid: string;
  faktiskArbeidstid: string;
  utbetalingsgrad: number;
  tilkommet: boolean;
}

export default Utbetalingsgrad;
