import type { Uttaksperiode } from '@k9-sak-web/types';
import type Arbeidsforhold from './Arbeidsforhold';

interface Aktivitet {
  arbeidsforhold: Arbeidsforhold;
  uttaksperioder: Uttaksperiode[];
}

export default Aktivitet;
