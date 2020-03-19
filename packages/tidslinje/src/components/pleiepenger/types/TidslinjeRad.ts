import Periode from './Periode';
import TidslinjeIkon from './TidslinjeIkon';

interface TidslinjeRad<Periodeinfo> {
  ikon?: TidslinjeIkon;
  id: string;
  perioder: Periode<Periodeinfo>[];
}

export default TidslinjeRad;
