import Overføring from './Overføring';
import { BarnHentetAutomatisk, BarnLagtTilAvSakbehandler } from './Barn';

interface FormValues {
  barn: BarnHentetAutomatisk[];
  barnLagtTilAvSaksbehandler: BarnLagtTilAvSakbehandler[];
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
