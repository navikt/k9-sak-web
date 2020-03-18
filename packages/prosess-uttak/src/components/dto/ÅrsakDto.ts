import AvslåttÅrsakType from './AvslåttÅrsakType';
import InnvilgetÅrsakType from './InnvilgetÅrsakType';
import Hjemmel from './Hjemmel';

interface ÅrsakDto {
  årsak: AvslåttÅrsakType | InnvilgetÅrsakType;
  hjemler: Hjemmel[];
}

export default ÅrsakDto;
