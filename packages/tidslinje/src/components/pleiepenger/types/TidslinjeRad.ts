import Periode from './Periode';
import { TidslinjeIkon } from '../Tidslinje';

interface TidslinjeRad<T extends Periode> {
  ikon: TidslinjeIkon;
  id: string;
  perioder: T[];
}

export default TidslinjeRad;
