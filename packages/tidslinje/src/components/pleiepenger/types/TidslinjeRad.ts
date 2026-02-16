import type Periode from './Periode';
import type TidslinjeIkon from './TidslinjeIkon';

interface TidslinjeRad<Periodeinfo> {
  ikon?: TidslinjeIkon;
  id: string;
  perioder: Periode<Periodeinfo>[];
}

export default TidslinjeRad;
