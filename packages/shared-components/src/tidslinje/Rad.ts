import { ExpandedPeriode as Periode } from '@k9-sak-web/types/src/tidslinje';

interface Rad {
  radLabel: string;
  radClassname?: string;
  perioder: Periode[];
  onClick?: () => void;
  emptyRowClassname?: string;
}

export default Rad;
