import { Period } from '@navikt/k9-fe-period-utils';
import Kilde from './Kilde';

interface Beskrivelse {
  periode: Period;
  tekst: string;
  mottattDato: string;
  kilde: Kilde;
}

export default Beskrivelse;
