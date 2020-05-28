import Overføring from './Overføring';
import Barn from './Barn';
import Rammevedtak from '../dto/Rammevedtak';

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
