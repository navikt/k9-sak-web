import AvslåttÅrsak from './AvslåttÅrsak';
import InnvilgetÅrsak from './InnvilgetÅrsak';
import Hjemmel from './Hjemmel';

interface Årsak {
  årsak: AvslåttÅrsak | InnvilgetÅrsak;
  hjemler: Hjemmel[];
}

export default Årsak;
