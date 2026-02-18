import { Uttaksperiode } from '@k9-sak-web/types';
import Arbeidsforhold from './Arbeidsforhold';

interface Aktivitet {
  arbeidsforhold: Arbeidsforhold;
  uttaksperioder: Uttaksperiode[];
}

export default Aktivitet;
