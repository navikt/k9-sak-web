import { Arbeidsforhold } from './Arbeidsforhold';

interface Utbetalingsgrad {
  arbeidsforhold: Arbeidsforhold;
  normalArbeidstid: string;
  faktiskArbeidstid: string;
  utbetalingsgrad: number;
}

export default Utbetalingsgrad;
