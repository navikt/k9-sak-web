import Periode from './Periode';
import { TidslinjeIkon } from '../Tidslinje';

interface TidslinjeRad<Periodeinfo> {
  ikon: TidslinjeIkon;
  id: string;
  perioder: Periode<Periodeinfo>[];
}

export default TidslinjeRad;
