import { Period } from '@fpsak-frontend/utils';
import Kilde from './Kilde';

interface Beskrivelse {
  periode: Period;
  tekst: string;
  mottattDato: string;
  kilde: Kilde;
}

export default Beskrivelse;
