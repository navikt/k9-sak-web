import Overføring from './Overføring';
import Barn from './Barn';

interface FormValues {
  barn: Barn[];
  midlertidigAleneansvar?: {
    erMidlertidigAlene: boolean;
    fom: string;
    tom: string;
  };
  overføringFår: Overføring[];
  overføringGir: Overføring[];
  fordelingFår: Overføring[];
  fordelingGir: Overføring[];
  koronaoverføringFår: Overføring[];
  koronaoverføringGir: Overføring[];
  begrunnelse: string;
}

export default FormValues;
