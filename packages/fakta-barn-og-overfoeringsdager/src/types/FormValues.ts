import Overføring from './Overføring';
import { BarnHentetAutomatisk, BarnLagtTilAvSakbehandler } from './Barn';

interface FormValues {
  barn: BarnHentetAutomatisk[];
  barnLagtTilAvSaksbehandler: BarnLagtTilAvSakbehandler[];
  midlertidigAleneansvar?: {
    erMidlertidigAlene: boolean;
    fom?: string;
    tom: string;
  };
  overføringFår: Overføring[];
  koronaoverføringFår: Overføring[];
  overføringGir: Overføring[];
  koronaoverføringGir: Overføring[];
}

export default FormValues;
