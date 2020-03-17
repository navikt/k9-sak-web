import AvslåttÅrsakType from './AvslåttÅrsakType';
import Hjemmel from './Hjemmel';

interface AvslåttÅrsak {
  årsak: AvslåttÅrsakType;
  hjemler: Hjemmel[];
}

export default AvslåttÅrsak;
