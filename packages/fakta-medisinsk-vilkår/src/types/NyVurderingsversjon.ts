import { Period } from '@fpsak-frontend/utils';
import Dokument from './Dokument';
import Vurderingsresultat from './Vurderingsresultat';

export default interface NyVurderingsversjon {
  behandlingUuid: string;
  perioder: Period[];
  resultat: Vurderingsresultat;
  tekst: string;
  tilknyttedeDokumenter: Dokument[];
  type: string;
  id?: string;
  versjon?: string;
  dryRun?: boolean;
}
