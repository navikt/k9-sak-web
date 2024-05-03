import { Period } from '@k9-sak-web/utils';
import Kilde from './Kilde';

interface Beskrivelse {
  periode: Period;
  tekst: string;
  mottattDato: string;
  kilde: Kilde;
}

export default Beskrivelse;
