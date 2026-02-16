import type { Period } from '@fpsak-frontend/utils';
import type Kilde from './Kilde';

interface Beskrivelse {
  periode: Period;
  tekst: string;
  mottattDato: string;
  kilde: Kilde;
}

export default Beskrivelse;
