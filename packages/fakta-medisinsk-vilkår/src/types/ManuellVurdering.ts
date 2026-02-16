import type { Period } from '@fpsak-frontend/utils';
import type Link from './Link';
import type Vurderingsresultat from './Vurderingsresultat';

interface ManuellVurdering {
  id: string;
  resultat: Vurderingsresultat;
  periode: Period;
  gjelderForSøker: boolean;
  gjelderForAnnenPart: boolean;
  links: Link[];
  endretIDenneBehandlingen: boolean;
  erInnleggelsesperiode: boolean;
  manglerLegeerklæring?: boolean;
}

export default ManuellVurdering;
