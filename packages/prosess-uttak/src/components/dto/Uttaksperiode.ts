import Utbetalingsgrad from './Utbetalingsgrad';
import Utfalltype from './Utfall';
import Årsak from './Årsak';

interface Uttaksperiode extends Partial<Årsak> {
  utfall: Utfalltype;
  årsaker?: Årsak[];
  grad?: number;
  utbetalingsgrader?: Utbetalingsgrad[];
}

export default Uttaksperiode;
