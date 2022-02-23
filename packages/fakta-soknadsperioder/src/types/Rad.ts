import { Periode } from './types.external';

interface Rad {
  radLabel: string;
  radClassname?: string;
  perioder: Periode[];
  onClick?: () => void;
  emptyRowClassname?: string;
}

export default Rad;
