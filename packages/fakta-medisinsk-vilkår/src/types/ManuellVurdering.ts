import { Period } from '@fpsak-frontend/utils';
import Vurderingsresultat from './Vurderingsresultat';
import Link from './Link';

interface ManuellVurdering {
  id: string;
  resultat: Vurderingsresultat;
  periode: Period;
  gjelderForSøker: boolean;
  gjelderForAnnenPart: boolean;
  links: Link[];
  endretIDenneBehandlingen: boolean;
  erInnleggelsesperiode: boolean;
  innleggelsesbegrunnelse?: string;
  manglerLegeerklæring?: boolean;
}

export default ManuellVurdering;
