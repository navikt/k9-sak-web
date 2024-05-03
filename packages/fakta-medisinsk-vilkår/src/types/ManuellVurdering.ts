import { Period } from '@k9-sak-web/utils';
import Link from './Link';
import Vurderingsresultat from './Vurderingsresultat';

interface ManuellVurdering {
  id: string;
  resultat: Vurderingsresultat;
  periode: Period;
  gjelderForSøker: boolean;
  gjelderForAnnenPart: boolean;
  links: Link[];
  endretIDenneBehandlingen: boolean;
  erInnleggelsesperiode: boolean;
}

export default ManuellVurdering;
