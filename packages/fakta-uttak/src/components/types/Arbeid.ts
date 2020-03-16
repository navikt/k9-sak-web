import ArbeidsforholdPeriode from './ArbeidsforholdPeriode';
import Arbeidsforhold from './Arbeidsforhold';

interface Arbeid {
  arbeidsforhold: Arbeidsforhold;
  perioder: ArbeidsforholdPeriode[];
}

export default Arbeid;
