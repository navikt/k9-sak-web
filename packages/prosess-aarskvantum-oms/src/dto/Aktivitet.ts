import Arbeidsforhold from './Arbeidsforhold';
import Uttaksperiode from './Uttaksperiode';

interface Aktivitet {
  arbeidsforhold: Arbeidsforhold;
  uttaksperioder: Uttaksperiode[];
}

export default Aktivitet;
