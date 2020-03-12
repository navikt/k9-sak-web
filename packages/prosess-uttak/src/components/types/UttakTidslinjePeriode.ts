import Periode from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/Periode';
import Uttaksperiode from './Uttaksperiode';

interface UttakTidslinjePeriode extends Periode {
  periodeinfo: Uttaksperiode & {
    behandlingsId: string;
  };
}

export default UttakTidslinjePeriode;
