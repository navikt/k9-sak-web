import Periode from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/Periode';
import { Periodeinfo } from './UttakTypes';

interface UttakPeriode extends Periode {
  periodeinfo: Periodeinfo & {
    behandlingsId: string;
  };
}

export default UttakPeriode;
