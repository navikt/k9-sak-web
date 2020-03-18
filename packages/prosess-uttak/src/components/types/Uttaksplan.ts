import Uttaksperiode from './Uttaksperiode';
import Person from './Person';

interface Uttaksplan {
  behandlingId: string;
  perioder: Uttaksperiode[];
  person: Person;
}

export default Uttaksplan;
