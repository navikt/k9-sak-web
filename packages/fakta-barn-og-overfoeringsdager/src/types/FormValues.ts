import type Overføring from './Overføring';

interface FormValues {
  overføringFår: Overføring[];
  overføringGir: Overføring[];
  fordelingFår: Overføring[];
  fordelingGir: Overføring[];
  koronaoverføringFår: Overføring[];
  koronaoverføringGir: Overføring[];
}

export default FormValues;
