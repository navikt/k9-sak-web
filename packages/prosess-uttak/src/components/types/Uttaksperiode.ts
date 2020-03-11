import Utbetalingsgrad from './Utbetalingsgrad';
import Utfalltype from './Utfall';

interface Uttaksperiode {
  utfall: Utfalltype;
  årsak?: string; // TODO: årsakskoder
  hjemler?: any[]; // TODO: type?
  årsaker?: {
    årsak: string;
    hjemler: {
      henvisning: string;
      anvendelse: string;
    }[];
  }[];
  grad?: number;
  utbetalingsgrader?: Utbetalingsgrad[];
}

export default Uttaksperiode;
