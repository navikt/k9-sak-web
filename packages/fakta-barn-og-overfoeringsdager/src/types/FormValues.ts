import { Rammevedtak } from '@k9-sak-web/types';
import Overføring from './Overføring';
import Barn from './Barn';

interface FormValues {
  barn: Barn[];
  midlertidigAleneansvar?: Rammevedtak;
  overføringFår: Overføring[];
  overføringGir: Overføring[];
  fordelingFår: Overføring[];
  fordelingGir: Overføring[];
  koronaoverføringFår: Overføring[];
  koronaoverføringGir: Overføring[];
}

export default FormValues;
