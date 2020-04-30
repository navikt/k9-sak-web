import Årsak from './Årsak';
import Utfalltype from './Utfall';

interface Uttaksperiode {
  periode: string; // fom/tom
  delvisFravær?: string; // Duration
  utfall: Utfalltype;
  årsak: Årsak;
  utbetalingsgrad: number;
}

export default Uttaksperiode;
